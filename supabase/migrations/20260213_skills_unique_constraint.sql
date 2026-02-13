-- Migration: Add unique constraint to simulation_skills
-- Date: 2026-02-13

-- Add unique constraint to prevent duplicate skills for the same simulation
ALTER TABLE public.simulation_skills
ADD CONSTRAINT simulation_skills_sim_id_skill_name_unique UNIQUE (simulation_id, skill_name);

-- Add comment
COMMENT ON CONSTRAINT simulation_skills_sim_id_skill_name_unique ON public.simulation_skills IS 'Prevents duplicate skill tags for the same simulation';
