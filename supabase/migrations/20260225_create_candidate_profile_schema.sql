-- Add new fields to the existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_type text,
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS resume_url text,
ADD COLUMN IF NOT EXISTS linkedin_url text,
ADD COLUMN IF NOT EXISTS github_url text,
ADD COLUMN IF NOT EXISTS portfolio_url text,
ADD COLUMN IF NOT EXISTS is_visible_to_employers boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS allow_recruiter_contact boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS share_simulation_performance boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS profile_strength integer DEFAULT 0;

-- Create candidate_education table
CREATE TABLE IF NOT EXISTS public.candidate_education (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    institution text NOT NULL,
    degree_type text,
    field_of_study text,
    graduation_year integer,
    cgpa text,
    academic_achievements text,
    relevant_coursework text[],
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create candidate_experience table
CREATE TABLE IF NOT EXISTS public.candidate_experience (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    company text NOT NULL,
    role text NOT NULL,
    industry text,
    start_date date,
    end_date date,
    is_current boolean DEFAULT false,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create candidate_skills table
CREATE TABLE IF NOT EXISTS public.candidate_skills (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    skill_name text NOT NULL,
    proficiency_level text CHECK (proficiency_level IN ('Beginner', 'Intermediate', 'Advanced')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, skill_name)
);

-- Create candidate_preferences table
CREATE TABLE IF NOT EXISTS public.candidate_preferences (
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    target_roles text[],
    preferred_industries text[],
    work_type text[],
    work_environment text[],
    open_to_relocation boolean DEFAULT false,
    work_authorization text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for all new tables
ALTER TABLE public.candidate_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for candidate_education
CREATE POLICY "Users can view their own education"
    ON public.candidate_education FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own education"
    ON public.candidate_education FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own education"
    ON public.candidate_education FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own education"
    ON public.candidate_education FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS Policies for candidate_experience
CREATE POLICY "Users can view their own experience"
    ON public.candidate_experience FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own experience"
    ON public.candidate_experience FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own experience"
    ON public.candidate_experience FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own experience"
    ON public.candidate_experience FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS Policies for candidate_skills
CREATE POLICY "Users can view their own skills"
    ON public.candidate_skills FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skills"
    ON public.candidate_skills FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skills"
    ON public.candidate_skills FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skills"
    ON public.candidate_skills FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS Policies for candidate_preferences
CREATE POLICY "Users can view their own preferences"
    ON public.candidate_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
    ON public.candidate_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
    ON public.candidate_preferences FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences"
    ON public.candidate_preferences FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_candidate_education_updated_at
    BEFORE UPDATE ON public.candidate_education
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidate_experience_updated_at
    BEFORE UPDATE ON public.candidate_experience
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidate_skills_updated_at
    BEFORE UPDATE ON public.candidate_skills
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidate_preferences_updated_at
    BEFORE UPDATE ON public.candidate_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
