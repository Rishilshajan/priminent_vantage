-- Add Enterprise Task Builder columns to simulation_tasks
ALTER TABLE simulation_tasks 
ADD COLUMN IF NOT EXISTS introduction TEXT,
ADD COLUMN IF NOT EXISTS learning_objectives JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS deliverable_type TEXT DEFAULT 'TEXT' CHECK (deliverable_type IN ('TEXT', 'FILE_UPLOAD', 'MULTIPLE_CHOICE', 'CODE_SNIPPET', 'REFLECTION_ONLY')),
ADD COLUMN IF NOT EXISTS estimated_time TEXT,
ADD COLUMN IF NOT EXISTS order_index INTEGER,
ADD COLUMN IF NOT EXISTS unlock_condition TEXT DEFAULT 'SEQUENTIAL' CHECK (unlock_condition IN ('SEQUENTIAL', 'ALWAYS_OPEN'));

-- Update existing tasks with default order_index if null
UPDATE simulation_tasks SET order_index = task_number WHERE order_index IS NULL;
