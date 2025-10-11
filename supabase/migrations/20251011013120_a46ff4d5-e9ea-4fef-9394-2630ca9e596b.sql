-- Add website column to user_settings table
ALTER TABLE public.user_settings
ADD COLUMN website text;