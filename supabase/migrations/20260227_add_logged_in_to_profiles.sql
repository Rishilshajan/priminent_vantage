-- Add logged_in column to profiles table for activity tracking
alter table public.profiles 
add column if not exists logged_in timestamp with time zone;

-- Update existing profiles to have a default value if needed (optional)
-- update public.profiles set logged_in = created_at where logged_in is null;
