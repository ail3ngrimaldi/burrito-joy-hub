import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, Package, ShoppingCart, BarChart3, ShoppingBag, ClipboardList } from "lucide-react";
import StockManager from "@/components/admin/StockManager";
import OrderManager from "@/components/admin/OrderManager";
import AnalyticsManager from "@/components/admin/AnalyticsManager";
import AbandonedCartsManager from "@/components/admin/AbandonedCartsManager";
import CalendarWidget from "@/components/admin/CalendarWidget";
import ProductionWeekly from "@/components/admin/ProductionWeekly";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/gestion-d8k2/acceso");
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/gestion-d8k2/acceso");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/gestion-d8k2/acceso");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-foreground">Panel Admin — Los Burritos de Dulcinea</h1>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" /> Salir
        </Button>
      </header>

      <div className="max-w-5xl mx-auto p-4">
        <div className="mb-6 border rounded-lg bg-card">
          <CalendarWidget />
        </div>

        <Tabs defaultValue="orders">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="orders">
              <ShoppingCart className="h-4 w-4 mr-2" /> Pedidos
            </TabsTrigger>
            <TabsTrigger value="stock">
              <Package className="h-4 w-4 mr-2" /> Stock
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" /> Métricas
            </TabsTrigger>
            <TabsTrigger value="carts">
              <ShoppingBag className="h-4 w-4 mr-2" /> Carritos
            </TabsTrigger>
            <TabsTrigger value="production">
              <ClipboardList className="h-4 w-4 mr-2" /> Producción
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-4">
            <OrderManager />
          </TabsContent>

          <TabsContent value="stock" className="mt-4">
            <StockManager />
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <AnalyticsManager />
          </TabsContent>

          <TabsContent value="carts" className="mt-4">
            <AbandonedCartsManager />
          </TabsContent>

          <TabsContent value="production" className="mt-4">
            <ProductionWeekly />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
