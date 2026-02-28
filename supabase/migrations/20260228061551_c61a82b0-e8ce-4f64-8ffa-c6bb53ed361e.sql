
-- Create order status enum
CREATE TYPE public.order_status AS ENUM ('pendiente', 'por_entregar', 'entregado');

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  delivery_date TEXT,
  delivery_address TEXT,
  notes TEXT,
  status order_status NOT NULL DEFAULT 'pendiente',
  total_amount INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS policies: only authenticated users can CRUD
CREATE POLICY "Authenticated users can view orders"
  ON public.orders FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert orders"
  ON public.orders FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders"
  ON public.orders FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete orders"
  ON public.orders FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view order items"
  ON public.order_items FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert order items"
  ON public.order_items FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can delete order items"
  ON public.order_items FOR DELETE TO authenticated USING (true);

-- Allow authenticated users to update product_stock
CREATE POLICY "Authenticated users can update stock"
  ON public.product_stock FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert stock"
  ON public.product_stock FOR INSERT TO authenticated WITH CHECK (true);

-- Trigger for updated_at on orders
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
