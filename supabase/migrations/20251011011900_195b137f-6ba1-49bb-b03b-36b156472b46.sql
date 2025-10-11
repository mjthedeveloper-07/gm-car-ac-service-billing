-- Add bank details to user_settings for company-level information
ALTER TABLE public.user_settings 
ADD COLUMN bank_name text,
ADD COLUMN bank_branch text,
ADD COLUMN bank_account_no text,
ADD COLUMN bank_ifsc_code text,
ADD COLUMN bank_upi_id text,
ADD COLUMN logo_url text,
ADD COLUMN terms_and_conditions text;

-- Add invoice status, due date, notes, and audit fields to invoices
ALTER TABLE public.invoices
ADD COLUMN status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'cancelled', 'overdue')),
ADD COLUMN due_date timestamp with time zone,
ADD COLUMN notes text,
ADD COLUMN discount_amount numeric DEFAULT 0,
ADD COLUMN discount_percent numeric DEFAULT 0,
ADD COLUMN last_modified_by uuid,
ADD COLUMN is_locked boolean DEFAULT false;

-- Create function to generate sequential invoice numbers per user
CREATE OR REPLACE FUNCTION public.generate_invoice_number(user_uuid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number integer;
  invoice_num text;
  financial_year text;
BEGIN
  -- Get current financial year (Apr-Mar)
  IF EXTRACT(MONTH FROM CURRENT_DATE) >= 4 THEN
    financial_year := EXTRACT(YEAR FROM CURRENT_DATE)::text || '-' || 
                     (EXTRACT(YEAR FROM CURRENT_DATE) + 1)::text;
  ELSE
    financial_year := (EXTRACT(YEAR FROM CURRENT_DATE) - 1)::text || '-' || 
                     EXTRACT(YEAR FROM CURRENT_DATE)::text;
  END IF;
  
  -- Get the next number for this user in this financial year
  SELECT COALESCE(MAX(
    CASE 
      WHEN invoice_number ~ '^INV-[0-9]{4}-[0-9]{4}-[0-9]+$' 
      THEN CAST(SPLIT_PART(invoice_number, '-', 3) AS INTEGER)
      ELSE 0
    END
  ), 0) + 1
  INTO next_number
  FROM public.invoices
  WHERE user_id = user_uuid
    AND invoice_number LIKE 'INV-' || financial_year || '%';
  
  -- Format: INV-YYYY-YYYY-0001
  invoice_num := 'INV-' || financial_year || '-' || LPAD(next_number::text, 4, '0');
  
  RETURN invoice_num;
END;
$$;

-- Create trigger to auto-generate invoice number if not provided
CREATE OR REPLACE FUNCTION public.auto_generate_invoice_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only generate if invoice_number is not provided or empty
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := public.generate_invoice_number(NEW.user_id);
  END IF;
  
  -- Set last_modified_by to current user
  NEW.last_modified_by := auth.uid();
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_auto_generate_invoice_number
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_invoice_number();

-- Create trigger to prevent editing locked invoices
CREATE OR REPLACE FUNCTION public.check_invoice_locked()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.is_locked = true THEN
    RAISE EXCEPTION 'Cannot modify locked invoice. Please unlock it first.';
  END IF;
  
  NEW.last_modified_by := auth.uid();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_check_invoice_locked
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.check_invoice_locked();

-- Create unique constraint for invoice numbers per user
CREATE UNIQUE INDEX idx_unique_invoice_number_per_user 
ON public.invoices(user_id, invoice_number);

-- Add index for status queries
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date) WHERE status NOT IN ('paid', 'cancelled');