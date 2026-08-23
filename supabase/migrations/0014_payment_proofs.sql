-- 0014 — Preuves de paiement MonCash / NatCash (txn ID + captures)

alter table public.payments
  add column if not exists customer_txn_id text,
  add column if not exists proof_submitted_at timestamptz;

create table if not exists public.payment_proof_files (
  id           uuid primary key default gen_random_uuid(),
  payment_id   uuid not null references public.payments (id) on delete cascade,
  storage_path text not null,
  file_name    text not null,
  mime_type    text,
  size_bytes   bigint,
  created_at   timestamptz not null default now()
);

create index if not exists payment_proof_files_payment_idx
  on public.payment_proof_files (payment_id);

alter table public.payment_proof_files enable row level security;

drop policy if exists payment_proof_files_read_own on public.payment_proof_files;
create policy payment_proof_files_read_own
  on public.payment_proof_files for select
  using (
    exists (
      select 1
      from public.payments p
      join public.orders o on o.id = p.order_id
      where p.id = payment_id
        and (o.user_id = auth.uid() or public.is_staff())
    )
  );

drop policy if exists payment_proof_files_manage on public.payment_proof_files;
create policy payment_proof_files_manage
  on public.payment_proof_files for all
  using (public.is_staff())
  with check (public.is_staff());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-proofs',
  'payment-proofs',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public             = excluded.public,
    file_size_limit    = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "staff manage payment proofs" on storage.objects;
create policy "staff manage payment proofs"
  on storage.objects for all
  using (bucket_id = 'payment-proofs' and public.is_staff())
  with check (bucket_id = 'payment-proofs' and public.is_staff());
