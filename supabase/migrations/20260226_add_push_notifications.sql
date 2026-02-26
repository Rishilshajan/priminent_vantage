-- Add push_notifications_enabled to enterprise_notification_settings
ALTER TABLE public.enterprise_notification_settings 
ADD COLUMN IF NOT EXISTS push_notifications_enabled BOOLEAN DEFAULT false;
