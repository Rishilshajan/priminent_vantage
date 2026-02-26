-- Broaden invitation management to include more admin roles and enforce organization domain logic helper if needed

-- 1. Drop existing restrictive policy
DROP POLICY IF EXISTS "Enterprise admins can manage invitations for their org" ON public.instructor_invitations;

-- 2. Create broader policy for org management roles
-- Allowing 'enterprise_admin', 'admin', and 'owner' to manage invitations
CREATE POLICY "Admins can manage invitations for their org" ON public.instructor_invitations
  FOR ALL TO authenticated
  USING (
    org_id IN (
      SELECT org_id FROM public.organization_members
      WHERE user_id = auth.uid() 
      AND role IN ('enterprise_admin', 'admin', 'owner')
    )
  );

-- No changes needed to "Public can view" policy as it's already correct for token verification
