-- Fix 1: Add JSONB validation trigger for invoice services
CREATE OR REPLACE FUNCTION public.validate_invoice_services()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  service jsonb;
  description_text text;
  details_text text;
  quantity_val numeric;
  rate_val numeric;
BEGIN
  -- Ensure services is a JSON array
  IF jsonb_typeof(NEW.services) != 'array' THEN
    RAISE EXCEPTION 'services must be a JSON array';
  END IF;

  -- Validate each service item
  FOR service IN SELECT * FROM jsonb_array_elements(NEW.services)
  LOOP
    -- Check required fields exist
    IF NOT (service ? 'description' AND service ? 'quantity' AND service ? 'rate' AND service ? 'hsn') THEN
      RAISE EXCEPTION 'Each service must have description, quantity, rate, and hsn fields';
    END IF;

    -- Validate description length (max 200 chars)
    description_text := service->>'description';
    IF description_text IS NULL OR length(description_text) = 0 THEN
      RAISE EXCEPTION 'Service description cannot be empty';
    END IF;
    IF length(description_text) > 200 THEN
      RAISE EXCEPTION 'Service description cannot exceed 200 characters';
    END IF;

    -- Validate details length if present (max 500 chars)
    IF service ? 'details' THEN
      details_text := service->>'details';
      IF details_text IS NOT NULL AND length(details_text) > 500 THEN
        RAISE EXCEPTION 'Service details cannot exceed 500 characters';
      END IF;
    END IF;

    -- Validate quantity is positive
    quantity_val := (service->>'quantity')::numeric;
    IF quantity_val <= 0 THEN
      RAISE EXCEPTION 'Service quantity must be positive';
    END IF;

    -- Validate rate is non-negative
    rate_val := (service->>'rate')::numeric;
    IF rate_val < 0 THEN
      RAISE EXCEPTION 'Service rate cannot be negative';
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

-- Create trigger for service validation
DROP TRIGGER IF EXISTS validate_services_trigger ON public.invoices;
CREATE TRIGGER validate_services_trigger
  BEFORE INSERT OR UPDATE OF services ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_invoice_services();

-- Fix 2: Change SECURITY DEFINER to SECURITY INVOKER for audit trail functions
CREATE OR REPLACE FUNCTION public.auto_generate_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
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

CREATE OR REPLACE FUNCTION public.check_invoice_locked()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  IF OLD.is_locked = true THEN
    RAISE EXCEPTION 'Cannot modify locked invoice. Please unlock it first.';
  END IF;
  
  NEW.last_modified_by := auth.uid();
  RETURN NEW;
END;
$$;