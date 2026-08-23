-- 0003 — The commercial tree: Family -> Category -> Subcategory.
--
-- The tree is preconfigured by the seed and is never derived from product data.
-- Slugs are globally unique per level so the public routes /famille/[slug],
-- /categorie/[slug] and /sous-categorie/[slug] can resolve with a single lookup.

-- A field set is the group of subcategory-specific fields shown when creating a
-- product. Several subcategories can share one set (all "cable" subcategories
-- describe the same characteristics), which is why it is a table of its own
-- rather than a column on subcategories.
create table if not exists public.field_sets (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,
  name        text not null,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.families (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text,
  icon        text,
  image_url   text,
  position    integer not null default 0,
  is_active   boolean not null default true,
  seo_title       text,
  seo_description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  family_id   uuid not null references public.families (id) on delete cascade,
  slug        text not null unique,
  name        text not null,
  description text,
  icon        text,
  image_url   text,
  position    integer not null default 0,
  is_active   boolean not null default true,
  seo_title       text,
  seo_description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.subcategories (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid not null references public.categories (id) on delete cascade,
  field_set_id uuid references public.field_sets (id) on delete set null,
  slug         text not null unique,
  name         text not null,
  description  text,
  image_url    text,
  position     integer not null default 0,
  is_active    boolean not null default true,
  seo_title       text,
  seo_description text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists categories_family_idx on public.categories (family_id, position);
create index if not exists subcategories_category_idx on public.subcategories (category_id, position);
create index if not exists subcategories_field_set_idx on public.subcategories (field_set_id);

do $$
declare
  t text;
begin
  foreach t in array array['field_sets', 'families', 'categories', 'subcategories'] loop
    execute format('drop trigger if exists %I_set_updated_at on public.%I', t, t);
    execute format(
      'create trigger %I_set_updated_at before update on public.%I
         for each row execute function public.set_updated_at()', t, t);
  end loop;
end
$$;

-- ---------------------------------------------------------------------------
-- Dynamic field definitions
-- ---------------------------------------------------------------------------
-- One row per characteristic offered by a field set. The admin product form and
-- the public specification table are both rendered from these rows, so adding a
-- new characteristic never requires a code change.

create table if not exists public.field_definitions (
  id            uuid primary key default gen_random_uuid(),
  field_set_id  uuid not null references public.field_sets (id) on delete cascade,
  key           text not null,
  label         text not null,
  type          public.field_type not null default 'text',
  -- Displayed after the value ("16 Go", "2.1 kg").
  unit          text,
  -- For select/multiselect: ["Intel", "AMD", ...]
  options       jsonb not null default '[]'::jsonb,
  placeholder   text,
  help_text     text,
  -- Fields sharing a group_label are rendered together under one heading.
  group_label   text,
  is_required   boolean not null default false,
  -- Offered as a facet on category listing pages.
  is_filterable boolean not null default false,
  -- Surfaced in the short "key specs" block on the product page.
  is_key_spec   boolean not null default false,
  position      integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (field_set_id, key)
);

create index if not exists field_definitions_set_idx
  on public.field_definitions (field_set_id, position);

drop trigger if exists field_definitions_set_updated_at on public.field_definitions;
create trigger field_definitions_set_updated_at
  before update on public.field_definitions
  for each row execute function public.set_updated_at();
