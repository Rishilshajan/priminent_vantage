-- Migration to support organization-level assets in simulation_assets
-- This allows logos and signatures to be stored without being tied to a specific simulation.

-- 1. Make simulation_id nullable
ALTER TABLE public.simulation_assets 
ALTER COLUMN simulation_id DROP NOT NULL;

-- 2. Add org_id to link assets directly to organizations
ALTER TABLE public.simulation_assets
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 3. Update RLS policies for simulation_assets

-- First, drop existing create policy to replace it
DROP POLICY IF EXISTS "Enterprise users can create simulation assets" ON simulation_assets;

-- New Insert Policy: Can insert if it belongs to a simulation you manage OR an organization you manage
CREATE POLICY "Enterprise users can create simulation assets"
    ON simulation_assets FOR INSERT
    TO authenticated
    WITH CHECK (
        (
            simulation_id IS NOT NULL AND
            simulation_id IN (
                SELECT id FROM simulations
                WHERE org_id IN (
                    SELECT org_id FROM organization_members
                    WHERE user_id = auth.uid()
                    AND role IN ('admin', 'owner')
                )
            )
        )
        OR
        (
            org_id IS NOT NULL AND
            org_id IN (
                SELECT org_id FROM organization_members
                WHERE user_id = auth.uid()
                AND role IN ('admin', 'owner')
            )
        )
    );

-- Update Select Policy to include org-level assets
DROP POLICY IF EXISTS "Enterprise users can view their org simulation assets" ON simulation_assets;
CREATE POLICY "Enterprise users can view their org assets"
    ON simulation_assets FOR SELECT
    TO authenticated
    USING (
        (
            simulation_id IN (
                SELECT id FROM simulations
                WHERE org_id IN (
                    SELECT org_id FROM organization_members
                    WHERE user_id = auth.uid()
                )
            )
        )
        OR
        (
            org_id IN (
                SELECT org_id FROM organization_members
                WHERE user_id = auth.uid()
            )
        )
    );

-- Update Delete Policy
DROP POLICY IF EXISTS "Enterprise users can delete simulation assets" ON simulation_assets;
CREATE POLICY "Enterprise users can delete their org assets"
    ON simulation_assets FOR DELETE
    TO authenticated
    USING (
        (
            simulation_id IN (
                SELECT id FROM simulations
                WHERE org_id IN (
                    SELECT org_id FROM organization_members
                    WHERE user_id = auth.uid()
                    AND role IN ('admin', 'owner')
                )
            )
        )
-- 4. Fix Organizations Update Policy to allow Org Admins
-- Prevents "Access denied" when saving branding settings as an enterprise user.
DROP POLICY IF EXISTS "Admins can update organizations" ON organizations;
CREATE POLICY "Org Admins can update their organization"
    ON organizations FOR UPDATE
    TO authenticated
    USING (
        id IN (
            SELECT org_id FROM organization_members
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'owner')
        )
        OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );
