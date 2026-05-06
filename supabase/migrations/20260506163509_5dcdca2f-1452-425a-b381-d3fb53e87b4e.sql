CREATE POLICY "Authenticated users can view stock"
ON public.product_stock
FOR SELECT
TO authenticated
USING (true);