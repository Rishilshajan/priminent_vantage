-- Create table for enterprise notification preferences
CREATE TABLE IF NOT EXISTS public.enterprise_notification_settings (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    weekly_summary BOOLEAN DEFAULT true,
    new_enrollment_alert BOOLEAN DEFAULT true,
    completion_alert BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.enterprise_notification_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own notification settings" ON public.enterprise_notification_settings
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Organization admins can view org-wide settings" ON public.enterprise_notification_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE user_id = auth.uid() AND org_id = enterprise_notification_settings.org_id AND role IN ('enterprise_admin', 'owner', 'admin')
        )
    );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_notification_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_notification_settings_updated
    BEFORE UPDATE ON public.enterprise_notification_settings
    FOR EACH ROW EXECUTE PROCEDURE public.handle_notification_settings_updated_at();
