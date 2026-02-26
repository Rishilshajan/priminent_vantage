-- Create simulation_reviews table
CREATE TABLE IF NOT EXISTS public.simulation_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    simulation_id UUID REFERENCES public.simulations(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(simulation_id, student_id)
);

-- Enable RLS
ALTER TABLE public.simulation_reviews ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view reviews') THEN
        CREATE POLICY "Anyone can view reviews" ON public.simulation_reviews FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Students can manage their own reviews') THEN
        CREATE POLICY "Students can manage their own reviews" ON public.simulation_reviews 
            FOR ALL USING (auth.uid() = student_id);
    END IF;
END $$;
