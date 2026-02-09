-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view system logs" ON system_logs;

-- Re-create the policy using JWT metadata (safer, no table access required)
CREATE POLICY "Admins can view system logs" 
ON system_logs 
FOR SELECT 
TO authenticated 
USING (
  auth.jwt() ->> 'role' = 'service_role' 
  OR 
  (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  OR 
  (auth.jwt() -> 'app_metadata' ->> 'role')::text = 'admin'
);
