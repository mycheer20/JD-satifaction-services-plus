-- 0006 — Coupons, orders, order lines and payments.

create table if not exists public.coupons (
  id                 uuid primary key default gen_random_uuid(),
  code               text not null unique,
  description        text,
  discount_type      public.discount_type not null default 'percentage',
  discount_value     numeric(12, 2) not null check (discount_value > 0),
  min_order_amount   numeric(12, 2) check (min_order_amount >= 0),
  max_discount_amount numeric(12, 2) check (max_discount_amount >= 0),
  usage_limit        integer check (usage_limit > 0),
  usage_count        integer not null default 0 check (usage_count >= 0),
  per_user_limit     integer check (per_user_limit > 0),
  starts_at          timestamptz,
  ends_at            timestamptz,
  is_active          boolean not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists coupons_active_idx on public.coupons (is_active, ends_at);

create table if not exists public.orders (
  id        uuid primary key default gen_random_uuid(),
  reference text not null unique,
  user_id   uuid references auth.users (id) on delete set null,
  status    public.order_status not null default 'pending',

  customer_name  text not null,
  customer_email text not null,
  customer_phone text,

  shipping_address jsonb not null default '{}'::jsonb,
  billing_address  jsonb not null default '{}'::jsonb,

  currency       text not null default 'XOF',
  subtotal       numeric(12, 2) not null default 0 check (subtotal >= 0),
  discount_total numeric(12, 2) not null default 0 check (discount_total >= 0),
  shipping_total numeric(12, 2) not null default 0 check (shipping_total >= 0),
  tax_total      numeric(12, 2) not null default 0 check (tax_total >= 0),
  total          numeric(12, 2) not null default 0 check (total >= 0),

  coupon_id   uuid references public.coupons (id) on delete set null,
  coupon_code text,

  customer_note text,
  admin_note    text,

  placed_at  timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders (user_id, created_at desc);
create index if not exists orders_status_idx on public.orders (status, created_at desc);

-- Line items snapshot the name, price and image at purchase time so a later
-- catalogue edit never rewrites order history.
create table if not exists public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders (id) on delete cascade,
  item_kind  public.item_kind not null default 'physical_product',

  product_id uuid references public.products (id) on delete set null,
  variant_id uuid references public.product_variants (id) on delete set null,
  service_id uuid references public.services (id) on delete set null,
  service_request_id uuid references public.service_requests (id) on delete set null,

  name       text not null,
  sku        text,
  image_url  text,
  options    jsonb not null default '{}'::jsonb,

  unit_price numeric(12, 2) not null check (unit_price >= 0),
  quantity   integer not null check (quantity > 0),
  line_total numeric(12, 2) not null check (line_total >= 0),

  created_at timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items (order_id);
create index if not exists order_items_product_idx on public.order_items (product_id);

-- ---------------------------------------------------------------------------
-- Payments
-- ---------------------------------------------------------------------------
-- Provider-agnostic on purpose. A payment row records what a provider was asked
-- to do and what it answered; no provider-specific column exists here.

create table if not exists public.payments (
  id       uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,

  provider              text not null,
  payment_method        text not null,
  status                public.payment_status not null default 'pending',
  amount                numeric(12, 2) not null check (amount >= 0),
  currency              text not null default 'XOF',
  transaction_reference text,
  -- Raw provider response, kept for reconciliation and webhook replay.
  provider_payload      jsonb not null default '{}'::jsonb,
  failure_reason        text,
  processed_at          timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists payments_order_idx on public.payments (order_id);
create index if not exists payments_status_idx on public.payments (status, created_at desc);
create unique index if not exists payments_provider_reference_idx
  on public.payments (provider, transaction_reference)
  where transaction_reference is not null;

-- Webhook deduplication: a provider retrying the same event must not apply it
-- twice.
create table if not exists public.payment_webhook_events (
  id          uuid primary key default gen_random_uuid(),
  provider    text not null,
  event_id    text not null,
  payload     jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now(),
  unique (provider, event_id)
);

do $$
declare
  t text;
begin
  foreach t in array array['coupons', 'orders', 'payments'] loop
    execute format('drop trigger if exists %I_set_updated_at on public.%I', t, t);
    execute format(
      'create trigger %I_set_updated_at before update on public.%I
         for each row execute function public.set_updated_at()', t, t);
  end loop;
end
$$;

alter table public.service_requests
  drop constraint if exists service_requests_order_id_fkey;
alter table public.service_requests
  add constraint service_requests_order_id_fkey
  foreign key (order_id) references public.orders (id) on delete set null;

create sequence if not exists public.order_reference_seq;

create or replace function public.assign_order_reference()
returns trigger
language plpgsql
as $$
begin
  if new.reference is null or new.reference = '' then
    new.reference := to_char(now(), 'YYYY') || '-' ||
      lpad(nextval('public.order_reference_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists orders_assign_reference on public.orders;
create trigger orders_assign_reference
  before insert on public.orders
  for each row execute function public.assign_order_reference();
