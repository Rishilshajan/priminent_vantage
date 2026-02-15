-- Add video_assets to simulation_tasks for multiple videos support
ALTER TABLE simulation_tasks 
ADD COLUMN IF NOT EXISTS video_assets JSONB DEFAULT '[]'::jsonb;

-- Comment for clarity
COMMENT ON COLUMN simulation_tasks.video_assets IS 'Array of {title: string, url: string, type: "upload" | "embed"}';
