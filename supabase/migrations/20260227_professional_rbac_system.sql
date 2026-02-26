-- Add professional roles and invitation system for RBAC

-- 1. Update Profiles Role Constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('super_admin', 'enterprise_admin', 'instructor', 'learner', 'admin', 'student', 'enterprise', 'educator'));

-- 2. Update Organizations Status Constraint
ALTER TABLE public.organizations DROP CONSTRAINT IF EXISTS organizations_status_check;
ALTER TABLE public.organizations ADD CONSTRAINT organizations_status_check 
  CHECK (status IN ('active', 'suspended', 'pending', 'approved', 'rejected'));

-- 3. Update Organization Members Role Constraint
ALTER TABLE public.organization_members DROP CONSTRAINT IF EXISTS organization_members_role_check;
ALTER TABLE public.organization_members ADD CONSTRAINT organization_members_role_check 
  CHECK (role IN ('enterprise_admin', 'instructor', 'reviewer', 'admin', 'billing', 'member', 'owner'));

-- 4. Create Instructor Profiles Table
CREATE TABLE IF NOT EXISTS public.instructor_profiles (
  id uuid REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  professional_title text,
  linkedin_url text,
  years_of_experience integer,
  bio text,
  expertise_tags text[] DEFAULT array[]::text[],
  verification_badge boolean DEFAULT false,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Instructor Invitations Table
-- This handles secure, token-based invitations for organization-based roles.
CREATE TABLE IF NOT EXISTS public.instructor_invitations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  token text UNIQUE NOT NULL,
  org_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('enterprise_admin', 'instructor', 'reviewer')),
  invited_by uuid REFERENCES public.profiles(id) NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')) DEFAULT 'pending',
  expires_at timestamp with time zone DEFAULT (timezone('utc'::text, now()) + interval '7 days') NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  accepted_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.instructor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructor_invitations ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for Instructor Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.instructor_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own instructor profile" ON public.instructor_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own instructor profile" ON public.instructor_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 7. RLS Policies for Instructor Invitations
CREATE POLICY "Enterprise admins can manage invitations for their org" ON public.instructor_invitations
  FOR ALL TO authenticated
  USING (
    org_id IN (
      SELECT org_id FROM public.organization_members
      WHERE user_id = auth.uid() AND role = 'enterprise_admin'
    )
  );

CREATE POLICY "Public can view invitation by token for verification" ON public.instructor_invitations
  FOR SELECT TO anon, authenticated
  USING (status = 'pending' AND expires_at > now());

-- 8. Add trigger for updated_at on instructor_profiles
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER on_instructor_profile_updated
  BEFORE UPDATE ON public.instructor_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
