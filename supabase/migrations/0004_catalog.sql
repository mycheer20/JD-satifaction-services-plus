-- 0004 — Products and everything attached to them.
--
-- There is exactly one products table for the whole catalogue. Characteristics
-- that differ between a laptop and a notebook live in product_attributes,
-- driven by the field set of the product's subcategory.

create table if not exists public.brands (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  name       text not null,
  logo_url   text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  subcategory_id uuid not null references public.subcategories (id) on delete restrict,
  brand_id       uuid references public.brands (id) on delete set null,

  -- Common fields, present for practically every product.
  slug              text not null unique,
  name              text not null,
  short_description text,
  description       text,
  model             text,
  sku               text unique,
  kind              public.item_kind not null default 'physical_product',

  price       numeric(12, 2) not null check (price >= 0),
  sale_price  numeric(12, 2) check (sale_price >= 0),
  currency    text not null default 'XOF',

  track_inventory     boolean not null default true,
  stock               integer not null default 0 check (stock >= 0),
  low_stock_threshold integer not null default 5 check (low_stock_threshold >= 0),

  status      public.product_status not null default 'draft',
  is_featured boolean not null default false,
  tags        text[] not null default '{}',

  weight_grams integer check (weight_grams >= 0),
  dimensions   jsonb not null default '{}'::jsonb,

  seo_title       text,
  seo_description text,

  rating_average numeric(3, 2) not null default 0,
  rating_count   integer not null default 0,

  published_at timestamptz,
  created_by   uuid references auth.users (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint products_sale_price_below_price
    check (sale_price is null or sale_price <= price)
);

create index if not exists products_subcategory_idx on public.products (subcategory_id);
create index if not exists products_brand_idx on public.products (brand_id);
create index if not exists products_status_idx on public.products (status, published_at desc);
create index if not exists products_featured_idx on public.products (is_featured) where status = 'active';
create index if not exists products_price_idx on public.products (price);
create index if not exists products_tags_idx on public.products using gin (tags);

-- `array_to_string` is only STABLE, because in general it depends on the
-- element type's output function. For text[] with a constant separator it is
-- genuinely immutable, and this wrapper is what lets the generated column below
-- be accepted.
create or replace function public.tags_to_text(tags text[])
returns text
language sql
immutable
as $$
  select coalesce(array_to_string(tags, ' '), '');
$$;

-- Full-text search over the fields a shopper is likely to type.
alter table public.products
  add column if not exists search_document tsvector
  generated always as (
    setweight(to_tsvector('simple', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(model, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(sku, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(short_description, '')), 'C') ||
    setweight(to_tsvector('simple', public.tags_to_text(tags)), 'C') ||
    setweight(to_tsvector('simple', coalesce(description, '')), 'D')
  ) stored;

create index if not exists products_search_idx on public.products using gin (search_document);
create index if not exists products_name_trgm_idx
  on public.products using gin (public.normalize_text(name) extensions.gin_trgm_ops);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists brands_set_updated_at on public.brands;
create trigger brands_set_updated_at
  before update on public.brands
  for each row execute function public.set_updated_at();

-- Keep published_at in step with the status so "new arrivals" is meaningful.
create or replace function public.sync_product_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'active' and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists products_sync_published_at on public.products;
create trigger products_sync_published_at
  before insert or update of status on public.products
  for each row execute function public.sync_product_published_at();

-- ---------------------------------------------------------------------------
-- Images
-- ---------------------------------------------------------------------------
-- Binary data stays in Supabase Storage. Only the bucket path and the public
-- URL derived from it are stored here.

create table if not exists public.product_images (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references public.products (id) on delete cascade,
  storage_path text not null,
  url          text not null,
  alt_text     text,
  position     integer not null default 0,
  is_primary   boolean not null default false,
  width        integer,
  height       integer,
  created_at   timestamptz not null default now()
);

create index if not exists product_images_product_idx
  on public.product_images (product_id, position);

-- At most one primary image per product.
create unique index if not exists product_images_one_primary_idx
  on public.product_images (product_id) where is_primary;

-- ---------------------------------------------------------------------------
-- Variants (optional)
-- ---------------------------------------------------------------------------
-- A simple product has zero rows here and is sold through the parent product's
-- own price and stock.

create table if not exists public.product_variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products (id) on delete cascade,
  sku         text unique,
  name        text not null,
  -- {"Couleur": "Noir", "Taille": "M"}
  options     jsonb not null default '{}'::jsonb,
  price       numeric(12, 2) check (price >= 0),
  sale_price  numeric(12, 2) check (sale_price >= 0),
  stock       integer not null default 0 check (stock >= 0),
  image_id    uuid references public.product_images (id) on delete set null,
  position    integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists product_variants_product_idx
  on public.product_variants (product_id, position);

drop trigger if exists product_variants_set_updated_at on public.product_variants;
create trigger product_variants_set_updated_at
  before update on public.product_variants
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Dynamic attribute values
-- ---------------------------------------------------------------------------
-- `field_key` matches field_definitions.key within the subcategory's field set.
-- Values are split across typed columns so numeric ranges and exact-match
-- facets can be filtered and indexed properly.

create table if not exists public.product_attributes (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products (id) on delete cascade,
  field_key     text not null,
  value_text    text,
  value_number  numeric(14, 4),
  value_boolean boolean,
  value_json    jsonb,
  unique (product_id, field_key)
);

create index if not exists product_attributes_key_text_idx
  on public.product_attributes (field_key, value_text);
create index if not exists product_attributes_key_number_idx
  on public.product_attributes (field_key, value_number);
create index if not exists product_attributes_product_idx
  on public.product_attributes (product_id);

-- ---------------------------------------------------------------------------
-- Internal supply information
-- ---------------------------------------------------------------------------
-- Deliberately a separate table rather than columns on products: no public
-- query can leak a sourcing detail it never selects. Access is restricted to
-- admins by the policies in 0009_rls.sql.

create table if not exists public.suppliers (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  contact_email text,
  contact_phone text,
  website       text,
  notes         text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.product_supply (
  product_id          uuid primary key references public.products (id) on delete cascade,
  supplier_id         uuid references public.suppliers (id) on delete set null,
  supplier_reference  text,
  cost_price          numeric(12, 2) check (cost_price >= 0),
  lead_time_days      integer check (lead_time_days >= 0),
  -- When true, the item is sourced on demand. This never reaches the storefront.
  is_sourced_on_demand boolean not null default false,
  internal_notes      text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

drop trigger if exists suppliers_set_updated_at on public.suppliers;
create trigger suppliers_set_updated_at
  before update on public.suppliers
  for each row execute function public.set_updated_at();

drop trigger if exists product_supply_set_updated_at on public.product_supply;
create trigger product_supply_set_updated_at
  before update on public.product_supply
  for each row execute function public.set_updated_at();
