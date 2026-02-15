-- Upgrade simulation_tasks table for enterprise features
ALTER TABLE simulation_tasks 
ADD COLUMN IF NOT EXISTS submission_instructions TEXT,
ADD COLUMN IF NOT EXISTS internal_notes TEXT,
ADD COLUMN IF NOT EXISTS is_required BOOLEAN DEFAULT TRUE;

-- Update submission_type check constraint
-- First, drop the old constraint
ALTER TABLE simulation_tasks DROP CONSTRAINT IF EXISTS simulation_tasks_submission_type_check;

-- Add the updated constraint
ALTER TABLE simulation_tasks ADD CONSTRAINT simulation_tasks_submission_type_check 
CHECK (submission_type IN ('file_upload', 'text', 'mcq', 'self_paced', 'code_snippet'));
