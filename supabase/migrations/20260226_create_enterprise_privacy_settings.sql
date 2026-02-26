-- Create enterprise_privacy_settings table
CREATE TABLE IF NOT EXISTS public.enterprise_privacy_settings (
    org_id UUID PRIMARY KEY REFERENCES public.organizations(id) ON DELETE CASCADE,
    data_retention_period TEXT DEFAULT '6_months',
    enable_gdpr_mode BOOLEAN DEFAULT false,
    right_to_be_forgotten_automation BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.enterprise_privacy_settings ENABLE ROW LEVEL SECURITY;

-- Policies for owners and admins
CREATE POLICY "Allow owners to manage privacy settings" ON public.enterprise_privacy_settings
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_members.org_id = enterprise_privacy_settings.org_id
            AND organization_members.user_id = auth.uid()
            AND organization_members.role IN ('owner', 'enterprise_admin', 'admin')
        )
    );

CREATE POLICY "Allow members to view privacy settings" ON public.enterprise_privacy_settings
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_members.org_id = enterprise_privacy_settings.org_id
            AND organization_members.user_id = auth.uid()
        )
    );
