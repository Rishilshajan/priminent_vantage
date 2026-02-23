-- Add branding columns to organizations table
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS brand_color TEXT DEFAULT '#7F13EC',
ADD COLUMN IF NOT EXISTS footer_text TEXT DEFAULT '© 2024 Priminent Vantage. Confidentially Transmitted.',
ADD COLUMN IF NOT EXISTS email_sender_name TEXT,
ADD COLUMN IF NOT EXISTS email_footer_text TEXT,
ADD COLUMN IF NOT EXISTS certificate_director_name TEXT,
ADD COLUMN IF NOT EXISTS certificate_director_title TEXT,
ADD COLUMN IF NOT EXISTS certificate_signature_url TEXT;

-- Add brand_color to simulations table to take snapshot at creation (or sync)
ALTER TABLE public.simulations
ADD COLUMN IF NOT EXISTS brand_color TEXT;
