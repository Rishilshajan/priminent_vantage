-- Create Enterprise Requests Table
CREATE TABLE IF NOT EXISTS enterprise_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'approved', 'rejected')),
  
  -- Company Details
  company_name TEXT NOT NULL,
  country TEXT NOT NULL,
  website TEXT NOT NULL,
  industry TEXT NOT NULL,
  company_size TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  hq_location TEXT,
  hiring_regions TEXT,
  
  -- Admin Details
  admin_name TEXT NOT NULL,
  admin_title TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  admin_phone TEXT,
  admin_linkedin TEXT,
  
  -- Intended Use
  objectives TEXT[], -- Array of selected objectives
  use_case_description TEXT,
  
  -- Technical Readiness
  sso_required TEXT NOT NULL,
  idp_provider TEXT,
  estimated_users TEXT NOT NULL,
  
  -- Metadata
  ip_address INET,
  user_agent TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_enterprise_requests_status ON enterprise_requests(status);
CREATE INDEX IF NOT EXISTS idx_enterprise_requests_created_at ON enterprise_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enterprise_requests_company_name ON enterprise_requests(company_name);
CREATE INDEX IF NOT EXISTS idx_enterprise_requests_admin_email ON enterprise_requests(admin_email);

-- Row Level Security (RLS)
ALTER TABLE enterprise_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert (Request Access)
CREATE POLICY "Allow public insert for enterprise requests" 
ON enterprise_requests
FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Allow admins to view all requests
CREATE POLICY "Admins can view enterprise requests" 
ON enterprise_requests
FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'service_role' 
  OR 
  (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  OR 
  (auth.jwt() -> 'app_metadata' ->> 'role')::text = 'admin'
);

-- Policy: No updates allowed by public (Admins or system only)
-- We can add admin update policy if needed, for now standardizing on view only access for standard users.


-- Update the RLS policy for viewing enterprise requests to check the specific profiles table
-- This ensures that users with the 'admin' or 'super_admin' role in their profile can view the requests,
-- matching the application logic in the dashboard.

DROP POLICY IF EXISTS "Admins can view enterprise requests" ON enterprise_requests;

CREATE POLICY "Admins can view enterprise requests" 
ON enterprise_requests
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
