import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, TrendingDown, RefreshCw, Trash2, Percent } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  productId: string;
  productName: string;
  size: "M" | "L";
  quantity: number;
  price: number;
  variantLabel?: string;
}

interface AbandonedCart {
  id: string;
  session_id: string;
  items: CartItem[];
  total_items: number;
  total_amount: number;
  converted: boolean;
  created_at: string;
  last_activity: string;
}

const ABANDON_THRESHOLD_MIN = 30;

const AbandonedCartsManager = () => {
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCarts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("abandoned_carts")
      .select("*")
      .order("last_activity", { ascending: false })
      .limit(200);

    if (error) {
      toast.error("Error cargando carritos");
      console.error(error);
    } else {
      setCarts((data || []) as unknown as AbandonedCart[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  const isAbandoned = (cart: AbandonedCart) => {
    if (cart.converted) return false;
    const last = new Date(cart.last_activity).getTime();
    const now = Date.now();
    return now - last > ABANDON_THRESHOLD_MIN * 60 * 1000;
  };

  const isActive = (cart: AbandonedCart) => {
    if (cart.converted) return false;
    return !isAbandoned(cart);
  };

  const abandoned = carts.filter(isAbandoned);
  const active = carts.filter(isActive);
  const converted = carts.filter((c) => c.converted);

  const totalCarts = carts.length;
  const conversionRate = totalCarts > 0 ? (converted.length / totalCarts) * 100 : 0;
  const lostRevenue = abandoned.reduce((sum, c) => sum + c.total_amount, 0);

  // Most abandoned products
  const productCounts = new Map<string, { name: string; count: number }>();
  abandoned.forEach((cart) => {
    cart.items.forEach((item) => {
      const key = item.productName + (item.variantLabel ? ` (${item.variantLabel})` : "");
      const existing = productCounts.get(key);
      productCounts.set(key, {
        name: key,
        count: (existing?.count || 0) + item.quantity,
      });
    });
  });
  const topAbandoned = Array.from(productCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = Date.now();
    const diffMin = Math.floor((now - d.getTime()) / 60000);
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffMin < 1440) return `Hace ${Math.floor(diffMin / 60)} h`;
    return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("abandoned_carts").delete().eq("id", id);
    if (error) {
      toast.error("No se pudo eliminar");
    } else {
      toast.success("Carrito eliminado");
      setCarts((prev) => prev.filter((c) => c.id !== id));
    }
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Cargando carritos...</div>;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <ShoppingCart className="h-3 w-3" /> Carritos abandonados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{abandoned.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Sin actividad &gt;{ABANDON_THRESHOLD_MIN}min</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Percent className="h-3 w-3" /> Conversión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">{converted.length} de {totalCarts} carritos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <TrendingDown className="h-3 w-3" /> Dinero no concretado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ${lostRevenue.toLocaleString("es-AR")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">En carritos abandonados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <ShoppingCart className="h-3 w-3" /> Carritos activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{active.length}</div>
            <p className="text-xs text-muted-foreground mt-1">En curso ahora mismo</p>
          </CardContent>
        </Card>
      </div>

      {/* Top abandoned products */}
      {topAbandoned.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Productos más abandonados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topAbandoned.map((p) => (
                <div key={p.name} className="flex justify-between items-center text-sm">
                  <span className="text-foreground">{p.name}</span>
                  <Badge variant="secondary">{p.count} {p.count === 1 ? "unidad" : "unidades"}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* List of abandoned carts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Carritos abandonados ({abandoned.length})</CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchCarts}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {abandoned.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No hay carritos abandonados todavía 🎉
            </p>
          ) : (
            <div className="space-y-3">
              {abandoned.map((cart) => (
                <div key={cart.id} className="border border-border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        ${cart.total_amount.toLocaleString("es-AR")} · {cart.total_items} {cart.total_items === 1 ? "burrito" : "burritos"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Última actividad: {formatTime(cart.last_activity)}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(cart.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cart.items.map((item, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {item.productName} {item.size === "M" ? "REG" : "XL"} x{item.quantity}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AbandonedCartsManager;
