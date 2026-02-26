-- Migration: Add access_code to simulations
-- Date: 2026-02-27

ALTER TABLE public.simulations 
ADD COLUMN IF NOT EXISTS access_code TEXT UNIQUE;

-- Add index for fast lookup by code
CREATE INDEX IF NOT EXISTS idx_simulations_access_code ON public.simulations(access_code);
