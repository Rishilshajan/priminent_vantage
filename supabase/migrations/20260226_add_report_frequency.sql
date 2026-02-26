-- Add report_frequency to enterprise_notification_settings
ALTER TABLE public.enterprise_notification_settings 
ADD COLUMN IF NOT EXISTS report_frequency TEXT DEFAULT 'weekly';
