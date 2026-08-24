-- 0017a — Rôle designer (transaction séparée requise par PostgreSQL pour les enums).

do $$
begin
  alter type public.user_role add value if not exists 'designer';
exception
  when duplicate_object then null;
end $$;
