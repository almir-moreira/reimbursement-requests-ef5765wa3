ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS organization text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "bankAccount" text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bic text;
