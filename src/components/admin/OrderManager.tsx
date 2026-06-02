import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/config/site";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type OrderStatus = Database["public"]["Enums"]["order_status"];

interface OrderItem {
  productId: string;
  variantId?: string;
  size: string;
  quantity: number;
}

const statusLabels: Record<string, string> = {
  pendiente: "Pendiente",
  por_entregar: "Por entregar",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const statusColors: Record<string, string> = {
  pendiente: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
  por_entregar: "bg-blue-500/20 text-blue-700 border-blue-500/30",
  entregado: "bg-green-500/20 text-green-700 border-green-500/30",
  cancelado: "bg-red-500/20 text-red-700 border-red-500/30",
};

// Convert a stored product_id (which may include variant suffix) back to base+variant
const splitStoredProductId = (storedId: string): { productId: string; variantId?: string } => {
  // Try exact match first
  const direct = products.find((p) => p.id === storedId);
  if (direct) return { productId: storedId };
  // Try matching as base-variant
  for (const p of products) {
    if (p.variants && storedId.startsWith(p.id + "-")) {
      const variantId = storedId.slice(p.id.length + 1);
      const variant = p.variants.find((v) => v.id === variantId);
      if (variant) return { productId: p.id, variantId };
    }
  }
  return { productId: storedId };
};

const OrderManager = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [originalItems, setOriginalItems] = useState<Array<{ product_id: string; size: string; quantity: number }>>([]);
  const [originalStatus, setOriginalStatus] = useState<OrderStatus | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<OrderItem[]>([{ productId: "", size: "R", quantity: 1 }]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const resetForm = () => {
    setEditingOrderId(null);
    setOriginalItems([]);
    setOriginalStatus(null);
    setCustomerName("");
    setCustomerPhone("");
    setDeliveryDate("");
    setNotes("");
    setItems([{ productId: "", size: "R", quantity: 1 }]);
  };

  const openEditDialog = (order: any) => {
    setEditingOrderId(order.id);
    setOriginalStatus(order.status);
    setCustomerName(order.customer_name || "");
    setCustomerPhone(order.customer_phone || "");
    setDeliveryDate(order.delivery_date || "");
    setNotes(order.notes || "");
    const orig = (order.order_items || []).map((i: any) => ({
      product_id: i.product_id,
      size: i.size,
      quantity: i.quantity,
    }));
    setOriginalItems(orig);
    const formItems: OrderItem[] = (order.order_items || []).map((i: any) => {
      const { productId, variantId } = splitStoredProductId(i.product_id);
      return { productId, variantId, size: i.size, quantity: i.quantity };
    });
    setItems(formItems.length ? formItems : [{ productId: "", size: "R", quantity: 1 }]);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  const saveOrderMutation = useMutation({
    mutationFn: async () => {
      const validItems = items.filter((i) => i.productId);
      if (validItems.length === 0) throw new Error("Agregá al menos un producto");
      if (!customerName.trim()) throw new Error("Ingresá el nombre del cliente");

      // Validate variants
      for (const item of validItems) {
        const product = products.find((p) => p.id === item.productId);
        if (product?.variants && product.variants.length > 0 && !item.variantId) {
          throw new Error(`Seleccioná la variante para ${product.name}`);
        }
      }

      // Compute new aggregated needs
      const newNeeds = new Map<string, { qty: number; label: string; size: string }>();
      for (const item of validItems) {
        const product = products.find((p) => p.id === item.productId);
        const variant = product?.variants?.find((v) => v.id === item.variantId);
        const stockId = item.variantId ? `${item.productId}-${item.variantId}` : item.productId;
        const key = `${stockId}|${item.size}`;
        const label = variant ? `${product?.name} (${variant.label})` : (product?.name || item.productId);
        const existing = newNeeds.get(key);
        newNeeds.set(key, {
          qty: (existing?.qty || 0) + item.quantity,
          label,
          size: item.size,
        });
      }

      // Compute old contributions (only if editing AND original status was not cancelado)
      const oldContrib = new Map<string, number>();
      if (editingOrderId && originalStatus !== "cancelado") {
        for (const oi of originalItems) {
          const key = `${oi.product_id}|${oi.size}`;
          oldContrib.set(key, (oldContrib.get(key) || 0) + oi.quantity);
        }
      }

      // Compute net delta needed per stock key (new - old). Validate availability for positive deltas.
      const allKeys = new Set<string>([...newNeeds.keys(), ...oldContrib.keys()]);
      const stockIds = Array.from(allKeys).map((k) => k.split("|")[0]);
      const { data: stockRows, error: stockError } = await supabase
        .from("product_stock")
        .select("product_id, size, quantity")
        .in("product_id", stockIds);
      if (stockError) throw new Error("No se pudo verificar el stock");

      for (const key of allKeys) {
        const [pid, size] = key.split("|");
        const need = newNeeds.get(key)?.qty || 0;
        const old = oldContrib.get(key) || 0;
        const delta = need - old;
        if (delta > 0) {
          const row = stockRows?.find((r) => r.product_id === pid && r.size === size);
          const available = row?.quantity ?? 0;
          if (available < delta) {
            const label = newNeeds.get(key)?.label || pid;
            throw new Error(
              `Stock insuficiente: ${label} ${size === "R" ? "REGULAR" : "XL"} (disponible: ${available}, faltan: ${delta})`
            );
          }
        }
      }

      // Build items to insert
      let total = 0;
      const orderItemsRows = validItems.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        const variant = product?.variants?.find((v) => v.id === item.variantId);
        const price = product?.prices[item.size as "M" | "L"] || 0;
        total += price * item.quantity;
        return {
          product_id: item.variantId ? `${item.productId}-${item.variantId}` : item.productId,
          product_name: variant ? `${product?.name} (${variant.label})` : (product?.name || item.productId),
          size: item.size,
          quantity: item.quantity,
          unit_price: price,
        };
      });

      let orderId = editingOrderId;

      if (editingOrderId) {
        // Update order base fields
        const { error: updErr } = await supabase
          .from("orders")
          .update({
            customer_name: customerName.trim(),
            customer_phone: customerPhone.trim() || null,
            delivery_date: deliveryDate || null,
            notes: notes.trim() || null,
            total_amount: total,
          })
          .eq("id", editingOrderId);
        if (updErr) throw updErr;

        // Replace items: delete old then insert new
        const { error: delErr } = await supabase
          .from("order_items")
          .delete()
          .eq("order_id", editingOrderId);
        if (delErr) throw delErr;
      } else {
        // Create new order
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            customer_name: customerName.trim(),
            customer_phone: customerPhone.trim() || null,
            delivery_date: deliveryDate || null,
            notes: notes.trim() || null,
            total_amount: total,
            status: "pendiente" as OrderStatus,
          })
          .select()
          .single();
        if (orderError) throw orderError;
        orderId = order.id;
      }

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsRows.map((i) => ({ ...i, order_id: orderId! })));
      if (itemsError) throw itemsError;

      // Apply stock deltas
      for (const key of allKeys) {
        const [pid, size] = key.split("|");
        const need = newNeeds.get(key)?.qty || 0;
        const old = oldContrib.get(key) || 0;
        const delta = need - old;
        if (delta > 0) {
          await supabase.rpc("decrement_stock", {
            p_product_id: pid,
            p_size: size,
            p_quantity: delta,
          });
        } else if (delta < 0) {
          // Restore stock by negative decrement is not supported; use direct update
          const { data: row } = await supabase
            .from("product_stock")
            .select("quantity")
            .eq("product_id", pid)
            .eq("size", size)
            .maybeSingle();
          const current = row?.quantity ?? 0;
          await supabase
            .from("product_stock")
            .update({ quantity: current + (-delta) })
            .eq("product_id", pid)
            .eq("size", size);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stock"] });
      queryClient.invalidateQueries({ queryKey: ["product-stock"] });
      toast.success(editingOrderId ? "Pedido actualizado" : "Pedido registrado");
      setOpen(false);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status: status as OrderStatus })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stock"] });
      queryClient.invalidateQueries({ queryKey: ["product-stock"] });
      toast.success("Estado actualizado");
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const order = orders?.find((o) => o.id === orderId);
      if (!order) throw new Error("Pedido no encontrado");

      // If the order was active (not cancelado), restore stock for each item
      if (order.status !== "cancelado") {
        for (const oi of (order.order_items || []) as any[]) {
          const { data: row } = await supabase
            .from("product_stock")
            .select("quantity")
            .eq("product_id", oi.product_id)
            .eq("size", oi.size)
            .maybeSingle();
          const current = row?.quantity ?? 0;
          await supabase
            .from("product_stock")
            .update({ quantity: current + oi.quantity })
            .eq("product_id", oi.product_id)
            .eq("size", oi.size);
        }
      }

      // Delete items first, then the order
      const { error: delItemsErr } = await supabase
        .from("order_items")
        .delete()
        .eq("order_id", orderId);
      if (delItemsErr) throw delItemsErr;

      const { error: delOrderErr } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);
      if (delOrderErr) throw delOrderErr;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stock"] });
      queryClient.invalidateQueries({ queryKey: ["product-stock"] });
      toast.success("Pedido eliminado");
      setDeleteConfirmId(null);
    },
    onError: (err: Error) => {
      toast.error(err.message);
      setDeleteConfirmId(null);
    },
  });

  const addItem = () => setItems([...items, { productId: "", size: "M", quantity: 1 }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: keyof OrderItem, value: string | number | undefined) => {
    const updated = [...items];
    (updated[idx] as any)[field] = value;
    setItems(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Pedidos</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" /> Nuevo Pedido
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingOrderId ? "Editar Pedido" : "Registrar Pedido"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Nombre *</Label>
                  <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Teléfono</Label>
                  <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Fecha entrega</Label>
                  <Input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Notas</Label>
                  <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Productos</Label>
                {items.map((item, idx) => {
                  const selectedProduct = products.find((p) => p.id === item.productId);
                  const hasVariants = selectedProduct?.variants && selectedProduct.variants.length > 0;
                  const isSingleSize = !!selectedProduct?.singleSize;
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex gap-2 items-end flex-wrap">
                        <Select value={item.productId} onValueChange={(v) => {
                          const product = products.find((p) => p.id === v);
                          const updated = [...items];
                          updated[idx] = {
                            ...updated[idx],
                            productId: v,
                            variantId: undefined,
                            size: product?.singleSize ? "M" : updated[idx].size,
                          };
                          setItems(updated);
                        }}>
                          <SelectTrigger className="flex-1 min-w-[140px]">
                            <SelectValue placeholder="Producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((p) => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={item.size}
                          onValueChange={(v) => updateItem(idx, "size", v)}
                          disabled={isSingleSize}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">M</SelectItem>
                            {!isSingleSize && <SelectItem value="L">L</SelectItem>}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          min={1}
                          className="w-16"
                          value={item.quantity}
                          onChange={(e) => updateItem(idx, "quantity", parseInt(e.target.value) || 1)}
                        />
                        {items.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removeItem(idx)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {hasVariants && (
                        <div className="pl-1">
                          <Select value={item.variantId || ""} onValueChange={(v) => updateItem(idx, "variantId", v)}>
                            <SelectTrigger className={`w-full ${!item.variantId ? "border-destructive" : ""}`}>
                              <SelectValue placeholder="⚠️ Elegí tipo de queso (obligatorio)" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedProduct.variants!.map((v) => (
                                <SelectItem key={v.id} value={v.id}>{v.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  );
                })}
                <Button variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-3 w-3 mr-1" /> Agregar producto
                </Button>
              </div>

              <Button
                className="w-full"
                onClick={() => saveOrderMutation.mutate()}
                disabled={saveOrderMutation.isPending}
              >
                {saveOrderMutation.isPending
                  ? "Guardando..."
                  : editingOrderId
                  ? "Guardar Cambios"
                  : "Registrar Pedido"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Revenue summary */}
      {!isLoading && orders && orders.length > 0 && (() => {
        const nonCancelled = orders.filter((o) => o.status !== "cancelado");
        const totalRevenue = nonCancelled.reduce((sum, o) => sum + (o.total_amount || 0), 0);
        const pendingCount = orders.filter((o) => o.status === "pendiente").length;
        const porEntregarCount = orders.filter((o) => o.status === "por_entregar").length;
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <CardContent className="py-3 px-4">
                <p className="text-xs text-muted-foreground">Ingresos totales</p>
                <p className="text-xl font-bold text-primary">${totalRevenue.toLocaleString("es-AR")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-3 px-4">
                <p className="text-xs text-muted-foreground">Total pedidos</p>
                <p className="text-xl font-bold text-foreground">{orders.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-3 px-4">
                <p className="text-xs text-muted-foreground">Pendientes</p>
                <p className="text-xl font-bold text-yellow-600">{pendingCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-3 px-4">
                <p className="text-xs text-muted-foreground">Por entregar</p>
                <p className="text-xl font-bold text-blue-600">{porEntregarCount}</p>
              </CardContent>
            </Card>
          </div>
        );
      })()}

      {isLoading ? (
        <p>Cargando pedidos...</p>
      ) : orders?.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No hay pedidos registrados
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {[...(orders || [])]
            .sort((a, b) => {
              if (a.status === "cancelado" && b.status !== "cancelado") return 1;
              if (a.status !== "cancelado" && b.status === "cancelado") return -1;
              return 0;
            })
            .filter((order) => statusFilter === "all" || order.status === statusFilter)
            .map((order) => (
            <Card key={order.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{order.customer_name}</span>
                      {order.customer_phone && (
                        <span className="text-sm text-muted-foreground">{order.customer_phone}</span>
                      )}
                      <Badge variant="outline" className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {order.order_items?.map((item: any) => (
                        <span key={item.id} className="mr-3">
                          {item.quantity}x {item.product_name} ({item.size})
                        </span>
                      ))}
                    </div>
                    {order.delivery_date && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Entrega: {order.delivery_date}
                      </div>
                    )}
                    {order.notes && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Nota: {order.notes}
                      </div>
                    )}
                    <div className="text-sm font-medium mt-1">
                      Total: ${order.total_amount?.toLocaleString("es-AR")}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Select
                      value={order.status}
                      onValueChange={(v) => updateStatusMutation.mutate({ id: order.id, status: v })}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="por_entregar">Por entregar</SelectItem>
                        <SelectItem value="entregado">Entregado</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(order)}
                        title="Editar pedido"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDeleteConfirmId(order.id)}
                        title="Eliminar pedido"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteConfirmId} onOpenChange={(o) => !o && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Si el pedido no estaba cancelado, el stock se devolverá automáticamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && deleteOrderMutation.mutate(deleteConfirmId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrderManager;
