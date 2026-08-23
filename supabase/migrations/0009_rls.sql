-- 0009 — Row level security.
--
-- Every table is protected. The default posture is: the public can read the
-- published catalogue and nothing else; a customer can read and write only
-- their own rows; admins and staff manage the rest.
--
-- The service-role key bypasses these policies, which is precisely why it is
-- only ever used behind an explicit `requireAdmin()` / `requireUser()` check.

do $$
declare
  t text;
begin
  foreach t in array array[
    'user_profiles', 'field_sets', 'families', 'categories', 'subcategories',
    'field_definitions', 'brands', 'products', 'product_images',
    'product_variants', 'product_attributes', 'suppliers', 'product_supply',
    'services', 'service_forms', 'service_form_fields', 'service_requests',
    'service_request_files', 'coupons', 'orders', 'order_items', 'payments',
    'payment_webhook_events', 'reviews'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    -- Note: RLS is deliberately not FORCEd. The SECURITY DEFINER routines in
    -- 0008_functions.sql run as the table owner and must be able to write rows
    -- that no policy grants to an end user (order lines, rating caches).
  end loop;
end
$$;

-- Helper to keep this file readable: drops a policy if it exists, then creates it.
create or replace function public.__recreate_policy(
  p_table text, p_name text, p_command text, p_using text, p_check text
)
returns void
language plpgsql
as $$
begin
  execute format('drop policy if exists %I on public.%I', p_name, p_table);
  execute format(
    'create policy %I on public.%I for %s %s %s',
    p_name, p_table, p_command,
    case when p_using is null then '' else 'using (' || p_using || ')' end,
    case when p_check is null then '' else 'with check (' || p_check || ')' end
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------

select public.__recreate_policy('user_profiles', 'profiles_select_self_or_staff', 'select',
  'id = auth.uid() or public.is_staff()', null);
select public.__recreate_policy('user_profiles', 'profiles_update_self_or_admin', 'update',
  'id = auth.uid() or public.is_admin()',
  'id = auth.uid() or public.is_admin()');
select public.__recreate_policy('user_profiles', 'profiles_insert_self', 'insert',
  null, 'id = auth.uid()');
select public.__recreate_policy('user_profiles', 'profiles_delete_admin', 'delete',
  'public.is_admin()', null);

-- ---------------------------------------------------------------------------
-- Taxonomy and field definitions — world readable, admin writable
-- ---------------------------------------------------------------------------

select public.__recreate_policy('families', 'families_read', 'select',
  'is_active or public.is_staff()', null);
select public.__recreate_policy('families', 'families_write', 'all',
  'public.is_admin()', 'public.is_admin()');

select public.__recreate_policy('categories', 'categories_read', 'select',
  'is_active or public.is_staff()', null);
select public.__recreate_policy('categories', 'categories_write', 'all',
  'public.is_admin()', 'public.is_admin()');

select public.__recreate_policy('subcategories', 'subcategories_read', 'select',
  'is_active or public.is_staff()', null);
select public.__recreate_policy('subcategories', 'subcategories_write', 'all',
  'public.is_admin()', 'public.is_admin()');

select public.__recreate_policy('field_sets', 'field_sets_read', 'select', 'true', null);
select public.__recreate_policy('field_sets', 'field_sets_write', 'all',
  'public.is_admin()', 'public.is_admin()');

select public.__recreate_policy('field_definitions', 'field_definitions_read', 'select', 'true', null);
select public.__recreate_policy('field_definitions', 'field_definitions_write', 'all',
  'public.is_admin()', 'public.is_admin()');

select public.__recreate_policy('brands', 'brands_read', 'select', 'true', null);
select public.__recreate_policy('brands', 'brands_write', 'all',
  'public.is_staff()', 'public.is_staff()');

-- ---------------------------------------------------------------------------
-- Catalogue — only published products are visible to the public
-- ---------------------------------------------------------------------------

select public.__recreate_policy('products', 'products_read_published', 'select',
  $q$status = 'active' or public.is_staff()$q$, null);
select public.__recreate_policy('products', 'products_write', 'all',
  'public.is_staff()', 'public.is_staff()');

select public.__recreate_policy('product_images', 'product_images_read', 'select',
  $q$exists (
      select 1 from public.products p
      where p.id = product_id and (p.status = 'active' or public.is_staff())
    )$q$, null);
select public.__recreate_policy('product_images', 'product_images_write', 'all',
  'public.is_staff()', 'public.is_staff()');

select public.__recreate_policy('product_variants', 'product_variants_read', 'select',
  $q$is_active and exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'active'
    ) or public.is_staff()$q$, null);
select public.__recreate_policy('product_variants', 'product_variants_write', 'all',
  'public.is_staff()', 'public.is_staff()');

select public.__recreate_policy('product_attributes', 'product_attributes_read', 'select',
  $q$exists (
      select 1 from public.products p
      where p.id = product_id and (p.status = 'active' or public.is_staff())
    )$q$, null);
select public.__recreate_policy('product_attributes', 'product_attributes_write', 'all',
  'public.is_staff()', 'public.is_staff()');

-- ---------------------------------------------------------------------------
-- Supply — internal only
-- ---------------------------------------------------------------------------
-- No SELECT policy exists for anon or authenticated. Even a crafted PostgREST
-- request cannot read a supplier, a cost price or a sourcing flag.

select public.__recreate_policy('suppliers', 'suppliers_admin_only', 'all',
  'public.is_admin()', 'public.is_admin()');
select public.__recreate_policy('product_supply', 'product_supply_admin_only', 'all',
  'public.is_admin()', 'public.is_admin()');

-- ---------------------------------------------------------------------------
-- Services
-- ---------------------------------------------------------------------------

select public.__recreate_policy('services', 'services_read', 'select',
  'is_active or public.is_staff()', null);
select public.__recreate_policy('services', 'services_write', 'all',
  'public.is_admin()', 'public.is_admin()');

select public.__recreate_policy('service_forms', 'service_forms_read', 'select',
  'is_active or public.is_staff()', null);
select public.__recreate_policy('service_forms', 'service_forms_write', 'all',
  'public.is_admin()', 'public.is_admin()');

select public.__recreate_policy('service_form_fields', 'service_form_fields_read', 'select',
  $q$exists (
      select 1 from public.service_forms f
      where f.id = form_id and (f.is_active or public.is_staff())
    )$q$, null);
select public.__recreate_policy('service_form_fields', 'service_form_fields_write', 'all',
  'public.is_admin()', 'public.is_admin()');

select public.__recreate_policy('service_requests', 'service_requests_read_own', 'select',
  'user_id = auth.uid() or public.is_staff()', null);
select public.__recreate_policy('service_requests', 'service_requests_insert', 'insert',
  null, 'user_id is null or user_id = auth.uid()');
select public.__recreate_policy('service_requests', 'service_requests_manage', 'update',
  'public.is_staff()', 'public.is_staff()');
select public.__recreate_policy('service_requests', 'service_requests_delete', 'delete',
  'public.is_admin()', null);

select public.__recreate_policy('service_request_files', 'service_request_files_read', 'select',
  $q$exists (
      select 1 from public.service_requests r
      where r.id = request_id and (r.user_id = auth.uid() or public.is_staff())
    )$q$, null);
select public.__recreate_policy('service_request_files', 'service_request_files_insert', 'insert',
  null,
  $q$exists (
      select 1 from public.service_requests r
      where r.id = request_id and (r.user_id is null or r.user_id = auth.uid())
    ) or public.is_staff()$q$);
select public.__recreate_policy('service_request_files', 'service_request_files_delete', 'delete',
  'public.is_staff()', null);

-- ---------------------------------------------------------------------------
-- Orders — a customer sees their own orders and nothing else
-- ---------------------------------------------------------------------------
-- Orders are always created through place_order() under the service role, so no
-- INSERT policy is granted here: the browser cannot invent an order.

select public.__recreate_policy('orders', 'orders_read_own', 'select',
  'user_id = auth.uid() or public.is_staff()', null);
select public.__recreate_policy('orders', 'orders_manage', 'update',
  'public.is_staff()', 'public.is_staff()');
select public.__recreate_policy('orders', 'orders_delete', 'delete',
  'public.is_admin()', null);

select public.__recreate_policy('order_items', 'order_items_read_own', 'select',
  $q$exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or public.is_staff())
    )$q$, null);
select public.__recreate_policy('order_items', 'order_items_manage', 'all',
  'public.is_staff()', 'public.is_staff()');

select public.__recreate_policy('payments', 'payments_read_own', 'select',
  $q$exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or public.is_staff())
    )$q$, null);
select public.__recreate_policy('payments', 'payments_manage', 'all',
  'public.is_staff()', 'public.is_staff()');

-- Written exclusively by the webhook handler running under the service role.
select public.__recreate_policy('payment_webhook_events', 'payment_events_admin_only', 'all',
  'public.is_admin()', 'public.is_admin()');

-- ---------------------------------------------------------------------------
-- Coupons
-- ---------------------------------------------------------------------------
-- Codes are never listed publicly; validation happens server-side inside
-- place_order().

select public.__recreate_policy('coupons', 'coupons_staff_only', 'all',
  'public.is_staff()', 'public.is_staff()');

-- ---------------------------------------------------------------------------
-- Reviews
-- ---------------------------------------------------------------------------

select public.__recreate_policy('reviews', 'reviews_read_approved', 'select',
  $q$status = 'approved' or user_id = auth.uid() or public.is_staff()$q$, null);
select public.__recreate_policy('reviews', 'reviews_insert_own', 'insert',
  null, 'user_id = auth.uid()');
select public.__recreate_policy('reviews', 'reviews_update_own_or_staff', 'update',
  'user_id = auth.uid() or public.is_staff()',
  'user_id = auth.uid() or public.is_staff()');
select public.__recreate_policy('reviews', 'reviews_delete', 'delete',
  'user_id = auth.uid() or public.is_admin()', null);

drop function if exists public.__recreate_policy(text, text, text, text, text);
