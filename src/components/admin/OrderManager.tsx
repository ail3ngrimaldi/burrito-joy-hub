import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/config/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
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

const OrderManager = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<OrderItem[]>([{ productId: "", size: "M", quantity: 1 }]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

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

  const createOrderMutation = useMutation({
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

      // Calculate total
      let total = 0;
      const orderItems = validItems.map((item) => {
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

      // Create order
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

      // Create order items
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems.map((i) => ({ ...i, order_id: order.id })));

      if (itemsError) throw itemsError;

      // Decrement stock for each item (use compound ID for variants)
      for (const item of validItems) {
        const stockId = item.variantId ? `${item.productId}-${item.variantId}` : item.productId;
        await supabase.rpc("decrement_stock", {
          p_product_id: stockId,
          p_size: item.size,
          p_quantity: item.quantity,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stock"] });
      queryClient.invalidateQueries({ queryKey: ["product-stock"] });
      toast.success("Pedido registrado");
      resetForm();
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
      toast.success("Estado actualizado");
    },
  });

  const resetForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setDeliveryDate("");
    setNotes("");
    setItems([{ productId: "", size: "M", quantity: 1 }]);
  };

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
            <Button><Plus className="h-4 w-4 mr-2" /> Nuevo Pedido</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Pedido</DialogTitle>
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
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex gap-2 items-end">
                        <Select value={item.productId} onValueChange={(v) => {
                          updateItem(idx, "productId", v);
                          // Reset variant when product changes
                          const updated = [...items];
                          updated[idx].variantId = undefined;
                          setItems(updated);
                        }}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((p) => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {hasVariants && (
                          <Select value={item.variantId || ""} onValueChange={(v) => updateItem(idx, "variantId", v)}>
                            <SelectTrigger className="w-36">
                              <SelectValue placeholder="Variante" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedProduct.variants!.map((v) => (
                                <SelectItem key={v.id} value={v.id}>{v.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        <Select value={item.size} onValueChange={(v) => updateItem(idx, "size", v)}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">M</SelectItem>
                            <SelectItem value="L">L</SelectItem>
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
                    </div>
                  );
                })}
                <Button variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-3 w-3 mr-1" /> Agregar producto
                </Button>
              </div>

              <Button
                className="w-full"
                onClick={() => createOrderMutation.mutate()}
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? "Guardando..." : "Registrar Pedido"}
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManager;
