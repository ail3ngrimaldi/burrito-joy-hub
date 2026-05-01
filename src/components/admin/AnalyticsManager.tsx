import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/config/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, ReferenceLine } from "recharts";

const COLORS = ["#f97316", "#ef4444", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"];

const AnalyticsManager = () => {
  const { data: orderItems, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_items")
        .select("product_id, product_name, size, quantity, unit_price, order_id, orders!inner(status, created_at)");
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

  // Weekly aggregation (ISO week starting Monday, in local time)
  const getWeekKey = (d: Date) => {
    const date = new Date(d);
    const day = (date.getDay() + 6) % 7; // Mon=0..Sun=6
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - day);
    return date;
  };
  const fmtWeek = (d: Date) =>
    d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });

  const weekMap: Record<string, { weekStart: Date; cantidad: number; ingresos: number }> = {};
  validItems.forEach((item) => {
    const createdAt = item.orders?.created_at;
    if (!createdAt) return;
    const wk = getWeekKey(new Date(createdAt));
    const key = wk.toISOString();
    if (!weekMap[key]) weekMap[key] = { weekStart: wk, cantidad: 0, ingresos: 0 };
    weekMap[key].cantidad += item.quantity;
    weekMap[key].ingresos += item.quantity * item.unit_price;
  });

  // Fill missing weeks between min and max with zeros for a realistic timeline
  const weekEntries = Object.values(weekMap).sort((a, b) => a.weekStart.getTime() - b.weekStart.getTime());
  let weeklyData: { label: string; cantidad: number; ingresos: number; weekStart: Date }[] = [];
  if (weekEntries.length > 0) {
    const start = weekEntries[0].weekStart;
    const end = weekEntries[weekEntries.length - 1].weekStart;
    const cursor = new Date(start);
    while (cursor.getTime() <= end.getTime()) {
      const key = cursor.toISOString();
      const entry = weekMap[key];
      weeklyData.push({
        label: fmtWeek(cursor),
        cantidad: entry?.cantidad || 0,
        ingresos: entry?.ingresos || 0,
        weekStart: new Date(cursor),
      });
      cursor.setDate(cursor.getDate() + 7);
    }
  }

  const weeksCount = weeklyData.length;
  const avgPerWeek = weeksCount > 0 ? totalBurritos / weeksCount : 0;
  const bestWeek = weeklyData.reduce<typeof weeklyData[number] | null>(
    (best, w) => (!best || w.cantidad > best.cantidad ? w : best),
    null,
  );
  const worstWeek = weeklyData.reduce<typeof weeklyData[number] | null>(
    (worst, w) => (!worst || w.cantidad < worst.cantidad ? w : worst),
    null,
  );

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Promedio semanal</p>
            <p className="text-3xl font-bold text-foreground">{avgPerWeek.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground mt-1">burritos/semana ({weeksCount} sem.)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Mejor semana</p>
            <p className="text-2xl font-bold text-primary">{bestWeek?.cantidad ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">{bestWeek ? `Sem. del ${bestWeek.label}` : "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Semana más floja</p>
            <p className="text-2xl font-bold text-foreground">{worstWeek?.cantidad ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">{worstWeek ? `Sem. del ${worstWeek.label}` : "—"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ventas por semana</CardTitle>
        </CardHeader>
        <CardContent>
          {weeklyData.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay datos aún</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={weeklyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(value: number) => [`${value} burritos`, "Vendidos"]}
                  labelFormatter={(label) => `Semana del ${label}`}
                />
                <ReferenceLine
                  y={avgPerWeek}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="4 4"
                  label={{ value: `Prom. ${avgPerWeek.toFixed(1)}`, position: "right", fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <Line
                  type="monotone"
                  dataKey="cantidad"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "hsl(var(--primary))" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

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
