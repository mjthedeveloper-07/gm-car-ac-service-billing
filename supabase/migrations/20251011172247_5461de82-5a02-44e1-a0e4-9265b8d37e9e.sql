-- 1) Enforce GST number format at the database level (allow NULL, enforce on new/updated rows)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_settings_gst_number_format'
  ) THEN
    ALTER TABLE public.user_settings
      ADD CONSTRAINT user_settings_gst_number_format
      CHECK (
        gst_number IS NULL OR upper(gst_number) ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
      ) NOT VALID;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'invoices_customer_gst_format'
  ) THEN
    ALTER TABLE public.invoices
      ADD CONSTRAINT invoices_customer_gst_format
      CHECK (
        customer_gst IS NULL OR upper(customer_gst) ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
      ) NOT VALID;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'invoices_ship_to_gst_format'
  ) THEN
    ALTER TABLE public.invoices
      ADD CONSTRAINT invoices_ship_to_gst_format
      CHECK (
        ship_to_gst IS NULL OR upper(ship_to_gst) ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
      ) NOT VALID;
  END IF;
END $$;

-- 2) Fix: Ensure all PL/pgSQL functions set an explicit search_path
-- Recreate validate_invoice_services with fixed search_path
CREATE OR REPLACE FUNCTION public.validate_invoice_services()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $function$
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
$function$;

-- Recreate check_invoice_locked with fixed search_path
CREATE OR REPLACE FUNCTION public.check_invoice_locked()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $function$
BEGIN
  IF OLD.is_locked = true THEN
    RAISE EXCEPTION 'Cannot modify locked invoice. Please unlock it first.';
  END IF;

  NEW.last_modified_by := auth.uid();
  RETURN NEW;
END;
$function$;