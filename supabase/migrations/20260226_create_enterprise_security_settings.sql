-- Create table for enterprise security settings
CREATE TABLE IF NOT EXISTS public.enterprise_security_settings (
    org_id UUID PRIMARY KEY REFERENCES public.organizations(id) ON DELETE CASCADE,
    enforce_mfa_admins BOOLEAN DEFAULT false,
    enforce_mfa_all BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.enterprise_security_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can manage their organization security settings" ON public.enterprise_security_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE user_id = auth.uid() AND org_id = enterprise_security_settings.org_id AND role IN ('enterprise_admin', 'owner', 'admin')
        )
    );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_security_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_security_settings_updated
    BEFORE UPDATE ON public.enterprise_security_settings
    FOR EACH ROW EXECUTE PROCEDURE public.handle_security_settings_updated_at();
