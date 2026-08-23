-- 0015 — Notifications admin (preuves de paiement, etc.)

create table if not exists public.admin_notifications (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null,
  title      text not null,
  message    text not null,
  link_href  text not null,
  payload    jsonb not null default '{}'::jsonb,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists admin_notifications_unread_idx
  on public.admin_notifications (created_at desc)
  where read_at is null;

create index if not exists admin_notifications_kind_idx
  on public.admin_notifications (kind, created_at desc);

alter table public.admin_notifications enable row level security;

drop policy if exists admin_notifications_read on public.admin_notifications;
create policy admin_notifications_read
  on public.admin_notifications for select
  using (public.is_staff());

drop policy if exists admin_notifications_update on public.admin_notifications;
create policy admin_notifications_update
  on public.admin_notifications for update
  using (public.is_staff())
  with check (public.is_staff());
