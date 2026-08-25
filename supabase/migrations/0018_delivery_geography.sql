-- 0018 — Géographie de livraison dynamique (pays → département → commune → ville → zone)

-- ---------------------------------------------------------------------------
-- Hiérarchie géographique
-- ---------------------------------------------------------------------------

create table if not exists public.delivery_countries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint delivery_countries_name_key unique (name)
);

create table if not exists public.delivery_departments (
  id         uuid primary key default gen_random_uuid(),
  country_id uuid not null references public.delivery_countries (id) on delete restrict,
  name       text not null,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint delivery_departments_country_name_key unique (country_id, name)
);

create index if not exists delivery_departments_country_active_idx
  on public.delivery_departments (country_id, is_active);

create table if not exists public.delivery_communes (
  id            uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.delivery_departments (id) on delete restrict,
  name          text not null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint delivery_communes_department_name_key unique (department_id, name)
);

create index if not exists delivery_communes_department_active_idx
  on public.delivery_communes (department_id, is_active);

create table if not exists public.delivery_cities (
  id         uuid primary key default gen_random_uuid(),
  commune_id uuid not null references public.delivery_communes (id) on delete restrict,
  name       text not null,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint delivery_cities_commune_name_key unique (commune_id, name)
);

create index if not exists delivery_cities_commune_active_idx
  on public.delivery_cities (commune_id, is_active);

create table if not exists public.delivery_zones (
  id           uuid primary key default gen_random_uuid(),
  city_id      uuid not null references public.delivery_cities (id) on delete restrict,
  name         text not null,
  delivery_fee numeric(12, 2) not null default 0 check (delivery_fee >= 0),
  currency     text not null default 'HTG',
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint delivery_zones_city_name_key unique (city_id, name)
);

create index if not exists delivery_zones_city_active_idx
  on public.delivery_zones (city_id, is_active);
create index if not exists delivery_zones_active_idx
  on public.delivery_zones (is_active);

-- ---------------------------------------------------------------------------
-- Commandes — mode livraison + référence zone (snapshot tarif dans shipping_total)
-- ---------------------------------------------------------------------------

alter table public.orders
  add column if not exists fulfillment_mode text not null default 'delivery'
    check (fulfillment_mode in ('delivery', 'pickup'));

alter table public.orders
  add column if not exists delivery_zone_id uuid
    references public.delivery_zones (id) on delete set null;

create index if not exists orders_delivery_zone_idx
  on public.orders (delivery_zone_id);

-- ---------------------------------------------------------------------------
-- place_order — enregistre fulfillment_mode et delivery_zone_id
-- ---------------------------------------------------------------------------

create or replace function public.place_order(
  p_user_id        uuid,
  p_customer       jsonb,
  p_items          jsonb,
  p_coupon_code    text default null,
  p_shipping_total numeric default 0
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id      uuid;
  v_reference     text;
  v_item          jsonb;
  v_product       public.products%rowtype;
  v_variant       public.product_variants%rowtype;
  v_service       public.services%rowtype;
  v_quantity      integer;
  v_unit_price    numeric(12, 2);
  v_available     integer;
  v_image_url     text;
  v_subtotal      numeric(12, 2) := 0;
  v_discount      numeric(12, 2) := 0;
  v_shipping      numeric(12, 2) := greatest(coalesce(p_shipping_total, 0), 0);
  v_coupon        public.coupons%rowtype;
  v_currency      text := 'HTG';
  v_fulfillment   text;
  v_zone_id       uuid;
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Le panier est vide' using errcode = 'P0001';
  end if;

  v_fulfillment := coalesce(nullif(p_customer ->> 'fulfillment_mode', ''), 'delivery');
  if v_fulfillment not in ('delivery', 'pickup') then
    raise exception 'Mode de livraison invalide' using errcode = 'P0001';
  end if;

  v_zone_id := nullif(p_customer ->> 'delivery_zone_id', '')::uuid;

  insert into public.orders (
    user_id, customer_name, customer_email, customer_phone,
    shipping_address, billing_address, customer_note, status,
    fulfillment_mode, delivery_zone_id
  )
  values (
    p_user_id,
    coalesce(nullif(p_customer ->> 'name', ''), 'Client'),
    lower(trim(p_customer ->> 'email')),
    nullif(p_customer ->> 'phone', ''),
    coalesce(p_customer -> 'shipping_address', '{}'::jsonb),
    coalesce(p_customer -> 'billing_address', p_customer -> 'shipping_address', '{}'::jsonb),
    nullif(p_customer ->> 'note', ''),
    'pending',
    v_fulfillment,
    v_zone_id
  )
  returning id, reference into v_order_id, v_reference;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_quantity := greatest(coalesce((v_item ->> 'quantity')::integer, 1), 1);

    if (v_item ->> 'service_id') is not null then
      select * into v_service
      from public.services
      where id = (v_item ->> 'service_id')::uuid and is_active;

      if not found then
        raise exception 'Service indisponible' using errcode = 'P0002';
      end if;

      v_unit_price := coalesce(v_service.base_price, 0);
      v_currency := v_service.currency;

      insert into public.order_items (
        order_id, item_kind, service_id, service_request_id,
        name, unit_price, quantity, line_total
      )
      values (
        v_order_id, 'service', v_service.id,
        nullif(v_item ->> 'service_request_id', '')::uuid,
        v_service.name, v_unit_price, v_quantity, v_unit_price * v_quantity
      );

      v_subtotal := v_subtotal + v_unit_price * v_quantity;
      continue;
    end if;

    select * into v_product
    from public.products
    where id = (v_item ->> 'product_id')::uuid
    for update;

    if not found or v_product.status <> 'active' then
      raise exception 'Produit indisponible' using errcode = 'P0002';
    end if;

    v_currency := v_product.currency;

    select url into v_image_url
    from public.product_images
    where product_id = v_product.id
    order by is_primary desc, position asc
    limit 1;

    if nullif(v_item ->> 'variant_id', '') is not null then
      select * into v_variant
      from public.product_variants
      where id = (v_item ->> 'variant_id')::uuid
        and product_id = v_product.id
        and is_active
      for update;

      if not found then
        raise exception 'Variante indisponible' using errcode = 'P0002';
      end if;

      v_unit_price := coalesce(v_variant.sale_price, v_variant.price, v_product.sale_price, v_product.price);
      v_available := v_variant.stock;

      if v_product.track_inventory and v_available < v_quantity then
        raise exception 'Stock insuffisant pour %', v_product.name using errcode = 'P0003';
      end if;

      if v_product.track_inventory then
        update public.product_variants set stock = stock - v_quantity where id = v_variant.id;
      end if;

      insert into public.order_items (
        order_id, item_kind, product_id, variant_id,
        name, sku, image_url, options, unit_price, quantity, line_total
      )
      values (
        v_order_id, v_product.kind, v_product.id, v_variant.id,
        v_product.name || ' — ' || v_variant.label,
        coalesce(v_variant.sku, v_product.sku), v_image_url,
        jsonb_build_object('variant', v_variant.label),
        v_unit_price, v_quantity, v_unit_price * v_quantity
      );
    else
      v_unit_price := coalesce(v_product.sale_price, v_product.price);
      v_available := v_product.stock;

      if v_product.track_inventory and v_available < v_quantity then
        raise exception 'Stock insuffisant pour %', v_product.name using errcode = 'P0003';
      end if;

      if v_product.track_inventory then
        update public.products set stock = stock - v_quantity where id = v_product.id;
      end if;

      insert into public.order_items (
        order_id, item_kind, product_id,
        name, sku, image_url, unit_price, quantity, line_total
      )
      values (
        v_order_id, v_product.kind, v_product.id,
        v_product.name, v_product.sku, v_image_url,
        v_unit_price, v_quantity, v_unit_price * v_quantity
      );
    end if;

    v_subtotal := v_subtotal + v_unit_price * v_quantity;
  end loop;

  if nullif(trim(coalesce(p_coupon_code, '')), '') is not null then
    select * into v_coupon
    from public.coupons
    where upper(code) = upper(trim(p_coupon_code))
      and is_active
      and (starts_at is null or starts_at <= now())
      and (ends_at is null or ends_at >= now())
      and (usage_limit is null or usage_count < usage_limit)
    for update;

    if found and (v_coupon.min_order_amount is null or v_subtotal >= v_coupon.min_order_amount) then
      if v_coupon.discount_type = 'percentage' then
        v_discount := round(v_subtotal * v_coupon.discount_value / 100, 2);
      else
        v_discount := v_coupon.discount_value;
      end if;

      if v_coupon.max_discount_amount is not null then
        v_discount := least(v_discount, v_coupon.max_discount_amount);
      end if;
      v_discount := least(v_discount, v_subtotal);

      update public.coupons set usage_count = usage_count + 1 where id = v_coupon.id;

      update public.orders
      set coupon_id = v_coupon.id, coupon_code = v_coupon.code
      where id = v_order_id;
    else
      v_discount := 0;
    end if;
  end if;

  update public.orders
  set subtotal       = v_subtotal,
      discount_total = v_discount,
      shipping_total = v_shipping,
      total          = greatest(v_subtotal - v_discount + v_shipping, 0),
      currency       = v_currency
  where id = v_order_id;

  return jsonb_build_object(
    'order_id',  v_order_id,
    'reference', v_reference,
    'subtotal',  v_subtotal,
    'discount',  v_discount,
    'shipping',  v_shipping,
    'total',     greatest(v_subtotal - v_discount + v_shipping, 0),
    'currency',  v_currency
  );
end;
$$;

revoke all on function public.place_order(uuid, jsonb, jsonb, text, numeric) from public;
grant execute on function public.place_order(uuid, jsonb, jsonb, text, numeric) to service_role;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.delivery_countries enable row level security;
alter table public.delivery_departments enable row level security;
alter table public.delivery_communes enable row level security;
alter table public.delivery_cities enable row level security;
alter table public.delivery_zones enable row level security;

drop policy if exists delivery_countries_read on public.delivery_countries;
create policy delivery_countries_read on public.delivery_countries for select
  using (is_active or public.is_staff());
drop policy if exists delivery_countries_write on public.delivery_countries;
create policy delivery_countries_write on public.delivery_countries for all
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists delivery_departments_read on public.delivery_departments;
create policy delivery_departments_read on public.delivery_departments for select
  using (is_active or public.is_staff());
drop policy if exists delivery_departments_write on public.delivery_departments;
create policy delivery_departments_write on public.delivery_departments for all
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists delivery_communes_read on public.delivery_communes;
create policy delivery_communes_read on public.delivery_communes for select
  using (is_active or public.is_staff());
drop policy if exists delivery_communes_write on public.delivery_communes;
create policy delivery_communes_write on public.delivery_communes for all
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists delivery_cities_read on public.delivery_cities;
create policy delivery_cities_read on public.delivery_cities for select
  using (is_active or public.is_staff());
drop policy if exists delivery_cities_write on public.delivery_cities;
create policy delivery_cities_write on public.delivery_cities for all
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists delivery_zones_read on public.delivery_zones;
create policy delivery_zones_read on public.delivery_zones for select
  using (is_active or public.is_staff());
drop policy if exists delivery_zones_write on public.delivery_zones;
create policy delivery_zones_write on public.delivery_zones for all
  using (public.is_staff()) with check (public.is_staff());
