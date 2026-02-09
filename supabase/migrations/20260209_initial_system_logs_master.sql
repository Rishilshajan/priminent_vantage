-- Create System Logs Table based on Master Schema
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT,
  event_version TEXT DEFAULT '1.0.0' NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  level TEXT NOT NULL,
  
  -- Actor Details
  actor_type TEXT, -- 'user', 'system', 'api_key'
  actor_id TEXT,
  actor_name TEXT,
  actor_role TEXT,
  actor_ip INET,
  actor_user_agent TEXT,
  
  -- Organization Context
  org_id TEXT,
  org_name TEXT,
  
  -- Action Details
  action_code TEXT NOT NULL,
  action_category TEXT, -- 'SECURITY', 'ORGANIZATION', 'CONTENT', 'SYSTEM'
  
  -- Target Resource
  target_resource_type TEXT,
  target_resource_id TEXT,

  -- Summary
  message TEXT,
  
  -- Data
  params JSONB DEFAULT '{}'::jsonb,
  result JSONB DEFAULT '{}'::jsonb,
  tags TEXT[] DEFAULT '{}'::text[],
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON system_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_system_logs_action_code ON system_logs(action_code);
CREATE INDEX IF NOT EXISTS idx_system_logs_action_category ON system_logs(action_category);
CREATE INDEX IF NOT EXISTS idx_system_logs_actor_id ON system_logs(actor_id);

-- Row Level Security (RLS)
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- 1. Allow public (unauthenticated) users to insert logs.
-- Required for logging events like "Enterprise Request Submitted" or "Sign Up Failed"
CREATE POLICY "Allow public insert for system_logs" 
ON system_logs
FOR INSERT
TO public
WITH CHECK (true);

-- 2. Allow Admins to view all logs
-- Uses the 'profiles' table for role check
CREATE POLICY "Admins can view system logs" 
ON system_logs
FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'service_role' 
  OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'super_admin')
  )
);
