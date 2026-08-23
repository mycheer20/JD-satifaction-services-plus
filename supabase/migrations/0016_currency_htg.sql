-- 0016 — Devise par défaut : gourdes haïtiennes (HTG)

alter table public.products alter column currency set default 'HTG';
alter table public.services alter column currency set default 'HTG';
alter table public.orders alter column currency set default 'HTG';
alter table public.payments alter column currency set default 'HTG';
alter table public.service_requests alter column currency set default 'HTG';
