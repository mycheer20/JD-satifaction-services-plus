-- 0011 — Closes the privilege hole left by the grants in 0008.
--
-- `revoke ... from public` only removes the PUBLIC pseudo-role grant. Supabase
-- additionally grants EXECUTE on every new function in `public` to `anon` and
-- `authenticated` through ALTER DEFAULT PRIVILEGES, and those grants survived.
-- The effect was that `/rest/v1/rpc/place_order` was reachable by an anonymous
-- caller, who could pass any `p_user_id` because the routine is SECURITY
-- DEFINER and trusts that argument.

-- ---------------------------------------------------------------------------
-- Privileged routines: server-side callers only
-- ---------------------------------------------------------------------------

revoke all on function public.place_order(uuid, jsonb, jsonb, text, numeric)
  from public, anon, authenticated;
grant execute on function public.place_order(uuid, jsonb, jsonb, text, numeric)
  to service_role;

revoke all on function public.restock_order(uuid) from public, anon, authenticated;
grant execute on function public.restock_order(uuid) to service_role;

revoke all on function public.admin_dashboard_metrics() from public, anon, authenticated;
grant execute on function public.admin_dashboard_metrics() to service_role;

-- ---------------------------------------------------------------------------
-- Trigger functions are not an API
-- ---------------------------------------------------------------------------
-- A trigger fires under the table owner regardless of these grants, so removing
-- EXECUTE only takes them off the PostgREST surface.

do $$
declare
  fn text;
begin
  foreach fn in array array[
    'public.set_updated_at()',
    'public.sync_product_published_at()',
    'public.assign_order_reference()',
    'public.assign_service_request_reference()',
    'public.handle_new_user()',
    'public.guard_role_change()',
    'public.guard_review_status()',
    'public.refresh_product_rating()'
  ] loop
    execute format('revoke all on function %s from public, anon, authenticated', fn);
  end loop;
end
$$;

-- ---------------------------------------------------------------------------
-- Pin search_path on the remaining functions
-- ---------------------------------------------------------------------------
-- Everything these bodies call lives in pg_catalog, which is always searched,
-- or is already schema-qualified. An empty search_path therefore changes no
-- behaviour while removing the resolution ambiguity the linter flags.

alter function public.set_updated_at() set search_path = '';
alter function public.sync_product_published_at() set search_path = '';
alter function public.assign_order_reference() set search_path = '';
alter function public.assign_service_request_reference() set search_path = '';
alter function public.tags_to_text(text[]) set search_path = '';

-- `is_admin()`, `is_staff()` and `current_role_name()` stay callable by anon and
-- authenticated on purpose: the RLS policies invoke them as the calling role,
-- and each one only ever reports on the caller's own account.
