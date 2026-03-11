
-- Fix orders policies: drop restrictive, recreate as permissive
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
CREATE POLICY "Anyone can insert orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can view orders" ON public.orders;
CREATE POLICY "Authenticated users can view orders" ON public.orders FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can update orders" ON public.orders;
CREATE POLICY "Authenticated users can update orders" ON public.orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete orders" ON public.orders;
CREATE POLICY "Authenticated users can delete orders" ON public.orders FOR DELETE TO authenticated USING (true);

-- Fix order_items policies: drop restrictive, recreate as permissive
DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
CREATE POLICY "Anyone can insert order items" ON public.order_items FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can view order items" ON public.order_items;
CREATE POLICY "Authenticated users can view order items" ON public.order_items FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete order items" ON public.order_items;
CREATE POLICY "Authenticated users can delete order items" ON public.order_items FOR DELETE TO authenticated USING (true);

-- Fix product_stock policies
DROP POLICY IF EXISTS "Anyone can view stock" ON public.product_stock;
CREATE POLICY "Anyone can view stock" ON public.product_stock FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert stock" ON public.product_stock;
CREATE POLICY "Authenticated users can insert stock" ON public.product_stock FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update stock" ON public.product_stock;
CREATE POLICY "Authenticated users can update stock" ON public.product_stock FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
