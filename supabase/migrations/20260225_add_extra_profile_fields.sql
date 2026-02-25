-- Add extra fields to profiles to support different onboarding personas
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS certifications text[],
ADD COLUMN IF NOT EXISTS previous_industry text,
ADD COLUMN IF NOT EXISTS previous_role text,
ADD COLUMN IF NOT EXISTS years_of_experience text,
ADD COLUMN IF NOT EXISTS highest_qualification text;
