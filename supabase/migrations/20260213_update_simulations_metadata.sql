-- Migration: Add enterprise-grade metadata fields to simulations
-- Date: 2026-02-13

-- Add new columns to simulations table
ALTER TABLE public.simulations 
ADD COLUMN IF NOT EXISTS learning_outcomes TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS prerequisites TEXT,
ADD COLUMN IF NOT EXISTS target_audience TEXT,
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'draft' CHECK (visibility IN ('draft', 'internal', 'educator_assigned', 'public', 'private', 'archived')),
ADD COLUMN IF NOT EXISTS analytics_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS certificate_enabled BOOLEAN DEFAULT TRUE;

-- Update program_type constraint to include new types requested by user
ALTER TABLE public.simulations 
DROP CONSTRAINT IF EXISTS simulations_program_type_check;

ALTER TABLE public.simulations 
ADD CONSTRAINT simulations_program_type_check 
CHECK (program_type IN ('job_simulation', 'career_exploration', 'skill_sprint', 'case_study', 'internship_preview'));

-- Add comment for documentation
COMMENT ON COLUMN public.simulations.learning_outcomes IS 'Structured bullet-based learning outcomes for the simulation';
COMMENT ON COLUMN public.simulations.visibility IS 'Access control for the program: draft, internal, public, or private';
