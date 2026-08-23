-- 0008 — Server-side routines for checkout and catalogue browsing.

-- ---------------------------------------------------------------------------
-- place_order
-- ---------------------------------------------------------------------------
-- The browser sends what the shopper wants to buy, never what it costs. Prices,
-- availability and the discount are all re-derived here, inside one
-- transaction, and stock is decremented under a row lock.
--
-- Execution is granted to service_role only: it is invoked from a Server Action
-- that has already resolved the session, and `p_user_id` is therefore trusted.

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
  v_currency      text := 'XOF';
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Le panier est vide' using errcode = 'P0001';
  end if;

  insert into public.orders (
    user_id, customer_name, customer_email, customer_phone,
    shipping_address, billing_address, customer_note, status
  )
  values (
    p_user_id,
    coalesce(nullif(p_customer ->> 'name', ''), 'Client'),
    lower(trim(p_customer ->> 'email')),
    nullif(p_customer ->> 'phone', ''),
    coalesce(p_customer -> 'shipping_address', '{}'::jsonb),
    coalesce(p_customer -> 'billing_address', p_customer -> 'shipping_address', '{}'::jsonb),
    nullif(p_customer ->> 'note', ''),
    'pending'
  )
  returning id, reference into v_order_id, v_reference;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_quantity := greatest(coalesce((v_item ->> 'quantity')::integer, 1), 1);

    -- ---- Service line -----------------------------------------------------
    if (v_item ->> 'service_id') is not null then
      select * into v_service
      from public.services
      where id = (v_item ->> 'service_id')::uuid and is_active;

      if not found then
        raise exception 'Service indisponible' using errcode = 'P0002';
      end if;

      -- A service without a fixed price is quoted after the brief; it enters
      -- the order at zero and is updated once the quote is accepted.
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

    -- ---- Product line -----------------------------------------------------
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

      v_unit_price := coalesce(
        v_variant.sale_price, v_variant.price,
        v_product.sale_price, v_product.price
      );
      v_available := v_variant.stock;

      if v_product.track_inventory and v_available < v_quantity then
        raise exception 'Stock insuffisant pour %', v_product.name using errcode = 'P0003';
      end if;

      if v_product.track_inventory then
        update public.product_variants
        set stock = stock - v_quantity
        where id = v_variant.id;
      end if;

      insert into public.order_items (
        order_id, item_kind, product_id, variant_id,
        name, sku, image_url, options, unit_price, quantity, line_total
      )
      values (
        v_order_id, v_product.kind, v_product.id, v_variant.id,
        v_product.name || ' — ' || v_variant.name,
        coalesce(v_variant.sku, v_product.sku), v_image_url, v_variant.options,
        v_unit_price, v_quantity, v_unit_price * v_quantity
      );
    else
      v_unit_price := coalesce(v_product.sale_price, v_product.price);
      v_available := v_product.stock;

      if v_product.track_inventory and v_available < v_quantity then
        raise exception 'Stock insuffisant pour %', v_product.name using errcode = 'P0003';
      end if;

      if v_product.track_inventory then
        update public.products
        set stock = stock - v_quantity
        where id = v_product.id;
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

  -- ---- Coupon -------------------------------------------------------------
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
-- restock_order
-- ---------------------------------------------------------------------------
-- Returns the reserved units to stock when an order is cancelled.

create or replace function public.restock_order(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.product_variants v
  set stock = v.stock + i.quantity
  from public.order_items i
  where i.order_id = p_order_id
    and i.variant_id = v.id;

  update public.products p
  set stock = p.stock + i.quantity
  from public.order_items i
  where i.order_id = p_order_id
    and i.product_id = p.id
    and i.variant_id is null
    and p.track_inventory;
end;
$$;

revoke all on function public.restock_order(uuid) from public;
grant execute on function public.restock_order(uuid) to service_role;

-- ---------------------------------------------------------------------------
-- search_product_ids
-- ---------------------------------------------------------------------------
-- Returns the ordered ids of the products matching a scope plus a set of
-- facets, together with the total match count. Attribute facets require a
-- correlated EXISTS per selected value, which is why this is a function rather
-- than a stack of PostgREST filters.
--
-- p_attributes shape: { "processeur": ["Intel Core i5"], "ram": ["16 Go"] }

create or replace function public.search_product_ids(
  p_query        text default null,
  p_family       text default null,
  p_category     text default null,
  p_subcategory  text default null,
  p_brand_slugs  text[] default null,
  p_min_price    numeric default null,
  p_max_price    numeric default null,
  p_in_stock     boolean default null,
  p_min_rating   numeric default null,
  p_featured     boolean default null,
  p_attributes   jsonb default '{}'::jsonb,
  p_sort         text default 'relevance',
  p_limit        integer default 24,
  p_offset       integer default 0
)
returns table (id uuid, total_count bigint)
language sql
stable
set search_path = public, extensions, pg_catalog
as $$
  with scoped as (
    select p.*,
           case
             when nullif(trim(coalesce(p_query, '')), '') is null then 0
             else ts_rank(p.search_document, plainto_tsquery('simple', p_query))
           end as rank
    from public.products p
    join public.subcategories s on s.id = p.subcategory_id
    join public.categories c on c.id = s.category_id
    join public.families f on f.id = c.family_id
    left join public.brands b on b.id = p.brand_id
    where p.status = 'active'
      and s.is_active and c.is_active and f.is_active
      and (p_family is null or f.slug = p_family)
      and (p_category is null or c.slug = p_category)
      and (p_subcategory is null or s.slug = p_subcategory)
      and (p_brand_slugs is null or array_length(p_brand_slugs, 1) is null or b.slug = any (p_brand_slugs))
      and (p_min_price is null or coalesce(p.sale_price, p.price) >= p_min_price)
      and (p_max_price is null or coalesce(p.sale_price, p.price) <= p_max_price)
      and (p_in_stock is not true or p.track_inventory = false or p.stock > 0)
      and (p_min_rating is null or p.rating_average >= p_min_rating)
      and (p_featured is null or p.is_featured = p_featured)
      and (
        nullif(trim(coalesce(p_query, '')), '') is null
        or p.search_document @@ plainto_tsquery('simple', p_query)
        or public.normalize_text(p.name) like '%' || public.normalize_text(p_query) || '%'
        or public.normalize_text(coalesce(b.name, '')) like '%' || public.normalize_text(p_query) || '%'
      )
      and (
        p_attributes is null
        or p_attributes = '{}'::jsonb
        or not exists (
          select 1
          from jsonb_each(p_attributes) as filt(field_key, wanted)
          where not exists (
            select 1
            from public.product_attributes pa
            where pa.product_id = p.id
              and pa.field_key = filt.field_key
              and pa.value_text = any (
                select jsonb_array_elements_text(filt.wanted)
              )
          )
        )
      )
  ),
  counted as (select count(*) as total from scoped)
  select scoped.id, counted.total
  from scoped, counted
  order by
    case when p_sort = 'price_asc'  then coalesce(scoped.sale_price, scoped.price) end asc,
    case when p_sort = 'price_desc' then coalesce(scoped.sale_price, scoped.price) end desc,
    case when p_sort = 'rating'     then scoped.rating_average end desc,
    case when p_sort = 'newest'     then scoped.published_at end desc,
    case when p_sort = 'name'       then scoped.name end asc,
    scoped.rank desc,
    scoped.is_featured desc,
    scoped.published_at desc nulls last
  limit greatest(coalesce(p_limit, 24), 1)
  offset greatest(coalesce(p_offset, 0), 0);
$$;

grant execute on function public.search_product_ids(
  text, text, text, text, text[], numeric, numeric, boolean,
  numeric, boolean, jsonb, text, integer, integer
) to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- catalog_facets
-- ---------------------------------------------------------------------------
-- The filters offered on a listing page are derived from the products actually
-- in scope, so a subcategory only ever shows facets that mean something there.

create or replace function public.catalog_facets(
  p_family      text default null,
  p_category    text default null,
  p_subcategory text default null,
  p_query       text default null
)
returns jsonb
language sql
stable
set search_path = public, extensions, pg_catalog
as $$
  with scoped as (
    select p.id, p.brand_id, p.price, p.sale_price, p.subcategory_id
    from public.products p
    join public.subcategories s on s.id = p.subcategory_id
    join public.categories c on c.id = s.category_id
    join public.families f on f.id = c.family_id
    left join public.brands b on b.id = p.brand_id
    where p.status = 'active'
      and (p_family is null or f.slug = p_family)
      and (p_category is null or c.slug = p_category)
      and (p_subcategory is null or s.slug = p_subcategory)
      and (
        nullif(trim(coalesce(p_query, '')), '') is null
        or p.search_document @@ plainto_tsquery('simple', p_query)
        or public.normalize_text(p.name) like '%' || public.normalize_text(p_query) || '%'
        or public.normalize_text(coalesce(b.name, '')) like '%' || public.normalize_text(p_query) || '%'
      )
  )
  select jsonb_build_object(
    'total', (select count(*) from scoped),
    'price', (
      select jsonb_build_object(
        'min', coalesce(min(coalesce(sale_price, price)), 0),
        'max', coalesce(max(coalesce(sale_price, price)), 0)
      ) from scoped
    ),
    'brands', coalesce((
      select jsonb_agg(x order by x ->> 'name')
      from (
        select jsonb_build_object('slug', b.slug, 'name', b.name, 'count', count(*)) as x
        from scoped sc
        join public.brands b on b.id = sc.brand_id
        group by b.slug, b.name
      ) t
    ), '[]'::jsonb),
    'attributes', coalesce((
      select jsonb_agg(x order by x ->> 'position')
      from (
        select jsonb_build_object(
                 'key', vals.field_key,
                 'label', def.label,
                 'position', lpad(def.position::text, 4, '0'),
                 'values', jsonb_agg(
                   jsonb_build_object('value', vals.value_text, 'count', vals.n)
                   order by vals.value_text
                 )
               ) as x
        from (
          select pa.field_key, pa.value_text, count(*) as n
          from public.product_attributes pa
          join scoped sc on sc.id = pa.product_id
          where pa.value_text is not null and pa.value_text <> ''
          group by pa.field_key, pa.value_text
        ) vals
        -- Resolve the label from any field set reachable in the current scope;
        -- a key means the same thing wherever it is reused.
        join lateral (
          select fd.label, fd.position
          from public.field_definitions fd
          where fd.key = vals.field_key
            and fd.is_filterable
            and fd.field_set_id in (
              select distinct s2.field_set_id
              from scoped sc2
              join public.subcategories s2 on s2.id = sc2.subcategory_id
              where s2.field_set_id is not null
            )
          limit 1
        ) def on true
        group by vals.field_key, def.label, def.position
      ) t
    ), '[]'::jsonb)
  );
$$;

grant execute on function public.catalog_facets(text, text, text, text)
  to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- global_search
-- ---------------------------------------------------------------------------
-- Powers the header search box: products, brands, categories and subcategories
-- in a single call.

create or replace function public.global_search(p_query text, p_limit integer default 5)
returns jsonb
language sql
stable
set search_path = public, extensions, pg_catalog
as $$
  select jsonb_build_object(
    'products', coalesce((
      select jsonb_agg(jsonb_build_object(
        'slug', p.slug, 'name', p.name,
        'price', coalesce(p.sale_price, p.price),
        'image', (select url from public.product_images
                  where product_id = p.id
                  order by is_primary desc, position asc limit 1)
      ))
      from (
        select * from public.products
        where status = 'active'
          and public.normalize_text(name) like '%' || public.normalize_text(p_query) || '%'
        order by is_featured desc, rating_average desc
        limit p_limit
      ) p
    ), '[]'::jsonb),
    'brands', coalesce((
      select jsonb_agg(jsonb_build_object('slug', slug, 'name', name))
      from (
        select slug, name from public.brands
        where public.normalize_text(name) like '%' || public.normalize_text(p_query) || '%'
        order by name limit p_limit
      ) b
    ), '[]'::jsonb),
    'categories', coalesce((
      select jsonb_agg(jsonb_build_object('slug', slug, 'name', name))
      from (
        select slug, name from public.categories
        where is_active
          and public.normalize_text(name) like '%' || public.normalize_text(p_query) || '%'
        order by name limit p_limit
      ) c
    ), '[]'::jsonb),
    'subcategories', coalesce((
      select jsonb_agg(jsonb_build_object('slug', slug, 'name', name))
      from (
        select slug, name from public.subcategories
        where is_active
          and public.normalize_text(name) like '%' || public.normalize_text(p_query) || '%'
        order by name limit p_limit
      ) s
    ), '[]'::jsonb)
  );
$$;

grant execute on function public.global_search(text, integer)
  to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- admin_dashboard_metrics
-- ---------------------------------------------------------------------------
-- Grouped into one call so the dashboard is a single round trip. Restricted to
-- service_role; the admin pages reach it through a guarded Server Component.

create or replace function public.admin_dashboard_metrics()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'revenue_total', coalesce((
      select sum(total) from public.orders
      where status not in ('cancelled', 'refunded')), 0),
    'revenue_30d', coalesce((
      select sum(total) from public.orders
      where status not in ('cancelled', 'refunded')
        and created_at >= now() - interval '30 days'), 0),
    'orders_total', (select count(*) from public.orders),
    'orders_pending', (select count(*) from public.orders where status = 'pending'),
    'products_total', (select count(*) from public.products),
    'products_active', (select count(*) from public.products where status = 'active'),
    'products_low_stock', (
      select count(*) from public.products
      where track_inventory and stock > 0 and stock <= low_stock_threshold),
    'products_out_of_stock', (
      select count(*) from public.products where track_inventory and stock = 0),
    'customers_total', (
      select count(*) from public.user_profiles where role = 'customer'),
    'service_requests_pending', (
      select count(*) from public.service_requests
      where status in ('submitted', 'in_review', 'quoted')),
    'reviews_pending', (
      select count(*) from public.reviews where status = 'pending')
  );
$$;

revoke all on function public.admin_dashboard_metrics() from public;
grant execute on function public.admin_dashboard_metrics() to service_role;
