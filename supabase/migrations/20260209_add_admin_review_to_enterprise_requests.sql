-- Add admin review fields to enterprise_requests
ALTER TABLE enterprise_requests 
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS checklist_state JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS review_history JSONB DEFAULT '[]'::jsonb;

-- Update the status check to include new workflow statuses
ALTER TABLE enterprise_requests DROP CONSTRAINT IF EXISTS enterprise_requests_status_check;
ALTER TABLE enterprise_requests ADD CONSTRAINT enterprise_requests_status_check 
CHECK (status IN ('pending', 'reviewed', 'contacted', 'approved', 'rejected', 'clarification_requested'));

-- Allow admins to update enterprise requests
CREATE POLICY "Admins can update enterprise requests" 
ON enterprise_requests
FOR UPDATE
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'service_role' 
  OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'super_admin')
  )
)
WITH CHECK (
  auth.jwt() ->> 'role' = 'service_role' 
  OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'super_admin')
  )
);
