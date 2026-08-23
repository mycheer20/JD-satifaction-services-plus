-- 0010 — Storage buckets.
--
-- Binary assets never go into PostgreSQL. Product media lives in a public
-- bucket (the storefront needs plain URLs); customer brief attachments live in
-- a private bucket and are only reachable through a signed URL.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('product-images', 'product-images', true, 5242880,
   array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']),
  ('service-media', 'service-media', true, 5242880,
   array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']),
  ('brief-uploads', 'brief-uploads', false, 20971520,
   array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
         'application/pdf', 'application/zip',
         'application/msword',
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
         'application/postscript'])
on conflict (id) do update
set public             = excluded.public,
    file_size_limit    = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- Policies
-- ---------------------------------------------------------------------------

drop policy if exists "product images are public" on storage.objects;
create policy "product images are public"
  on storage.objects for select
  using (bucket_id in ('product-images', 'service-media'));

drop policy if exists "staff manage product images" on storage.objects;
create policy "staff manage product images"
  on storage.objects for all
  using (bucket_id in ('product-images', 'service-media') and public.is_staff())
  with check (bucket_id in ('product-images', 'service-media') and public.is_staff());

-- Brief attachments are written into a per-request folder. A signed-in customer
-- may upload into their own folder; only staff can read across folders.
drop policy if exists "customers upload briefs" on storage.objects;
create policy "customers upload briefs"
  on storage.objects for insert
  with check (bucket_id = 'brief-uploads' and auth.uid() is not null);

drop policy if exists "owners read own briefs" on storage.objects;
create policy "owners read own briefs"
  on storage.objects for select
  using (
    bucket_id = 'brief-uploads'
    and (owner = auth.uid() or public.is_staff())
  );

drop policy if exists "staff manage briefs" on storage.objects;
create policy "staff manage briefs"
  on storage.objects for all
  using (bucket_id = 'brief-uploads' and public.is_staff())
  with check (bucket_id = 'brief-uploads' and public.is_staff());
