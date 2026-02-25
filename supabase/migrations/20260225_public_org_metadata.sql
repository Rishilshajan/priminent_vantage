-- Create the public organization metadata table
CREATE TABLE IF NOT EXISTS public.public_organization_metadata (
    id UUID PRIMARY KEY REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.public_organization_metadata ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read from this table
CREATE POLICY "Public organization metadata is viewable by all authenticated users"
ON public.public_organization_metadata
FOR SELECT
TO authenticated
USING (true);

-- Function to handle syncing data from organizations to public_organization_metadata
CREATE OR REPLACE FUNCTION public.handle_public_org_metadata_sync()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.public_organization_metadata (id, name)
        VALUES (NEW.id, NEW.name)
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.public_organization_metadata (id, name)
        VALUES (NEW.id, NEW.name)
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();
    ELSIF (TG_OP = 'DELETE') THEN
        DELETE FROM public.public_organization_metadata WHERE id = OLD.id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the sync function on changes to the organizations table
DROP TRIGGER IF EXISTS on_org_change_sync_metadata ON public.organizations;
CREATE TRIGGER on_org_change_sync_metadata
AFTER INSERT OR UPDATE OR DELETE ON public.organizations
FOR EACH ROW EXECUTE FUNCTION public.handle_public_org_metadata_sync();

-- Initial population of the metadata table
INSERT INTO public.public_organization_metadata (id, name)
SELECT id, name FROM public.organizations
ON CONFLICT (id) DO NOTHING;
