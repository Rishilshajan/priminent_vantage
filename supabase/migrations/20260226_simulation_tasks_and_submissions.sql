-- Create simulation_tasks table
CREATE TABLE IF NOT EXISTS public.simulation_tasks (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4 (),
  simulation_id uuid NOT NULL,
  task_number integer NOT NULL,
  title text NOT NULL,
  description text NULL,
  scenario_context text NULL,
  estimated_duration text NULL,
  difficulty_level text NULL,
  instructions text NULL,
  what_you_learn text[] NULL,
  what_you_do text NULL,
  video_url text NULL,
  pdf_brief_url text NULL,
  dataset_url text NULL,
  supporting_docs jsonb NULL DEFAULT '[]'::jsonb,
  submission_type text NULL DEFAULT 'self_paced'::text,
  submission_config jsonb NULL DEFAULT '{}'::jsonb,
  status text NULL DEFAULT 'incomplete'::text,
  sort_order integer NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  submission_instructions text NULL,
  internal_notes text NULL,
  is_required boolean NULL DEFAULT true,
  video_assets jsonb NULL DEFAULT '[]'::jsonb,
  introduction text NULL,
  learning_objectives jsonb NULL DEFAULT '[]'::jsonb,
  attachments jsonb NULL DEFAULT '[]'::jsonb,
  deliverable_type text NULL DEFAULT 'TEXT'::text,
  estimated_time text NULL,
  order_index integer NULL,
  unlock_condition text NULL DEFAULT 'SEQUENTIAL'::text,
  quiz_data jsonb NULL DEFAULT '[]'::jsonb,
  code_config jsonb NULL DEFAULT '{"language": "javascript", "starter_code": ""}'::jsonb,
  CONSTRAINT simulation_tasks_pkey PRIMARY KEY (id),
  CONSTRAINT simulation_tasks_simulation_id_task_number_key UNIQUE (simulation_id, task_number),
  CONSTRAINT simulation_tasks_simulation_id_sort_order_key UNIQUE (simulation_id, sort_order),
  CONSTRAINT simulation_tasks_simulation_id_fkey FOREIGN KEY (simulation_id) REFERENCES simulations (id) ON DELETE CASCADE,
  CONSTRAINT simulation_tasks_deliverable_type_check CHECK (
    (
      deliverable_type = ANY (
        ARRAY[
          'TEXT'::text,
          'FILE_UPLOAD'::text,
          'MULTIPLE_CHOICE'::text,
          'CODE_SNIPPET'::text,
          'REFLECTION_ONLY'::text
        ]
      )
    )
  ),
  CONSTRAINT simulation_tasks_unlock_condition_check CHECK (
    (
      unlock_condition = ANY (ARRAY['SEQUENTIAL'::text, 'ALWAYS_OPEN'::text])
    )
  ),
  CONSTRAINT simulation_tasks_difficulty_level_check CHECK (
    (
      difficulty_level = ANY (
        ARRAY[
          'beginner'::text,
          'intermediate'::text,
          'advanced'::text
        ]
      )
    )
  ),
  CONSTRAINT simulation_tasks_status_check CHECK (
    (
      status = ANY (ARRAY['incomplete'::text, 'ready'::text])
    )
  ),
  CONSTRAINT simulation_tasks_submission_type_check CHECK (
    (
      submission_type = ANY (
        ARRAY[
          'file_upload'::text,
          'text'::text,
          'mcq'::text,
          'self_paced'::text,
          'code_snippet'::text
        ]
      )
    )
  )
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_simulation_tasks_simulation_id ON public.simulation_tasks (simulation_id);
CREATE INDEX IF NOT EXISTS idx_simulation_tasks_sort_order ON public.simulation_tasks (simulation_id, sort_order);

-- Create simulation_task_submissions table
CREATE TABLE IF NOT EXISTS public.simulation_task_submissions (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4 (),
  student_id uuid NOT NULL,
  task_id uuid NOT NULL,
  simulation_id uuid NOT NULL,
  submission_data jsonb NULL DEFAULT '{}'::jsonb,
  status text NULL DEFAULT 'submitted'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT simulation_task_submissions_pkey PRIMARY KEY (id),
  CONSTRAINT simulation_task_submissions_student_id_fkey FOREIGN KEY (student_id) REFERENCES profiles (id) ON DELETE CASCADE,
  CONSTRAINT simulation_task_submissions_task_id_fkey FOREIGN KEY (task_id) REFERENCES simulation_tasks (id) ON DELETE CASCADE,
  CONSTRAINT simulation_task_submissions_simulation_id_fkey FOREIGN KEY (simulation_id) REFERENCES simulations (id) ON DELETE CASCADE,
  CONSTRAINT simulation_task_submissions_student_task_unique UNIQUE (student_id, task_id)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_task_submissions_student_sim ON public.simulation_task_submissions (student_id, simulation_id);

-- Updated at function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS simulation_tasks_updated_at ON simulation_tasks;
CREATE TRIGGER simulation_tasks_updated_at
BEFORE UPDATE ON simulation_tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS simulation_task_submissions_updated_at ON simulation_task_submissions;
CREATE TRIGGER simulation_task_submissions_updated_at
BEFORE UPDATE ON simulation_task_submissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
