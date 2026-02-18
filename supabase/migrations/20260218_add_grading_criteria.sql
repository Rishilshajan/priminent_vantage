ALTER TABLE simulations
ADD COLUMN IF NOT EXISTS grading_criteria TEXT;

ALTER TABLE simulations
ADD COLUMN IF NOT EXISTS certificate_director_name TEXT;
