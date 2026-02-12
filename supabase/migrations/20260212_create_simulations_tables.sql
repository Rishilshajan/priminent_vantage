-- Create simulations table
CREATE TABLE IF NOT EXISTS simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    
    -- Program Metadata
    title TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    industry TEXT,
    target_role TEXT,
    duration TEXT, -- e.g., "4-6 hours", "8-10 hours"
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    program_type TEXT DEFAULT 'job_simulation' CHECK (program_type IN ('job_simulation', 'career_exploration', 'skill_lab')),
    
    -- Employer Branding
    company_logo_url TEXT,
    banner_url TEXT,
    intro_video_url TEXT,
    about_company TEXT,
    why_work_here TEXT,
    
    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create simulation_tasks table
CREATE TABLE IF NOT EXISTS simulation_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    simulation_id UUID REFERENCES simulations(id) ON DELETE CASCADE NOT NULL,
    
    -- Task Metadata
    task_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    scenario_context TEXT,
    estimated_duration TEXT,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    
    -- Task Content
    instructions TEXT,
    what_you_learn TEXT[],
    what_you_do TEXT,
    
    -- Multimedia
    video_url TEXT,
    pdf_brief_url TEXT,
    dataset_url TEXT,
    supporting_docs JSONB DEFAULT '[]'::jsonb, -- Array of {name, url}
    
    -- Submission
    submission_type TEXT DEFAULT 'self_paced' CHECK (submission_type IN ('file_upload', 'text', 'mcq', 'self_paced')),
    submission_config JSONB DEFAULT '{}'::jsonb,
    
    -- Status
    status TEXT DEFAULT 'incomplete' CHECK (status IN ('incomplete', 'ready')),
    
    -- Ordering
    sort_order INTEGER NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(simulation_id, task_number),
    UNIQUE(simulation_id, sort_order)
);

-- Create simulation_skills table
CREATE TABLE IF NOT EXISTS simulation_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    simulation_id UUID REFERENCES simulations(id) ON DELETE CASCADE NOT NULL,
    skill_name TEXT NOT NULL,
    skill_type TEXT CHECK (skill_type IN ('technical', 'soft_skill')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(simulation_id, skill_name)
);

-- Create simulation_assets table
CREATE TABLE IF NOT EXISTS simulation_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    simulation_id UUID REFERENCES simulations(id) ON DELETE CASCADE NOT NULL,
    task_id UUID REFERENCES simulation_tasks(id) ON DELETE CASCADE,
    
    asset_type TEXT NOT NULL CHECK (asset_type IN ('logo', 'banner', 'video', 'pdf', 'dataset', 'document')),
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT,
    mime_type TEXT,
    
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create simulation_enrollments table
CREATE TABLE IF NOT EXISTS simulation_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    simulation_id UUID REFERENCES simulations(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Progress
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    current_task_id UUID REFERENCES simulation_tasks(id) ON DELETE SET NULL,
    completed_tasks UUID[] DEFAULT ARRAY[]::UUID[],
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    -- Timestamps
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Analytics
    time_spent_minutes INTEGER DEFAULT 0,
    
    UNIQUE(simulation_id, student_id)
);

-- Create simulation_certificates table
CREATE TABLE IF NOT EXISTS simulation_certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID REFERENCES simulation_enrollments(id) ON DELETE CASCADE NOT NULL,
    simulation_id UUID REFERENCES simulations(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    
    certificate_id TEXT UNIQUE NOT NULL, -- Human-readable ID like "CERT-2026-ABC123"
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Certificate Data
    student_name TEXT NOT NULL,
    simulation_title TEXT NOT NULL,
    skills_acquired TEXT[] DEFAULT ARRAY[]::TEXT[],
    completion_date DATE NOT NULL,
    
    -- Verification
    verification_url TEXT,
    qr_code_url TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_simulations_org_id ON simulations(org_id);
CREATE INDEX IF NOT EXISTS idx_simulations_status ON simulations(status);
CREATE INDEX IF NOT EXISTS idx_simulations_created_by ON simulations(created_by);

CREATE INDEX IF NOT EXISTS idx_simulation_tasks_simulation_id ON simulation_tasks(simulation_id);
CREATE INDEX IF NOT EXISTS idx_simulation_tasks_sort_order ON simulation_tasks(simulation_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_simulation_skills_simulation_id ON simulation_skills(simulation_id);

CREATE INDEX IF NOT EXISTS idx_simulation_assets_simulation_id ON simulation_assets(simulation_id);
CREATE INDEX IF NOT EXISTS idx_simulation_assets_task_id ON simulation_assets(task_id);

CREATE INDEX IF NOT EXISTS idx_simulation_enrollments_simulation_id ON simulation_enrollments(simulation_id);
CREATE INDEX IF NOT EXISTS idx_simulation_enrollments_student_id ON simulation_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_simulation_enrollments_status ON simulation_enrollments(status);

CREATE INDEX IF NOT EXISTS idx_simulation_certificates_student_id ON simulation_certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_simulation_certificates_certificate_id ON simulation_certificates(certificate_id);

-- Add updated_at trigger for simulations
CREATE OR REPLACE FUNCTION update_simulations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER simulations_updated_at
    BEFORE UPDATE ON simulations
    FOR EACH ROW
    EXECUTE FUNCTION update_simulations_updated_at();

-- Add updated_at trigger for simulation_tasks
CREATE OR REPLACE FUNCTION update_simulation_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER simulation_tasks_updated_at
    BEFORE UPDATE ON simulation_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_simulation_tasks_updated_at();
