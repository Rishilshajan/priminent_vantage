-- Add candidate privacy fields to enterprise_privacy_settings
ALTER TABLE public.enterprise_privacy_settings 
ADD COLUMN IF NOT EXISTS anonymize_candidate_names BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS restrict_data_access BOOLEAN DEFAULT true;
