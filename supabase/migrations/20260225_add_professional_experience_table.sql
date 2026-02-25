-- Create candidate_experience table for Step 3
CREATE TABLE IF NOT EXISTS public.candidate_experience (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    company text NOT NULL,
    role text NOT NULL,
    industry text,
    start_date date NOT NULL,
    end_date date,
    currently_working boolean DEFAULT false,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure columns exist (for robustness if table was built partially)
ALTER TABLE public.candidate_experience ADD COLUMN IF NOT EXISTS currently_working boolean DEFAULT false;

-- Add total_years_experience to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS total_years_experience numeric;

-- Enable RLS
ALTER TABLE public.candidate_experience ENABLE ROW LEVEL SECURITY;

-- Idempotent Policies using DO blocks
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own experience' AND tablename = 'candidate_experience') THEN
        CREATE POLICY "Users can view their own experience" ON public.candidate_experience FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own experience' AND tablename = 'candidate_experience') THEN
        CREATE POLICY "Users can insert their own experience" ON public.candidate_experience FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own experience' AND tablename = 'candidate_experience') THEN
        CREATE POLICY "Users can update their own experience" ON public.candidate_experience FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own experience' AND tablename = 'candidate_experience') THEN
        CREATE POLICY "Users can delete their own experience" ON public.candidate_experience FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Force a schema cache refresh
NOTIFY pgrst, 'reload schema';
