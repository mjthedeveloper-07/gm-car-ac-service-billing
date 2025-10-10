-- Add user_id column to invoices table (nullable initially to handle existing data)
ALTER TABLE public.invoices 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow all operations on invoices" ON public.invoices;

-- Create secure owner-based policies that handle NULL user_id for legacy data
-- Legacy invoices (user_id IS NULL) are accessible only to authenticated users for migration
CREATE POLICY "Users can view their own invoices"
  ON public.invoices
  FOR SELECT
  USING (auth.uid() = user_id OR (user_id IS NULL AND auth.uid() IS NOT NULL));

CREATE POLICY "Users can create their own invoices"
  ON public.invoices
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices"
  ON public.invoices
  FOR UPDATE
  USING (auth.uid() = user_id OR (user_id IS NULL AND auth.uid() IS NOT NULL))
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices"
  ON public.invoices
  FOR DELETE
  USING (auth.uid() = user_id OR (user_id IS NULL AND auth.uid() IS NOT NULL));

-- Fix the update_invoices_updated_at function to have proper search_path
CREATE OR REPLACE FUNCTION public.update_invoices_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;