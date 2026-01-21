-- Tabla de stock de productos
CREATE TABLE public.product_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  size TEXT NOT NULL CHECK (size IN ('M', 'L', 'XL')),
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (product_id, size)
);

-- Habilitar RLS
ALTER TABLE public.product_stock ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública (todos pueden ver el stock)
CREATE POLICY "Anyone can view stock"
  ON public.product_stock
  FOR SELECT
  USING (true);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_product_stock_updated_at
  BEFORE UPDATE ON public.product_stock
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Función para descontar stock (se usará cuando se confirme un pedido)
CREATE OR REPLACE FUNCTION public.decrement_stock(
  p_product_id TEXT,
  p_size TEXT,
  p_quantity INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_qty INTEGER;
BEGIN
  SELECT quantity INTO current_qty
  FROM public.product_stock
  WHERE product_id = p_product_id AND size = p_size
  FOR UPDATE;
  
  IF current_qty IS NULL OR current_qty < p_quantity THEN
    RETURN FALSE;
  END IF;
  
  UPDATE public.product_stock
  SET quantity = quantity - p_quantity
  WHERE product_id = p_product_id AND size = p_size;
  
  RETURN TRUE;
END;
$$;

-- Insertar stock inicial para todos los productos
INSERT INTO public.product_stock (product_id, size, quantity) VALUES
  ('bondiocheddar', 'M', 10),
  ('bondiocheddar', 'L', 10),
  ('bondiocheddar', 'XL', 10),
  ('mexican-chicken', 'M', 10),
  ('mexican-chicken', 'L', 10),
  ('mexican-chicken', 'XL', 10),
  ('veggie', 'M', 10),
  ('veggie', 'L', 10),
  ('veggie', 'XL', 10),
  ('bolognesa', 'M', 10),
  ('bolognesa', 'L', 10),
  ('bolognesa', 'XL', 10),
  ('the-bear', 'M', 10),
  ('the-bear', 'L', 10),
  ('the-bear', 'XL', 10),
  ('pollo-honeypinaca', 'M', 0),
  ('pollo-honeypinaca', 'L', 0),
  ('pollo-honeypinaca', 'XL', 0),
  ('pollo-verdeo', 'M', 0),
  ('pollo-verdeo', 'L', 0),
  ('pollo-verdeo', 'XL', 0);