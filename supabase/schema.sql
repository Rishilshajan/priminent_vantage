-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  first_name text,
  last_name text,
  role text check (role in ('admin', 'student', 'enterprise', 'educator')) default 'student',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a trigger to automatically create a profile entry when a new user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
declare
  full_name text;
begin
  full_name := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name');
  
  insert into public.profiles (id, email, first_name, last_name, avatar_url, role)
  values (
    new.id, 
    new.email, 
    coalesce(
      new.raw_user_meta_data->>'first_name', 
      split_part(full_name, ' ', 1)
    ), 
    coalesce(
      new.raw_user_meta_data->>'last_name', 
      nullif(substring(full_name from position(' ' in full_name) + 1), full_name)
    ),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if it exists to allow re-runs
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create table for enterprise access codes
create table if not exists enterprise_access_codes (
  id uuid default gen_random_uuid() primary key,
  request_id uuid references enterprise_requests(id) on delete cascade not null,
  code text, -- Store plaintext code for testing purposes
  code_hash text not null,
  status text check (status in ('active', 'used', 'expired', 'revoked')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone default (timezone('utc'::text, now()) + interval '7 days') not null,
  usage_limit int default 1 not null,
  used_count int default 0 not null,
  metadata jsonb default '{}'::jsonb
);

-- Set up RLS for access codes
alter table enterprise_access_codes enable row level security;

-- Public can view code status for validation (locked by hash)
create policy "Public can validate access codes" on enterprise_access_codes
  for select using (true);

-- Only admins can see full details of all access codes
create policy "Admins can view all access codes" on enterprise_access_codes
  for select using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- Only service role/admin can create/update
create policy "Admins can insert access codes" on enterprise_access_codes
  for insert with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "Admins can update access codes" on enterprise_access_codes
  for update using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );
-- Create table for organizations
create table public.organizations (
  id uuid default gen_random_uuid() primary key,
  request_id uuid references enterprise_requests(id) on delete set null,
  name text not null,
  domain text not null unique,
  industry text,
  size text,
  website text,
  logo_url text,
  status text check (status in ('active', 'suspended', 'pending')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Organization Members/Admins
create table public.organization_members (
  id uuid default gen_random_uuid() primary key,
  org_id uuid references organizations(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  role text check (role in ('admin', 'billing', 'member')) default 'member',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(org_id, user_id)
);

-- RLS for Organizations
alter table public.organizations enable row level security;

create policy "Organizations viewable by members" on organizations
  for select using (
    exists (
      select 1 from organization_members
      where org_id = organizations.id and user_id = auth.uid()
    ) or exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "Public can insert organizations" on organizations
  for insert with check (true);

create policy "Admins can update organizations" on organizations
  for update using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- RLS for Members
alter table public.organization_members enable row level security;

create policy "Members viewable by fellow members" on organization_members
  for select using (
    exists (
      select 1 from organization_members m
      where m.org_id = organization_members.org_id and m.user_id = auth.uid()
    ) or exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "Public can join organizations" on organization_members
  for insert with check (true);
