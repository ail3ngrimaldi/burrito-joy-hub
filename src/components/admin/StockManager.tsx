import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { products, type ProductSize } from "@/config/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Save, TrendingUp } from "lucide-react";
import { useMemo } from "react";

interface StockRow {
  id: string;
  product_id: string;
  size: string;
  quantity: number;
}

const StockManager = () => {
  const queryClient = useQueryClient();
  const [edits, setEdits] = useState<Record<string, number>>({});

  const { data: stock, isLoading } = useQuery({
    queryKey: ["admin-stock"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_stock")
        .select("*")
        .order("product_id");
      if (error) throw error;
      return data as StockRow[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const { error } = await supabase
        .from("product_stock")
        .update({ quantity })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-stock"] });
      queryClient.invalidateQueries({ queryKey: ["product-stock"] });
    },
  });

  const handleSaveAll = async () => {
    const entries = Object.entries(edits);
    if (entries.length === 0) return;

    try {
      for (const [id, quantity] of entries) {
        await updateMutation.mutateAsync({ id, quantity });
      }
      setEdits({});
      toast.success("Stock actualizado");
    } catch {
      toast.error("Error al actualizar stock");
    }
  };

  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || productId;
  };

  const getValue = (row: StockRow) => {
    return edits[row.id] !== undefined ? edits[row.id] : row.quantity;
  };

  const getUnitPrice = (productId: string, size: string): number => {
    // Resolve compound IDs (e.g. "mexican-chicken-cheddar") to base product
    const direct = products.find((p) => p.id === productId);
    const base = direct ?? products.find((p) => productId.startsWith(`${p.id}-`));
    if (!base) return 0;
    return base.prices[size as ProductSize] ?? 0;
  };

  const potentialRevenue = useMemo(() => {
    if (!stock) return 0;
    return stock.reduce((sum, row) => {
      const qty = getValue(row);
      return sum + qty * getUnitPrice(row.product_id, row.size);
    }, 0);
  }, [stock, edits]);

  if (isLoading) return <p>Cargando stock...</p>;

  return (
    <div className="space-y-4">
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Potencial de ingresos
              </p>
              <p className="text-xs text-muted-foreground">
                Si vendiéramos todo el stock actual
              </p>
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">
            ${potentialRevenue.toLocaleString("es-AR")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestión de Stock</CardTitle>
          <Button onClick={handleSaveAll} disabled={Object.keys(edits).length === 0}>
            <Save className="h-4 w-4 mr-2" /> Guardar cambios
          </Button>
        </CardHeader>
        <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Tamaño</TableHead>
              <TableHead className="w-32">Cantidad</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stock?.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{getProductName(row.product_id)}</TableCell>
                <TableCell>{row.size}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    className="w-24"
                    value={getValue(row)}
                    onChange={(e) =>
                      setEdits((prev) => ({
                        ...prev,
                        [row.id]: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockManager;
