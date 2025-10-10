-- Create invoices table to store all invoice data
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  customer_state TEXT,
  customer_gst TEXT,
  ship_to_name TEXT,
  ship_to_address TEXT,
  ship_to_state TEXT,
  ship_to_gst TEXT,
  vehicle_model TEXT,
  vehicle_number TEXT,
  payment_mode TEXT,
  reverse_charge TEXT,
  buyers_order_no TEXT,
  suppliers_ref TEXT,
  delivery_date TEXT,
  terms_of_delivery TEXT,
  services JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  cgst DECIMAL(10, 2) NOT NULL DEFAULT 0,
  sgst DECIMAL(10, 2) NOT NULL DEFAULT 0,
  igst DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_in_words TEXT,
  tax_type TEXT NOT NULL DEFAULT 'intra',
  received_amount DECIMAL(10, 2) DEFAULT 0,
  balance_amount DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (public invoice system)
CREATE POLICY "Allow all operations on invoices"
  ON public.invoices
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_invoices_invoice_number ON public.invoices(invoice_number);
CREATE INDEX idx_invoices_date ON public.invoices(date DESC);
CREATE INDEX idx_invoices_customer_name ON public.invoices(customer_name);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_invoices_updated_at();