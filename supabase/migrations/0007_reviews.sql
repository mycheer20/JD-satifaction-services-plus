-- 0007 — Product reviews and the denormalised rating kept on products.

create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  order_id   uuid references public.orders (id) on delete set null,
  rating     smallint not null check (rating between 1 and 5),
  title      text,
  body       text,
  status     public.review_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, user_id)
);

create index if not exists reviews_product_idx
  on public.reviews (product_id, status, created_at desc);
create index if not exists reviews_status_idx on public.reviews (status, created_at desc);

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

-- Moderation state belongs to staff. The RLS policy lets an author edit their
-- own review, so this trigger is what stops that edit from also approving it.
create or replace function public.guard_review_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or public.is_staff() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.status := 'pending';
  elsif new.status is distinct from old.status then
    raise exception 'Modification du statut de l''avis non autorisée';
  end if;

  return new;
end;
$$;

drop trigger if exists reviews_guard_status on public.reviews;
create trigger reviews_guard_status
  before insert or update on public.reviews
  for each row execute function public.guard_review_status();

-- products.rating_average / rating_count are a cache of the approved reviews.
-- Recomputing on write keeps listing pages from aggregating on every read.
create or replace function public.refresh_product_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target uuid := coalesce(new.product_id, old.product_id);
begin
  update public.products p
  set rating_average = coalesce(agg.avg_rating, 0),
      rating_count   = coalesce(agg.total, 0)
  from (
    select avg(rating)::numeric(3, 2) as avg_rating, count(*) as total
    from public.reviews
    where product_id = target and status = 'approved'
  ) agg
  where p.id = target;

  return null;
end;
$$;

drop trigger if exists reviews_refresh_rating on public.reviews;
create trigger reviews_refresh_rating
  after insert or update or delete on public.reviews
  for each row execute function public.refresh_product_rating();
