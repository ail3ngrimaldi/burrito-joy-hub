
-- Restrict public SELECT on product_stock to hide exact inventory levels from competitors
DROP POLICY IF EXISTS "Anyone can view stock" ON public.product_stock;

-- Provide a public function that exposes only capped availability (max 20)
CREATE OR REPLACE FUNCTION public.get_public_stock()
RETURNS TABLE (product_id text, size text, quantity integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT product_id, size, LEAST(quantity, 20) AS quantity
  FROM public.product_stock;
$$;

REVOKE ALL ON FUNCTION public.get_public_stock() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_stock() TO anon, authenticated;
