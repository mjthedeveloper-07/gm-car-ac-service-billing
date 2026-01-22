-- Drop foreign key constraints on user_id columns
ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS invoices_user_id_fkey;
ALTER TABLE public.user_settings DROP CONSTRAINT IF EXISTS user_settings_user_id_fkey;
ALTER TABLE public.predefined_services DROP CONSTRAINT IF EXISTS predefined_services_user_id_fkey;

-- Set default user_id for tables (system user for anonymous access)
ALTER TABLE public.invoices ALTER COLUMN user_id SET DEFAULT '00000000-0000-0000-0000-000000000000'::uuid;
ALTER TABLE public.user_settings ALTER COLUMN user_id SET DEFAULT '00000000-0000-0000-0000-000000000000'::uuid;
ALTER TABLE public.predefined_services ALTER COLUMN user_id SET DEFAULT '00000000-0000-0000-0000-000000000000'::uuid;

-- Update existing data to use default user_id
UPDATE public.invoices SET user_id = '00000000-0000-0000-0000-000000000000'::uuid;
UPDATE public.user_settings SET user_id = '00000000-0000-0000-0000-000000000000'::uuid;
UPDATE public.predefined_services SET user_id = '00000000-0000-0000-0000-000000000000'::uuid;