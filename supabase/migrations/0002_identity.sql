-- 0002 — User profiles, roles and the authorization helpers used by every
-- row level security policy in the schema.

create table if not exists public.user_profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  role          public.user_role not null default 'customer',
  full_name     text,
  phone         text,
  avatar_url    text,
  -- Default shipping/billing details, kept as JSON so the checkout form can
  -- evolve without a migration.
  address       jsonb not null default '{}'::jsonb,
  marketing_opt_in boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists user_profiles_role_idx on public.user_profiles (role);

drop trigger if exists user_profiles_set_updated_at on public.user_profiles;
create trigger user_profiles_set_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Authorization helpers
-- ---------------------------------------------------------------------------
-- SECURITY DEFINER so policies on user_profiles itself do not recurse when a
-- policy on another table needs to look up the caller's role.

create or replace function public.current_role_name()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role from public.user_profiles where id = auth.uid()),
    'customer'::public.user_role
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Staff share read access and day-to-day operations with admins, but not
-- destructive or settings-level actions.
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_profiles
    where id = auth.uid() and role in ('admin', 'staff')
  );
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.is_staff() from public;
revoke all on function public.current_role_name() from public;
grant execute on function public.is_admin() to authenticated, anon;
grant execute on function public.is_staff() to authenticated, anon;
grant execute on function public.current_role_name() to authenticated, anon;

-- ---------------------------------------------------------------------------
-- Profile provisioning
-- ---------------------------------------------------------------------------
-- A profile row is created for every new auth user. The role is always
-- 'customer' here: promoting an account is a deliberate, separate action so a
-- self-service signup can never grant itself elevated access.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, full_name, phone)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Blocks privilege escalation through a direct PATCH on user_profiles: the role
-- column can only change when the statement is issued by an admin or by a
-- trusted server-side context (service role, which bypasses RLS but not this
-- trigger's auth.uid() check returning null).
create or replace function public.guard_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'Modification du rôle non autorisée';
  end if;
  return new;
end;
$$;

drop trigger if exists user_profiles_guard_role on public.user_profiles;
create trigger user_profiles_guard_role
  before update on public.user_profiles
  for each row execute function public.guard_role_change();
