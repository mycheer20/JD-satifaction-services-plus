-- =============================================================================
-- NETTOYAGE DONNÉES DE TEST — à exécuter dans Supabase → SQL Editor
-- =============================================================================
--
-- CONSERVE : comptes (auth.users, user_profiles), produits, catégories,
--            services, coupons, taxonomie.
--
-- SUPPRIME : commandes, paiements, notifications, demandes, avis, CMS design.
--
-- Les fichiers Storage (design-media, payment-proofs) ne sont PAS supprimés
-- par ce SQL — voir note en bas si besoin.
-- =============================================================================

-- 1) Aperçu AVANT (optionnel — commentez si vous voulez supprimer directement)
select 'AVANT' as moment, tbl, n
from (
  select 'orders' as tbl, count(*)::bigint as n from public.orders
  union all select 'payments', count(*) from public.payments
  union all select 'admin_notifications', count(*) from public.admin_notifications
  union all select 'service_requests', count(*) from public.service_requests
  union all select 'reviews', count(*) from public.reviews
  union all select 'design_media', count(*) from public.design_media
  union all select 'design_gallery_items', count(*) from public.design_gallery_items
  union all select 'design_section_configs', count(*) from public.design_section_configs
  union all select 'user_profiles', count(*) from public.user_profiles
  union all select 'products', count(*) from public.products
) s
order by tbl;

-- 2) Suppression
begin;

  delete from public.admin_notifications;
  delete from public.payment_webhook_events;

  -- cascade : order_items, payments, payment_proof_files
  delete from public.orders;

  delete from public.service_request_files;
  delete from public.service_requests;

  delete from public.reviews;

  -- Design CMS (slides supprimés en cascade avec section_configs)
  delete from public.design_gallery_items;
  delete from public.design_section_configs;
  delete from public.design_publications;
  delete from public.design_theme_tokens;
  delete from public.design_media;

commit;

-- 3) Vérification APRÈS
select 'APRÈS' as moment, tbl, n
from (
  select 'orders' as tbl, count(*)::bigint as n from public.orders
  union all select 'payments', count(*) from public.payments
  union all select 'admin_notifications', count(*) from public.admin_notifications
  union all select 'service_requests', count(*) from public.service_requests
  union all select 'reviews', count(*) from public.reviews
  union all select 'design_media', count(*) from public.design_media
  union all select 'user_profiles', count(*) from public.user_profiles
  union all select 'products', count(*) from public.products
) s
order by tbl;

-- =============================================================================
-- Fichiers Storage (optionnel, manuel) :
--   Dashboard Supabase → Storage → buckets « design-media » et « payment-proofs »
--   → sélectionner les fichiers → Delete
-- =============================================================================
