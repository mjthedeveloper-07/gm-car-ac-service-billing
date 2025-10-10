-- Fix update_invoices_updated_at function with proper search_path and qualified function calls
CREATE OR REPLACE FUNCTION public.update_invoices_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  NEW.updated_at = pg_catalog.now();
  RETURN NEW;
END;
$$;