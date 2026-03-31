-- Fix foreign key to reference profiles instead of auth.users
-- This allows PostgREST to resolve the 'profiles' relationship when querying requests

ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS requests_user_id_fkey;

ALTER TABLE public.requests 
  ADD CONSTRAINT requests_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;
