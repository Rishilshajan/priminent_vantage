-- Add session_timeout_minutes to enterprise_security_settings
ALTER TABLE public.enterprise_security_settings 
ADD COLUMN IF NOT EXISTS session_timeout_minutes INT DEFAULT 1440; -- Default 24 hours
