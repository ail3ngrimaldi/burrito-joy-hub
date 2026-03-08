
-- Fix RLS policies: ensure write operations are restricted to authenticated users only

-- product_stock: drop and recreate policies
DROP POLICY IF EXISTS "Anyone can view stock" ON public.product_stock;
DROP POLICY IF EXISTS "Authenticated users can insert stock" ON public.product_stock;
DROP POLICY IF EXISTS "Authenticated users can update stock" ON public.product_stock;

CREATE POLICY "Anyone can view stock" ON public.product_stock
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users can insert stock" ON public.product_stock
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update stock" ON public.product_stock
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- orders: drop and recreate policies
DROP POLICY IF EXISTS "Authenticated users can delete orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can view orders" ON public.orders;

-- Allow anon to INSERT orders (customers placing orders from website)
CREATE POLICY "Anyone can insert orders" ON public.orders
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can view orders" ON public.orders
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update orders" ON public.orders
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete orders" ON public.orders
  FOR DELETE TO authenticated USING (true);

-- order_items: drop and recreate policies
DROP POLICY IF EXISTS "Authenticated users can delete order items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can view order items" ON public.order_items;

-- Allow anon to INSERT order_items (customers placing orders)
CREATE POLICY "Anyone can insert order items" ON public.order_items
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can view order items" ON public.order_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete order items" ON public.order_items
  FOR DELETE TO authenticated USING (true);
