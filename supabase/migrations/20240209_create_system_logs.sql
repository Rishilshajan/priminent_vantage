-- Create Enum for Log Levels
CREATE TYPE log_level AS ENUM ('SUCCESS', 'INFO', 'WARNING', 'ERROR', 'CRITICAL');

-- Create System Logs Table
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_version INTEGER DEFAULT 1 NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  level log_level NOT NULL,
  
  -- Actor Details
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_type TEXT, -- 'user', 'system', 'api_key'
  actor_name TEXT,
  actor_role TEXT,
  actor_email TEXT,
  ip_address INET,
  user_agent TEXT,
  
  -- Organization Context
  org_id UUID, -- distinct from auth.users organization_id if needed, but useful for filtering
  org_name TEXT,
  
  -- Action Details
  action_code TEXT NOT NULL, -- e.g., 'AUTH_LOGIN_FAILED'
  action_category TEXT, -- e.g., 'AUTH', 'BILLING', 'RESOURCE'
  
  -- Target Resource
  resource_type TEXT, -- e.g., 'subscription', 'invoice'
  resource_id TEXT,
  
  -- Data
  message TEXT, -- Human readable summary
  params JSONB DEFAULT '{}'::jsonb, -- Input parameters
  result JSONB DEFAULT '{}'::jsonb, -- Output result/status
  tags TEXT[], -- Array of tags for flexible filtering
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for Fast Filtering
CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON system_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_actor_id ON system_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_org_id ON system_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_action_code ON system_logs(action_code);
CREATE INDEX IF NOT EXISTS idx_system_logs_params ON system_logs USING GIN (params);
CREATE INDEX IF NOT EXISTS idx_system_logs_tags ON system_logs USING GIN (tags);

-- Row Level Security (RLS)
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only Admins can view logs (Adjust 'admin' role check as per your auth setup)
CREATE POLICY "Admins can view system logs" 
ON system_logs
FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'service_role' OR
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (auth.users.raw_user_meta_data->>'role')::text = 'admin' 
  )
);

-- Policy: Insert allowed for authenticated users (application logic handles creation)
CREATE POLICY "Authenticated users can insert logs" 
ON system_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: No updates allowed (Immutable)
-- Policy: No deletes allowed (Immutable) - Only database admins can delete via SQL
