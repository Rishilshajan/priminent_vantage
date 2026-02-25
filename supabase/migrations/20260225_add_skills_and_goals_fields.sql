-- Add Step 4 fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS skills text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS soft_skills text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS availability text,
ADD COLUMN IF NOT EXISTS salary_expectation text,
ADD COLUMN IF NOT EXISTS short_term_goals text,
ADD COLUMN IF NOT EXISTS long_term_goals text;

-- Update candidate_preferences if needed
ALTER TABLE public.candidate_preferences
ADD COLUMN IF NOT EXISTS career_interests text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS preferred_locations text[] DEFAULT '{}';

-- Refresh cache
NOTIFY pgrst, 'reload schema';
