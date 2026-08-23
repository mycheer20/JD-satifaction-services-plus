-- Nettoyage des données de test en production.
-- Conserve : taxonomie, services, champs, marques, comptes utilisateurs, structure.
-- Supprime : commandes, paiements, notifications admin, produits et fichiers associés.

begin;

-- Notifications admin
delete from public.admin_notifications;

-- Événements webhook de test
delete from public.payment_webhook_events;

-- Commandes → supprime aussi order_items, payments, payment_proof_files (cascade)
delete from public.orders;

-- Demandes de design de test
delete from public.service_request_files;
delete from public.service_requests;

-- Avis produits
delete from public.reviews;

-- Produits et dépendances
delete from public.product_supply;
delete from public.product_attributes;
delete from public.product_variants;
delete from public.product_images;
delete from public.products;

commit;

-- Note : les fichiers Storage (product-images, payment-proofs) sont supprimés
-- par `npm run db:clean-test` via l'API Storage (SQL direct interdit).
