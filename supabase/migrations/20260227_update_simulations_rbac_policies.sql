-- Update Simulation RLS Policies for New RBAC System

-- 1. Drop existing policies to recreate them with the new role logic
DROP POLICY IF EXISTS "Enterprise users can view their org simulations" ON public.simulations;
DROP POLICY IF EXISTS "Enterprise users can create simulations" ON public.simulations;
DROP POLICY IF EXISTS "Enterprise users can update their org simulations" ON public.simulations;
DROP POLICY IF EXISTS "Enterprise users can delete their org simulations" ON public.simulations;

-- 2. New Simulation Policies
CREATE POLICY "Enterprise members can view their org simulations"
    ON public.simulations FOR SELECT
    TO authenticated
    USING (
        org_id IN (
            SELECT org_id FROM public.organization_members
            WHERE user_id = auth.uid()
            -- Members, Instructors, Reviewers, and Admins can all view their org simulations
        )
    );

CREATE POLICY "Instructors and Admins can create simulations"
    ON public.simulations FOR INSERT
    TO authenticated
    WITH CHECK (
        org_id IN (
            SELECT org_id FROM public.organization_members
            WHERE user_id = auth.uid()
            AND role IN ('enterprise_admin', 'instructor', 'admin', 'owner')
        )
    );

CREATE POLICY "Instructors and Admins can update their org simulations"
    ON public.simulations FOR UPDATE
    TO authenticated
    USING (
        org_id IN (
            SELECT org_id FROM public.organization_members
            WHERE user_id = auth.uid()
            AND role IN ('enterprise_admin', 'instructor', 'admin', 'owner')
        )
    );

CREATE POLICY "Admins can delete their org simulations"
    ON public.simulations FOR DELETE
    TO authenticated
    USING (
        org_id IN (
            SELECT org_id FROM public.organization_members
            WHERE user_id = auth.uid()
            AND role IN ('enterprise_admin', 'admin', 'owner')
        )
    );

-- 3. Update Task Policies
DROP POLICY IF EXISTS "Enterprise users can view their org simulation tasks" ON public.simulation_tasks;
DROP POLICY IF EXISTS "Enterprise users can create simulation tasks" ON public.simulation_tasks;
DROP POLICY IF EXISTS "Enterprise users can update simulation tasks" ON public.simulation_tasks;
DROP POLICY IF EXISTS "Enterprise users can delete simulation tasks" ON public.simulation_tasks;

CREATE POLICY "Enterprise members can view their org tasks"
    ON public.simulation_tasks FOR SELECT
    TO authenticated
    USING (
        simulation_id IN (
            SELECT id FROM public.simulations
            WHERE org_id IN (
                SELECT org_id FROM public.organization_members
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Instructors and Admins can manage tasks"
    ON public.simulation_tasks FOR ALL
    TO authenticated
    USING (
        simulation_id IN (
            SELECT id FROM public.simulations
            WHERE org_id IN (
                SELECT org_id FROM public.organization_members
                WHERE user_id = auth.uid()
                AND role IN ('enterprise_admin', 'instructor', 'admin', 'owner')
            )
        )
    );

-- 4. Update Skills and Assets Policies similarly (using simple ALL policy for brevity but maintain role logic)
DROP POLICY IF EXISTS "Enterprise users can manage skills for their org simulations" ON public.simulation_skills;
DROP POLICY IF EXISTS "Enterprise users can view their org simulation skills" ON public.simulation_skills;
DROP POLICY IF EXISTS "Enterprise users can create simulation skills" ON public.simulation_skills;
DROP POLICY IF EXISTS "Enterprise users can delete simulation skills" ON public.simulation_skills;

CREATE POLICY "Instructors and Admins can manage skills"
    ON public.simulation_skills FOR ALL
    TO authenticated
    USING (
        simulation_id IN (
            SELECT id FROM public.simulations
            WHERE org_id IN (
                SELECT org_id FROM public.organization_members
                WHERE user_id = auth.uid()
                AND role IN ('enterprise_admin', 'instructor', 'admin', 'owner')
            )
        )
    );

DROP POLICY IF EXISTS "Enterprise users can manage assets for their org simulations" ON public.simulation_assets;
DROP POLICY IF EXISTS "Enterprise users can view their org simulation assets" ON public.simulation_assets;
DROP POLICY IF EXISTS "Enterprise users can create simulation assets" ON public.simulation_assets;
DROP POLICY IF EXISTS "Enterprise users can delete simulation assets" ON public.simulation_assets;

CREATE POLICY "Instructors and Admins can manage assets"
    ON public.simulation_assets FOR ALL
    TO authenticated
    USING (
        simulation_id IN (
            SELECT id FROM public.simulations
            WHERE org_id IN (
                SELECT org_id FROM public.organization_members
                WHERE user_id = auth.uid()
                AND role IN ('enterprise_admin', 'instructor', 'admin', 'owner')
            )
        )
    );
