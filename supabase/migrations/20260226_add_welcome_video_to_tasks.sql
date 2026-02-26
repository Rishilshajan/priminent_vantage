-- Comprehensive migration to align simulation_tasks with the required schema
ALTER TABLE public.simulation_tasks 
ADD COLUMN IF NOT EXISTS welcome_video_url TEXT,
ADD COLUMN IF NOT EXISTS what_you_do TEXT,
ADD COLUMN IF NOT EXISTS learning_objectives JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS introduction TEXT,
ADD COLUMN IF NOT EXISTS submission_instructions TEXT,
ADD COLUMN IF NOT EXISTS internal_notes TEXT,
ADD COLUMN IF NOT EXISTS is_required BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS video_assets JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS deliverable_type TEXT DEFAULT 'TEXT' CHECK (deliverable_type IN ('TEXT', 'FILE_UPLOAD', 'MULTIPLE_CHOICE', 'CODE_SNIPPET', 'REFLECTION_ONLY')),
ADD COLUMN IF NOT EXISTS estimated_time TEXT,
ADD COLUMN IF NOT EXISTS order_index INTEGER,
ADD COLUMN IF NOT EXISTS unlock_condition TEXT DEFAULT 'SEQUENTIAL' CHECK (unlock_condition IN ('SEQUENTIAL', 'ALWAYS_OPEN')),
ADD COLUMN IF NOT EXISTS quiz_data JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS code_config JSONB DEFAULT '{"language": "javascript", "starter_code": ""}'::jsonb;
