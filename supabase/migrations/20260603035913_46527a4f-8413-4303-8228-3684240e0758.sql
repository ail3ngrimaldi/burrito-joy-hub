CREATE TABLE public.production_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time_start TEXT,
  time_end TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  assigned_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.production_tasks TO authenticated;
GRANT ALL ON public.production_tasks TO service_role;

ALTER TABLE public.production_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view production tasks"
ON public.production_tasks FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert production tasks"
ON public.production_tasks FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update production tasks"
ON public.production_tasks FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete production tasks"
ON public.production_tasks FOR DELETE TO authenticated USING (true);

CREATE INDEX idx_production_tasks_date ON public.production_tasks(date);

CREATE TRIGGER update_production_tasks_updated_at
BEFORE UPDATE ON public.production_tasks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();