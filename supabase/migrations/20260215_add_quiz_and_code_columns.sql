-- Add quiz_data and code_config to simulation_tasks
ALTER TABLE simulation_tasks 
ADD COLUMN IF NOT EXISTS quiz_data JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS code_config JSONB DEFAULT '{"language": "javascript", "starter_code": ""}'::jsonb;

-- Comment for clarity
COMMENT ON COLUMN simulation_tasks.quiz_data IS 'Array of {question: string, options: string[], answer: number}';
COMMENT ON COLUMN simulation_tasks.code_config IS 'Object with {language: string, starter_code: string}';
