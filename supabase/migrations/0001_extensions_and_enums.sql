-- 0001 — Extensions, enumerated types and shared helpers.
-- Every migration in this project is written to be safely re-runnable.

create schema if not exists extensions;

create extension if not exists "pgcrypto" with schema extensions;
create extension if not exists "unaccent" with schema extensions;
create extension if not exists "pg_trgm" with schema extensions;

-- ---------------------------------------------------------------------------
-- Enumerated types
-- ---------------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('customer', 'staff', 'admin');
  end if;

  if not exists (select 1 from pg_type where typname = 'product_status') then
    create type public.product_status as enum ('draft', 'active', 'archived');
  end if;

  if not exists (select 1 from pg_type where typname = 'item_kind') then
    create type public.item_kind as enum ('physical_product', 'digital_product', 'service');
  end if;

  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type public.order_status as enum (
      'pending', 'confirmed', 'processing', 'shipped',
      'delivered', 'cancelled', 'refunded'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type public.payment_status as enum (
      'pending', 'authorized', 'paid', 'failed', 'refunded', 'cancelled'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'service_request_status') then
    create type public.service_request_status as enum (
      'submitted', 'in_review', 'quoted', 'in_progress',
      'delivered', 'completed', 'cancelled'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'field_type') then
    create type public.field_type as enum (
      'text', 'textarea', 'richtext', 'number', 'integer', 'boolean',
      'select', 'multiselect', 'date', 'email', 'url', 'color',
      'file', 'files'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'discount_type') then
    create type public.discount_type as enum ('percentage', 'fixed');
  end if;

  if not exists (select 1 from pg_type where typname = 'review_status') then
    create type public.review_status as enum ('pending', 'approved', 'rejected');
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------

-- Maintains `updated_at` without every table needing its own trigger function.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Accent- and case-insensitive text used by the search columns.
-- `unaccent` is only STABLE, so the explicit search_path plus the IMMUTABLE
-- marking is what makes this function usable inside an index expression.
create or replace function public.normalize_text(value text)
returns text
language sql
immutable
strict
set search_path = public, extensions, pg_catalog
as $$
  select lower(unaccent(value));
$$;
