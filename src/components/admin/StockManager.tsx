import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/config/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Save } from "lucide-react";

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

  if (isLoading) return <p>Cargando stock...</p>;

  return (
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
  );
};

export default StockManager;
