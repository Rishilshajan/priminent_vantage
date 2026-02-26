-- Add name fields to instructor invitations for better personalization
ALTER TABLE public.instructor_invitations 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text;

-- Add comment for clarity
COMMENT ON COLUMN public.instructor_invitations.first_name IS 'First name of the invited instructor/specialist';
COMMENT ON COLUMN public.instructor_invitations.last_name IS 'Last name of the invited instructor/specialist';
