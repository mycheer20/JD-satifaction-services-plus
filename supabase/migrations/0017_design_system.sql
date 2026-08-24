-- 0017b — Design du site : médias, placements, galerie, tokens.
-- Le rôle designer est ajouté dans 0017_design_system_enum.sql (transaction séparée).

create or replace function public.is_designer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_profiles
    where id = auth.uid() and role = 'designer'
  );
$$;

-- Admin + designer : accès au panneau Design du site.
create or replace function public.is_design_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_profiles
    where id = auth.uid() and role in ('admin', 'designer')
  );
$$;

revoke all on function public.is_designer() from public;
revoke all on function public.is_design_editor() from public;
grant execute on function public.is_designer() to authenticated, anon;
grant execute on function public.is_design_editor() to authenticated, anon;

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'design_publish_status') then
    create type public.design_publish_status as enum ('draft', 'published');
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Bibliothèque média (métadonnées — binaires dans Storage)
-- ---------------------------------------------------------------------------

create table if not exists public.design_media (
  id            uuid primary key default gen_random_uuid(),
  bucket_id     text not null default 'design-media',
  storage_path  text not null unique,
  public_url    text not null,
  display_name  text not null,
  description   text,
  alt_text      text,
  mime_type     text not null,
  extension     text not null,
  media_kind    text not null default 'image'
                check (media_kind in ('image', 'svg', 'animated')),
  width         integer check (width is null or width > 0),
  height        integer check (height is null or height > 0),
  size_bytes    bigint not null check (size_bytes > 0),
  is_active     boolean not null default true,
  created_by    uuid references auth.users (id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists design_media_active_idx
  on public.design_media (is_active, created_at desc);

create index if not exists design_media_kind_idx
  on public.design_media (media_kind);

-- ---------------------------------------------------------------------------
-- Configuration par emplacement (placement)
-- ---------------------------------------------------------------------------

create table if not exists public.design_section_configs (
  id           uuid primary key default gen_random_uuid(),
  placement    text not null,
  status       public.design_publish_status not null default 'draft',
  config       jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  updated_by   uuid references auth.users (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint design_section_configs_placement_status_key unique (placement, status)
);

create index if not exists design_section_configs_placement_idx
  on public.design_section_configs (placement, status);

-- ---------------------------------------------------------------------------
-- Slides (hero, sliders)
-- ---------------------------------------------------------------------------

create table if not exists public.design_slides (
  id                 uuid primary key default gen_random_uuid(),
  section_config_id  uuid not null references public.design_section_configs (id) on delete cascade,
  media_id           uuid not null references public.design_media (id) on delete restrict,
  position           integer not null default 0 check (position >= 0),
  duration_ms        integer not null default 5000 check (duration_ms between 2000 and 30000),
  transition         text not null default 'fade'
                     check (transition in ('fade', 'slide', 'zoom')),
  overlay_opacity    numeric(3, 2) not null default 0.45
                     check (overlay_opacity between 0 and 0.85),
  image_position     text not null default 'center',
  alt_text           text,
  is_active          boolean not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists design_slides_section_idx
  on public.design_slides (section_config_id, position);

-- ---------------------------------------------------------------------------
-- Galerie entreprise
-- ---------------------------------------------------------------------------

create table if not exists public.design_gallery_items (
  id          uuid primary key default gen_random_uuid(),
  media_id    uuid not null references public.design_media (id) on delete restrict,
  category    text not null default 'entreprise'
              check (category in (
                'entreprise', 'boutique', 'produits', 'equipe',
                'stock', 'livraisons', 'evenements', 'autres'
              )),
  title       text,
  description text,
  position    integer not null default 0 check (position >= 0),
  status      public.design_publish_status not null default 'draft',
  is_active   boolean not null default true,
  created_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists design_gallery_category_idx
  on public.design_gallery_items (category, status, position);

-- ---------------------------------------------------------------------------
-- Design tokens (couleurs, radius, ombres)
-- ---------------------------------------------------------------------------

create table if not exists public.design_theme_tokens (
  id         uuid primary key default gen_random_uuid(),
  status     public.design_publish_status not null default 'draft',
  tokens     jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint design_theme_tokens_status_key unique (status)
);

-- ---------------------------------------------------------------------------
-- Historique publications (architecture versioning)
-- ---------------------------------------------------------------------------

create table if not exists public.design_publications (
  id           uuid primary key default gen_random_uuid(),
  published_by uuid references auth.users (id) on delete set null,
  notes        text,
  snapshot     jsonb not null default '{}'::jsonb,
  published_at timestamptz not null default now()
);

create index if not exists design_publications_at_idx
  on public.design_publications (published_at desc);

-- ---------------------------------------------------------------------------
-- Triggers updated_at
-- ---------------------------------------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'design_media', 'design_section_configs', 'design_slides',
    'design_gallery_items', 'design_theme_tokens'
  ] loop
    execute format('drop trigger if exists %I_set_updated_at on public.%I', t, t);
    execute format(
      'create trigger %I_set_updated_at before update on public.%I
       for each row execute function public.set_updated_at()',
      t, t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Storage bucket design-media
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'design-media',
  'design-media',
  true,
  8388608,
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif',
    'image/svg+xml'
  ]
)
on conflict (id) do update
set public             = excluded.public,
    file_size_limit    = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.design_media enable row level security;
alter table public.design_section_configs enable row level security;
alter table public.design_slides enable row level security;
alter table public.design_gallery_items enable row level security;
alter table public.design_theme_tokens enable row level security;
alter table public.design_publications enable row level security;

-- Médias actifs : lecture publique (URLs non devinables). Éditeurs : tout voir.
drop policy if exists design_media_public_read on public.design_media;
create policy design_media_public_read
  on public.design_media for select
  using (is_active = true or public.is_design_editor());

drop policy if exists design_media_manage on public.design_media;
create policy design_media_manage
  on public.design_media for all
  using (public.is_design_editor())
  with check (public.is_design_editor());

-- Configurations publiées : lecture publique. Brouillons : éditeurs seulement.
drop policy if exists design_section_configs_public_read on public.design_section_configs;
create policy design_section_configs_public_read
  on public.design_section_configs for select
  using (status = 'published' or public.is_design_editor());

drop policy if exists design_section_configs_manage on public.design_section_configs;
create policy design_section_configs_manage
  on public.design_section_configs for all
  using (public.is_design_editor())
  with check (public.is_design_editor());

-- Slides : via section parent (éditeurs ou sections publiées)
drop policy if exists design_slides_public_read on public.design_slides;
create policy design_slides_public_read
  on public.design_slides for select
  using (
    public.is_design_editor()
    or exists (
      select 1 from public.design_section_configs c
      where c.id = section_config_id and c.status = 'published'
    )
  );

drop policy if exists design_slides_manage on public.design_slides;
create policy design_slides_manage
  on public.design_slides for all
  using (public.is_design_editor())
  with check (public.is_design_editor());

-- Galerie publiée
drop policy if exists design_gallery_public_read on public.design_gallery_items;
create policy design_gallery_public_read
  on public.design_gallery_items for select
  using (
    (status = 'published' and is_active = true)
    or public.is_design_editor()
  );

drop policy if exists design_gallery_manage on public.design_gallery_items;
create policy design_gallery_manage
  on public.design_gallery_items for all
  using (public.is_design_editor())
  with check (public.is_design_editor());

-- Tokens publiés
drop policy if exists design_theme_tokens_public_read on public.design_theme_tokens;
create policy design_theme_tokens_public_read
  on public.design_theme_tokens for select
  using (status = 'published' or public.is_design_editor());

drop policy if exists design_theme_tokens_manage on public.design_theme_tokens;
create policy design_theme_tokens_manage
  on public.design_theme_tokens for all
  using (public.is_design_editor())
  with check (public.is_design_editor());

-- Publications : éditeurs seulement
drop policy if exists design_publications_read on public.design_publications;
create policy design_publications_read
  on public.design_publications for select
  using (public.is_design_editor());

drop policy if exists design_publications_insert on public.design_publications;
create policy design_publications_insert
  on public.design_publications for insert
  with check (public.is_design_editor());

-- Storage : lecture publique, écriture réservée aux éditeurs design
drop policy if exists "design media public read" on storage.objects;
create policy "design media public read"
  on storage.objects for select
  using (bucket_id = 'design-media');

drop policy if exists "design media editor write" on storage.objects;
create policy "design media editor write"
  on storage.objects for all
  using (bucket_id = 'design-media' and public.is_design_editor())
  with check (bucket_id = 'design-media' and public.is_design_editor());
