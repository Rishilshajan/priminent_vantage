-- Update enterprise_security_settings with password policy fields
ALTER TABLE public.enterprise_security_settings 
ADD COLUMN IF NOT EXISTS min_password_length INT DEFAULT 12,
ADD COLUMN IF NOT EXISTS password_expiration_days INT DEFAULT 90,
ADD COLUMN IF NOT EXISTS require_special_symbols BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS require_numeric_digits BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS require_mixed_case BOOLEAN DEFAULT false;
