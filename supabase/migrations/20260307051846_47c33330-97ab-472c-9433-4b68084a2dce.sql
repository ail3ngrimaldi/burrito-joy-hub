-- Add 'cancelado' to the order_status enum
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'cancelado';

-- Create a function to restore stock when order is cancelled
CREATE OR REPLACE FUNCTION public.restore_stock_on_cancel()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status = 'cancelado' AND OLD.status != 'cancelado' THEN
    UPDATE public.product_stock ps
    SET quantity = ps.quantity + oi.quantity
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id
      AND ps.product_id = oi.product_id
      AND ps.size = oi.size;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger on orders table
CREATE TRIGGER on_order_cancelled
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.restore_stock_on_cancel();