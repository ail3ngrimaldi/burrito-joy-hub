import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/config/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#f97316", "#ef4444", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"];

const AnalyticsManager = () => {
  const { data: orderItems, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_items")
        .select("product_id, product_name, size, quantity, unit_price, order_id, orders!inner(status)");
      if (error) throw error;
      return data as any[];
    },
  });

  if (isLoading) return <p>Cargando métricas...</p>;

  // Filter out cancelled orders
  const validItems = orderItems?.filter((i) => i.orders?.status !== "cancelado") || [];

  // Aggregate by product
  const productStats: Record<string, { name: string; totalQty: number; totalRevenue: number; bySize: Record<string, number> }> = {};
  
  validItems.forEach((item) => {
    // Strip variant suffix to aggregate by base product
    const baseId = item.product_id.replace(/-(?:cremalight|cheddar)$/, "");
    const key = baseId;
    if (!productStats[key]) {
      const product = products.find((p) => p.id === baseId);
      productStats[key] = {
        name: product?.name || item.product_name,
        totalQty: 0,
        totalRevenue: 0,
        bySize: {},
      };
    }
    productStats[key].totalQty += item.quantity;
    productStats[key].totalRevenue += item.quantity * item.unit_price;
    const sizeLabel = item.size === "M" ? "REGULAR" : item.size === "L" ? "XL" : item.size;
    productStats[key].bySize[sizeLabel] = (productStats[key].bySize[sizeLabel] || 0) + item.quantity;
  });

  const barData = Object.values(productStats)
    .sort((a, b) => b.totalQty - a.totalQty)
    .map((s) => ({ name: s.name, cantidad: s.totalQty, ingresos: s.totalRevenue }));

  const pieData = Object.values(productStats)
    .sort((a, b) => b.totalQty - a.totalQty)
    .map((s) => ({ name: s.name, value: s.totalQty }));

  const totalBurritos = validItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalRevenue = validItems.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);

  // Size distribution
  const sizeStats: Record<string, number> = {};
  validItems.forEach((item) => {
    const sizeLabel = item.size === "M" ? "REGULAR" : item.size === "L" ? "XL" : item.size;
    sizeStats[sizeLabel] = (sizeStats[sizeLabel] || 0) + item.quantity;
  });
  const sizeData = Object.entries(sizeStats).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total burritos vendidos</p>
            <p className="text-3xl font-bold text-foreground">{totalBurritos}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Ingresos totales</p>
            <p className="text-3xl font-bold text-primary">${totalRevenue.toLocaleString("es-AR")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Producto estrella</p>
            <p className="text-xl font-bold text-foreground">{barData[0]?.name || "—"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Bar chart - quantity by product */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Burritos vendidos por producto</CardTitle>
        </CardHeader>
        <CardContent>
          {barData.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay datos aún</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number, name: string) =>
                    name === "ingresos" ? `$${value.toLocaleString("es-AR")}` : value
                  }
                />
                <Bar dataKey="cantidad" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Pie charts side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribución por producto</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No hay datos</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribución por tamaño</CardTitle>
          </CardHeader>
          <CardContent>
            {sizeData.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No hay datos</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={sizeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {sizeData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detalle por producto y tamaño</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.values(productStats)
              .sort((a, b) => b.totalQty - a.totalQty)
              .map((stat) => (
                <div key={stat.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{stat.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {Object.entries(stat.bySize).map(([size, qty]) => `${size}: ${qty}`).join(" · ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{stat.totalQty} uds</p>
                    <p className="text-xs text-primary">${stat.totalRevenue.toLocaleString("es-AR")}</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsManager;
