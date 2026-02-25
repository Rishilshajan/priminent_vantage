-- Add Step 5 Fields and Completion Flag
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS linkedin_url text,
ADD COLUMN IF NOT EXISTS github_url text,
ADD COLUMN IF NOT EXISTS portfolio_url text,
ADD COLUMN IF NOT EXISTS twitter_url text,
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS is_open_to_opportunities boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Refresh cache
NOTIFY pgrst, 'reload schema';
