-- Add database-level validation constraints for defense-in-depth

-- 1. Email format validation for user_settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_settings_email_format'
  ) THEN
    ALTER TABLE public.user_settings
      ADD CONSTRAINT user_settings_email_format
      CHECK (
        email IS NULL OR email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
      ) NOT VALID;
  END IF;
END $$;

-- 2. Phone format validation (E.164 compatible: +country code + 10-15 digits)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_settings_phone_format'
  ) THEN
    ALTER TABLE public.user_settings
      ADD CONSTRAINT user_settings_phone_format
      CHECK (
        phone IS NULL OR phone ~ '^[+]?[0-9]{10,15}$'
      ) NOT VALID;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'invoices_customer_phone_format'
  ) THEN
    ALTER TABLE public.invoices
      ADD CONSTRAINT invoices_customer_phone_format
      CHECK (
        customer_phone IS NULL OR customer_phone ~ '^[+]?[0-9]{10,15}$'
      ) NOT VALID;
  END IF;
END $$;

-- 3. Invoice status validation (only allow expected values)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'invoices_status_values'
  ) THEN
    ALTER TABLE public.invoices
      ADD CONSTRAINT invoices_status_values
      CHECK (
        status IS NULL OR status IN ('draft', 'pending', 'paid', 'cancelled')
      ) NOT VALID;
  END IF;
END $$;

-- 4. Discount percent validation (0-100%)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'invoices_discount_percent_range'
  ) THEN
    ALTER TABLE public.invoices
      ADD CONSTRAINT invoices_discount_percent_range
      CHECK (
        discount_percent IS NULL OR (discount_percent >= 0 AND discount_percent <= 100)
      ) NOT VALID;
  END IF;
END $$;

-- 5. Financial fields upper bounds (reasonable limits to prevent overflow/UI issues)
-- Using 10 billion as upper limit (10,000,000,000) - reasonable for invoice amounts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'invoices_financial_bounds'
  ) THEN
    ALTER TABLE public.invoices
      ADD CONSTRAINT invoices_financial_bounds
      CHECK (
        subtotal >= 0 AND subtotal < 10000000000 AND
        cgst >= 0 AND cgst < 10000000000 AND
        sgst >= 0 AND sgst < 10000000000 AND
        igst >= 0 AND igst < 10000000000 AND
        total >= 0 AND total < 10000000000 AND
        (received_amount IS NULL OR (received_amount >= 0 AND received_amount < 10000000000)) AND
        (balance_amount IS NULL OR (balance_amount >= 0 AND balance_amount < 10000000000)) AND
        (discount_amount IS NULL OR (discount_amount >= 0 AND discount_amount < 10000000000))
      ) NOT VALID;
  END IF;
END $$;

-- 6. Tax rates bounds (0-100%)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_settings_tax_rates_range'
  ) THEN
    ALTER TABLE public.user_settings
      ADD CONSTRAINT user_settings_tax_rates_range
      CHECK (
        cgst_rate >= 0 AND cgst_rate <= 100 AND
        sgst_rate >= 0 AND sgst_rate <= 100 AND
        igst_rate >= 0 AND igst_rate <= 100
      ) NOT VALID;
  END IF;
END $$;

-- 7. Predefined services default_rate bounds
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'predefined_services_rate_bounds'
  ) THEN
    ALTER TABLE public.predefined_services
      ADD CONSTRAINT predefined_services_rate_bounds
      CHECK (
        default_rate >= 0 AND default_rate < 10000000000
      ) NOT VALID;
  END IF;
END $$;