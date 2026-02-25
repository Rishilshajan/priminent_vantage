-- Add state column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS state text;
