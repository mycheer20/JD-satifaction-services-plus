-- 0013 — La livraison / préparation ne peut débuter qu'après paiement confirmé.

create or replace function public.guard_order_fulfillment_requires_payment()
returns trigger
language plpgsql
set search_path = public, pg_catalog
as $$
begin
  if TG_OP = 'UPDATE'
    and NEW.status is distinct from OLD.status
    and NEW.status in ('processing', 'shipped', 'delivered')
  then
    if not exists (
      select 1
      from public.payments p
      where p.order_id = NEW.id
        and p.status in ('paid', 'authorized')
    ) then
      raise exception
        'La livraison ne peut pas débuter tant que le paiement n''est pas confirmé.'
        using errcode = 'P0001';
    end if;
  end if;

  return NEW;
end;
$$;

drop trigger if exists orders_fulfillment_requires_payment on public.orders;

create trigger orders_fulfillment_requires_payment
  before update of status on public.orders
  for each row
  execute function public.guard_order_fulfillment_requires_payment();
