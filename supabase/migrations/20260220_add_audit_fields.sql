-- Add audit fields to organizations table
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS last_updated_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS last_updated_by TEXT;
