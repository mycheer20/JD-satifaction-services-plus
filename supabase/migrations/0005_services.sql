-- 0005 — Design services.
--
-- Services are a separate line of business from physical products: they are not
-- rows in `products` and they never appear inside the family tree. Each service
-- carries its own brief form, so a logo brief asks nothing that a menu brief
-- would ask.

create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  tagline     text,
  description text,
  -- Nullable: several services are quoted after the brief is reviewed.
  base_price  numeric(12, 2) check (base_price >= 0),
  price_note  text,
  currency    text not null default 'XOF',
  delivery_time text,
  icon        text,
  image_url   text,
  position    integer not null default 0,
  is_active   boolean not null default true,
  is_featured boolean not null default false,
  seo_title       text,
  seo_description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- A service can be revised over time; keeping forms versioned means an old
-- request still renders against the questions that were actually asked.
create table if not exists public.service_forms (
  id          uuid primary key default gen_random_uuid(),
  service_id  uuid not null references public.services (id) on delete cascade,
  name        text not null,
  description text,
  version     integer not null default 1,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (service_id, version)
);

create unique index if not exists service_forms_one_active_idx
  on public.service_forms (service_id) where is_active;

create table if not exists public.service_form_fields (
  id            uuid primary key default gen_random_uuid(),
  form_id       uuid not null references public.service_forms (id) on delete cascade,
  key           text not null,
  label         text not null,
  type          public.field_type not null default 'text',
  options       jsonb not null default '[]'::jsonb,
  placeholder   text,
  help_text     text,
  group_label   text,
  is_required   boolean not null default false,
  position      integer not null default 0,
  -- Only meaningful for the 'file' and 'files' types.
  max_files     integer,
  accepted_file_types text[],
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (form_id, key)
);

create index if not exists service_form_fields_form_idx
  on public.service_form_fields (form_id, position);

create table if not exists public.service_requests (
  id            uuid primary key default gen_random_uuid(),
  reference     text not null unique,
  service_id    uuid not null references public.services (id) on delete restrict,
  form_id       uuid references public.service_forms (id) on delete set null,
  -- Null for a guest request; the contact fields below are then the only way
  -- to reach the customer.
  user_id       uuid references auth.users (id) on delete set null,
  order_id      uuid,

  contact_name  text not null,
  contact_email text not null,
  contact_phone text,

  -- { "<field key>": <answer> } as submitted against `form_id`.
  answers       jsonb not null default '{}'::jsonb,

  status        public.service_request_status not null default 'submitted',
  quoted_amount numeric(12, 2) check (quoted_amount >= 0),
  currency      text not null default 'XOF',
  admin_notes   text,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists service_requests_user_idx on public.service_requests (user_id, created_at desc);
create index if not exists service_requests_status_idx on public.service_requests (status, created_at desc);
create index if not exists service_requests_service_idx on public.service_requests (service_id);

create table if not exists public.service_request_files (
  id            uuid primary key default gen_random_uuid(),
  request_id    uuid not null references public.service_requests (id) on delete cascade,
  field_key     text not null,
  storage_path  text not null,
  file_name     text not null,
  mime_type     text,
  size_bytes    bigint,
  created_at    timestamptz not null default now()
);

create index if not exists service_request_files_request_idx
  on public.service_request_files (request_id);

do $$
declare
  t text;
begin
  foreach t in array array['services', 'service_forms', 'service_form_fields', 'service_requests'] loop
    execute format('drop trigger if exists %I_set_updated_at on public.%I', t, t);
    execute format(
      'create trigger %I_set_updated_at before update on public.%I
         for each row execute function public.set_updated_at()', t, t);
  end loop;
end
$$;

-- Human-readable reference (DS-2026-000042) assigned server-side so a client
-- can never choose or guess another customer's reference.
create sequence if not exists public.service_request_reference_seq;

create or replace function public.assign_service_request_reference()
returns trigger
language plpgsql
as $$
begin
  if new.reference is null or new.reference = '' then
    new.reference := 'DS-' || to_char(now(), 'YYYY') || '-' ||
      lpad(nextval('public.service_request_reference_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists service_requests_assign_reference on public.service_requests;
create trigger service_requests_assign_reference
  before insert on public.service_requests
  for each row execute function public.assign_service_request_reference();
