-- Align profiles and education tables with refined onboarding structure
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS date_of_birth text,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS highest_education_level text,
ADD COLUMN IF NOT EXISTS academic_status text,
ADD COLUMN IF NOT EXISTS switch_reason text,
ADD COLUMN IF NOT EXISTS career_gap_years integer,
ADD COLUMN IF NOT EXISTS last_role text;

-- Change certifications to JSONB to store array of objects {name, issuing_body, year}
-- If it already exists as text[], we drop and recreate or cast. To be safe in migration:
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='certifications') THEN
        ALTER TABLE public.profiles ALTER COLUMN certifications TYPE jsonb USING to_jsonb(certifications);
    ELSE
        ALTER TABLE public.profiles ADD COLUMN certifications jsonb DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- Update candidate_education for structured CGPA and academic status
ALTER TABLE public.candidate_education
ADD COLUMN IF NOT EXISTS cgpa_value numeric,
ADD COLUMN IF NOT EXISTS cgpa_scale integer,
ADD COLUMN IF NOT EXISTS academic_status text;
