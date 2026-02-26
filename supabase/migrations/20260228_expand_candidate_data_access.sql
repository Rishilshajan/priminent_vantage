-- Allow Enterprise Admins to view candidate profile details for students enrolled in their org simulations

-- first DROP existing policies to ensure a clean slate
DROP POLICY IF EXISTS "Enterprise admins can view candidate education" ON public.candidate_education;
DROP POLICY IF EXISTS "Enterprise admins can view candidate experience" ON public.candidate_experience;
DROP POLICY IF EXISTS "Enterprise admins can view candidate skills" ON public.candidate_skills;
DROP POLICY IF EXISTS "Enterprise admins can view candidate preferences" ON public.candidate_preferences;

-- 1. candidate_education
CREATE POLICY "Enterprise admins can view candidate education"
    ON public.candidate_education FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.simulation_enrollments se
            JOIN public.simulations s ON se.simulation_id = s.id
            JOIN public.organization_members om ON s.org_id = om.org_id
            WHERE se.student_id = public.candidate_education.user_id
            AND om.user_id = auth.uid()
        )
    );

-- 2. candidate_experience
CREATE POLICY "Enterprise admins can view candidate experience"
    ON public.candidate_experience FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.simulation_enrollments se
            JOIN public.simulations s ON se.simulation_id = s.id
            JOIN public.organization_members om ON s.org_id = om.org_id
            WHERE se.student_id = public.candidate_experience.user_id
            AND om.user_id = auth.uid()
        )
    );

-- 3. candidate_skills
CREATE POLICY "Enterprise admins can view candidate skills"
    ON public.candidate_skills FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.simulation_enrollments se
            JOIN public.simulations s ON se.simulation_id = s.id
            JOIN public.organization_members om ON s.org_id = om.org_id
            WHERE se.student_id = public.candidate_skills.user_id
            AND om.user_id = auth.uid()
        )
    );

-- 4. candidate_preferences
CREATE POLICY "Enterprise admins can view candidate preferences"
    ON public.candidate_preferences FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.simulation_enrollments se
            JOIN public.simulations s ON se.simulation_id = s.id
            JOIN public.organization_members om ON s.org_id = om.org_id
            WHERE se.student_id = public.candidate_preferences.user_id
            AND om.user_id = auth.uid()
        )
    );
