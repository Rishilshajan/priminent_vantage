-- Enable Row Level Security on all simulation tables
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_certificates ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SIMULATIONS TABLE POLICIES
-- ============================================

-- Enterprise users can view simulations from their organization
CREATE POLICY "Enterprise users can view their org simulations"
    ON simulations FOR SELECT
    TO authenticated
    USING (
        org_id IN (
            SELECT org_id FROM organization_members
            WHERE user_id = auth.uid()
        )
    );

-- Enterprise users can create simulations for their organization
CREATE POLICY "Enterprise users can create simulations"
    ON simulations FOR INSERT
    TO authenticated
    WITH CHECK (
        org_id IN (
            SELECT org_id FROM organization_members
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'owner')
        )
    );

-- Enterprise users can update their org simulations
CREATE POLICY "Enterprise users can update their org simulations"
    ON simulations FOR UPDATE
    TO authenticated
    USING (
        org_id IN (
            SELECT org_id FROM organization_members
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'owner')
        )
    );

-- Enterprise users can delete their org simulations
CREATE POLICY "Enterprise users can delete their org simulations"
    ON simulations FOR DELETE
    TO authenticated
    USING (
        org_id IN (
            SELECT org_id FROM organization_members
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'owner')
        )
    );

-- Students can view published simulations
CREATE POLICY "Students can view published simulations"
    ON simulations FOR SELECT
    TO authenticated
    USING (status = 'published');

-- ============================================
-- SIMULATION_TASKS TABLE POLICIES
-- ============================================

-- Enterprise users can view tasks from their org simulations
CREATE POLICY "Enterprise users can view their org simulation tasks"
    ON simulation_tasks FOR SELECT
    TO authenticated
    USING (
        simulation_id IN (
            SELECT id FROM simulations
            WHERE org_id IN (
                SELECT org_id FROM organization_members
                WHERE user_id = auth.uid()
            )
        )
    );

-- Enterprise users can create tasks for their org simulations
CREATE POLICY "Enterprise users can create simulation tasks"
    ON simulation_tasks FOR INSERT
    TO authenticated
    WITH CHECK (
        simulation_id IN (
            SELECT id FROM simulations
            WHERE org_id IN (
                SELECT org_id FROM organization_members
                WHERE user_id = auth.uid()
                AND role IN ('admin', 'owner')
            )
        )
    );

-- Enterprise users can update tasks for their org simulations
CREATE POLICY "Enterprise users can update simulation tasks"
    ON simulation_tasks FOR UPDATE
    TO authenticated
    USING (
        simulation_id IN (
            SELECT id FROM simulations
            WHERE org_id IN (
                SELECT org_id FROM organization_members
                WHERE user_id = auth.uid()
                AND role IN ('admin', 'owner')
            )
        )
    );

-- Enterprise users can delete tasks for their org simulations
CREATE POLICY "Enterprise users can delete simulation tasks"
    ON simulation_tasks FOR DELETE
    TO authenticated
    USING (
        simulation_id IN (
            SELECT id FROM simulations
            WHERE org_id IN (
                SELECT org_id FROM organization_members
                WHERE user_id = auth.uid()
                AND role IN ('admin', 'owner')
            )
        )
    );

-- Students can view tasks from published simulations
CREATE POLICY "Students can view published simulation tasks"
    ON simulation_tasks FOR SELECT
    TO authenticated
    USING (
        simulation_id IN (
            SELECT id FROM simulations WHERE status = 'published'
        )
    );

-- ============================================
-- SIMULATION_SKILLS TABLE POLICIES
-- ============================================

-- Enterprise users can manage skills for their org simulations
CREATE POLICY "Enterprise users can view their org simulation skills"
    ON simulation_skills FOR SELECT
    TO authenticated
    USING (
        simulation_id IN (
            SELECT id FROM simulations
            WHERE org_id IN (
                SELECT org_id FROM organization_members
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Enterprise users can create simulation skills"
    ON simulation_skills FOR INSERT
    TO authenticated
    WITH CHECK (
        simulation_id IN (
            SELECT id FROM simulations
            WHERE org_id IN (
                SELECT org_id FROM organization_members
                WHERE user_id = auth.uid()
                AND role IN ('admin', 'owner')
            )
        )
    );

CREATE POLICY "Enterprise users can delete simulation skills"
    ON simulation_skills FOR DELETE
    TO authenticated
    USING (
        simulation_id IN (
            SELECT id FROM simulations
            WHERE org_id IN (
                SELECT org_id FROM organization_members
                WHERE user_id = auth.uid()
                AND role IN ('admin', 'owner')
            )
        )
    );

-- Students can view skills from published simulations
CREATE POLICY "Students can view published simulation skills"
    ON simulation_skills FOR SELECT
    TO authenticated
    USING (
        simulation_id IN (
            SELECT id FROM simulations WHERE status = 'published'
        )
    );

-- ============================================
-- SIMULATION_ASSETS TABLE POLICIES
-- ============================================

-- Enterprise users can manage assets for their org simulations
CREATE POLICY "Enterprise users can view their org simulation assets"
    ON simulation_assets FOR SELECT
    TO authenticated
    USING (
        simulation_id IN (
            SELECT id FROM simulations
            WHERE org_id IN (
                SELECT org_id FROM organization_members
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Enterprise users can create simulation assets"
    ON simulation_assets FOR INSERT
    TO authenticated
    WITH CHECK (
        simulation_id IN (
            SELECT id FROM simulations
            WHERE org_id IN (
                SELECT org_id FROM organization_members
                WHERE user_id = auth.uid()
                AND role IN ('admin', 'owner')
            )
        )
    );

CREATE POLICY "Enterprise users can delete simulation assets"
    ON simulation_assets FOR DELETE
    TO authenticated
    USING (
        simulation_id IN (
            SELECT id FROM simulations
            WHERE org_id IN (
                SELECT org_id FROM organization_members
                WHERE user_id = auth.uid()
                AND role IN ('admin', 'owner')
            )
        )
    );

-- Students can view assets from published simulations
CREATE POLICY "Students can view published simulation assets"
    ON simulation_assets FOR SELECT
    TO authenticated
    USING (
        simulation_id IN (
            SELECT id FROM simulations WHERE status = 'published'
        )
    );

-- ============================================
-- SIMULATION_ENROLLMENTS TABLE POLICIES
-- ============================================

-- Students can view their own enrollments
CREATE POLICY "Students can view their own enrollments"
    ON simulation_enrollments FOR SELECT
    TO authenticated
    USING (student_id = auth.uid());

-- Students can create their own enrollments
CREATE POLICY "Students can create their own enrollments"
    ON simulation_enrollments FOR INSERT
    TO authenticated
    WITH CHECK (student_id = auth.uid());

-- Students can update their own enrollments
CREATE POLICY "Students can update their own enrollments"
    ON simulation_enrollments FOR UPDATE
    TO authenticated
    USING (student_id = auth.uid());

-- Enterprise users can view enrollments for their org simulations
CREATE POLICY "Enterprise users can view their org simulation enrollments"
    ON simulation_enrollments FOR SELECT
    TO authenticated
    USING (
        simulation_id IN (
            SELECT id FROM simulations
            WHERE org_id IN (
                SELECT org_id FROM organization_members
                WHERE user_id = auth.uid()
            )
        )
    );

-- ============================================
-- SIMULATION_CERTIFICATES TABLE POLICIES
-- ============================================

-- Students can view their own certificates
CREATE POLICY "Students can view their own certificates"
    ON simulation_certificates FOR SELECT
    TO authenticated
    USING (student_id = auth.uid());

-- Enterprise users can view certificates for their org simulations
CREATE POLICY "Enterprise users can view their org simulation certificates"
    ON simulation_certificates FOR SELECT
    TO authenticated
    USING (
        simulation_id IN (
            SELECT id FROM simulations
            WHERE org_id IN (
                SELECT org_id FROM organization_members
                WHERE user_id = auth.uid()
            )
        )
    );

-- System can create certificates (via service role)
CREATE POLICY "System can create certificates"
    ON simulation_certificates FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Public can view certificates by certificate_id (for verification)
CREATE POLICY "Public can verify certificates"
    ON simulation_certificates FOR SELECT
    TO anon
    USING (true);
