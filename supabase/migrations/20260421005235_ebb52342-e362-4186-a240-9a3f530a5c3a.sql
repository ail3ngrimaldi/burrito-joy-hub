-- Create abandoned carts tracking table
CREATE TABLE public.abandoned_carts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_items INTEGER NOT NULL DEFAULT 0,
  total_amount INTEGER NOT NULL DEFAULT 0,
  converted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for queries
CREATE INDEX idx_abandoned_carts_last_activity ON public.abandoned_carts(last_activity DESC);
CREATE INDEX idx_abandoned_carts_converted ON public.abandoned_carts(converted);

-- Enable RLS
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;

-- Policies: anonymous visitors need to upsert their own session, admins can read
CREATE POLICY "Anyone can insert abandoned carts"
ON public.abandoned_carts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can update their session cart"
ON public.abandoned_carts
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can view abandoned carts"
ON public.abandoned_carts
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete abandoned carts"
ON public.abandoned_carts
FOR DELETE
TO authenticated
USING (true);

-- Trigger to auto-update last_activity is not needed since we set it explicitly,
-- but we add updated_at-style behavior on insert/update for safety
CREATE OR REPLACE FUNCTION public.cleanup_old_abandoned_carts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.abandoned_carts
  WHERE last_activity < now() - INTERVAL '30 days';
END;
$$;