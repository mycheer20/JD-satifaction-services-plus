-- Seed 002 — Families, categories and subcategories
-- GENERATED FILE — do not edit by hand.
-- Source: supabase/taxonomy/*.mjs   Regenerate with: npm run seed:generate


begin;

-- ======================= Informatique =======================
insert into public.families (slug, name, description, icon, position)
values ('informatique', 'Informatique', 'Ordinateurs, composants, périphériques et tout l''équipement informatique du quotidien.', 'laptop', 0)
on conflict (slug) do update
set name = excluded.name, description = excluded.description,
    icon = excluded.icon, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'ordinateurs', 'Ordinateurs', 0
from public.families f where f.slug = 'informatique'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'ordinateurs-portables', 'Ordinateurs portables', 0
from public.categories c
left join public.field_sets fs on fs.key = 'laptop'
where c.slug = 'ordinateurs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'ordinateurs-de-bureau', 'Ordinateurs de bureau', 10
from public.categories c
left join public.field_sets fs on fs.key = 'desktop_pc'
where c.slug = 'ordinateurs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'pc-gaming', 'PC gaming', 20
from public.categories c
left join public.field_sets fs on fs.key = 'desktop_pc'
where c.slug = 'ordinateurs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'mini-pc', 'Mini PC', 30
from public.categories c
left join public.field_sets fs on fs.key = 'mini_pc'
where c.slug = 'ordinateurs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'composants-informatiques', 'Composants informatiques', 10
from public.families f where f.slug = 'informatique'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'processeurs', 'Processeurs', 0
from public.categories c
left join public.field_sets fs on fs.key = 'cpu'
where c.slug = 'composants-informatiques'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'cartes-graphiques', 'Cartes graphiques', 10
from public.categories c
left join public.field_sets fs on fs.key = 'gpu'
where c.slug = 'composants-informatiques'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'cartes-meres', 'Cartes mères', 20
from public.categories c
left join public.field_sets fs on fs.key = 'motherboard'
where c.slug = 'composants-informatiques'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'memoire-ram', 'Mémoire RAM', 30
from public.categories c
left join public.field_sets fs on fs.key = 'ram'
where c.slug = 'composants-informatiques'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'stockage-interne', 'Stockage interne', 40
from public.categories c
left join public.field_sets fs on fs.key = 'storage_drive'
where c.slug = 'composants-informatiques'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'alimentations', 'Alimentations', 50
from public.categories c
left join public.field_sets fs on fs.key = 'psu'
where c.slug = 'composants-informatiques'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'boitiers', 'Boîtiers', 60
from public.categories c
left join public.field_sets fs on fs.key = 'pc_case'
where c.slug = 'composants-informatiques'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'refroidissement', 'Refroidissement', 70
from public.categories c
left join public.field_sets fs on fs.key = 'cooling'
where c.slug = 'composants-informatiques'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'peripheriques', 'Périphériques', 20
from public.families f where f.slug = 'informatique'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'claviers', 'Claviers', 0
from public.categories c
left join public.field_sets fs on fs.key = 'keyboard'
where c.slug = 'peripheriques'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'souris', 'Souris', 10
from public.categories c
left join public.field_sets fs on fs.key = 'mouse'
where c.slug = 'peripheriques'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'webcams', 'Webcams', 20
from public.categories c
left join public.field_sets fs on fs.key = 'webcam'
where c.slug = 'peripheriques'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'casques', 'Casques', 30
from public.categories c
left join public.field_sets fs on fs.key = 'headset'
where c.slug = 'peripheriques'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'haut-parleurs', 'Haut-parleurs', 40
from public.categories c
left join public.field_sets fs on fs.key = 'speaker'
where c.slug = 'peripheriques'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'microphones', 'Microphones', 50
from public.categories c
left join public.field_sets fs on fs.key = 'microphone'
where c.slug = 'peripheriques'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'stockage', 'Stockage', 30
from public.families f where f.slug = 'informatique'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'disques-durs', 'Disques durs', 0
from public.categories c
left join public.field_sets fs on fs.key = 'storage_drive'
where c.slug = 'stockage'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'ssd', 'SSD', 10
from public.categories c
left join public.field_sets fs on fs.key = 'storage_drive'
where c.slug = 'stockage'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'cles-usb', 'Clés USB', 20
from public.categories c
left join public.field_sets fs on fs.key = 'usb_flash'
where c.slug = 'stockage'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'cartes-memoire', 'Cartes mémoire', 30
from public.categories c
left join public.field_sets fs on fs.key = 'memory_card'
where c.slug = 'stockage'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'ecrans-affichage', 'Écrans & affichage', 40
from public.families f where f.slug = 'informatique'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'moniteurs', 'Moniteurs', 0
from public.categories c
left join public.field_sets fs on fs.key = 'monitor'
where c.slug = 'ecrans-affichage'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'projecteurs', 'Projecteurs', 10
from public.categories c
left join public.field_sets fs on fs.key = 'projector'
where c.slug = 'ecrans-affichage'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'accessoires-d-affichage', 'Accessoires d''affichage', 20
from public.categories c
left join public.field_sets fs on fs.key = 'computer_accessory'
where c.slug = 'ecrans-affichage'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'cables-connectique', 'Câbles & connectique', 50
from public.families f where f.slug = 'informatique'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'hdmi', 'HDMI', 0
from public.categories c
left join public.field_sets fs on fs.key = 'cable'
where c.slug = 'cables-connectique'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'usb', 'USB', 10
from public.categories c
left join public.field_sets fs on fs.key = 'cable'
where c.slug = 'cables-connectique'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'adaptateurs', 'Adaptateurs', 20
from public.categories c
left join public.field_sets fs on fs.key = 'cable'
where c.slug = 'cables-connectique'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'autres-cables', 'Autres câbles', 30
from public.categories c
left join public.field_sets fs on fs.key = 'cable'
where c.slug = 'cables-connectique'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'reseau', 'Réseau', 60
from public.families f where f.slug = 'informatique'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'routeurs', 'Routeurs', 0
from public.categories c
left join public.field_sets fs on fs.key = 'network_device'
where c.slug = 'reseau'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'switches', 'Switches', 10
from public.categories c
left join public.field_sets fs on fs.key = 'network_device'
where c.slug = 'reseau'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'adaptateurs-reseau', 'Adaptateurs réseau', 20
from public.categories c
left join public.field_sets fs on fs.key = 'network_device'
where c.slug = 'reseau'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'accessoires-reseau', 'Accessoires réseau', 30
from public.categories c
left join public.field_sets fs on fs.key = 'computer_accessory'
where c.slug = 'reseau'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'impression', 'Impression', 70
from public.families f where f.slug = 'informatique'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'imprimantes', 'Imprimantes', 0
from public.categories c
left join public.field_sets fs on fs.key = 'printer'
where c.slug = 'impression'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'cartouches', 'Cartouches', 10
from public.categories c
left join public.field_sets fs on fs.key = 'printer_consumable'
where c.slug = 'impression'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'toners', 'Toners', 20
from public.categories c
left join public.field_sets fs on fs.key = 'printer_consumable'
where c.slug = 'impression'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'tambours', 'Tambours', 30
from public.categories c
left join public.field_sets fs on fs.key = 'printer_consumable'
where c.slug = 'impression'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'accessoires-d-impression', 'Accessoires d''impression', 40
from public.categories c
left join public.field_sets fs on fs.key = 'computer_accessory'
where c.slug = 'impression'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'calculatrices', 'Calculatrices', 80
from public.families f where f.slug = 'informatique'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'calculatrices-standard', 'Calculatrices standard', 0
from public.categories c
left join public.field_sets fs on fs.key = 'calculator'
where c.slug = 'calculatrices'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'calculatrices-scientifiques', 'Calculatrices scientifiques', 10
from public.categories c
left join public.field_sets fs on fs.key = 'calculator'
where c.slug = 'calculatrices'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'calculatrices-professionnelles', 'Calculatrices professionnelles', 20
from public.categories c
left join public.field_sets fs on fs.key = 'calculator'
where c.slug = 'calculatrices'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'accessoires-informatiques', 'Accessoires informatiques', 90
from public.families f where f.slug = 'informatique'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'supports', 'Supports', 0
from public.categories c
left join public.field_sets fs on fs.key = 'computer_accessory'
where c.slug = 'accessoires-informatiques'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'hubs', 'Hubs', 10
from public.categories c
left join public.field_sets fs on fs.key = 'computer_accessory'
where c.slug = 'accessoires-informatiques'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'adaptateurs-accessoires-informatiques', 'Adaptateurs', 20
from public.categories c
left join public.field_sets fs on fs.key = 'computer_accessory'
where c.slug = 'accessoires-informatiques'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'divers', 'Divers', 30
from public.categories c
left join public.field_sets fs on fs.key = 'computer_accessory'
where c.slug = 'accessoires-informatiques'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

-- ======================= Fournitures scolaires =======================
insert into public.families (slug, name, description, icon, position)
values ('fournitures-scolaires', 'Fournitures scolaires', 'Tout le nécessaire pour la rentrée et l''année scolaire, de la maternelle au supérieur.', 'pencil', 10)
on conflict (slug) do update
set name = excluded.name, description = excluded.description,
    icon = excluded.icon, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'ecriture', 'Écriture', 0
from public.families f where f.slug = 'fournitures-scolaires'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'stylos', 'Stylos', 0
from public.categories c
left join public.field_sets fs on fs.key = 'writing_instrument'
where c.slug = 'ecriture'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'stylos-plume', 'Stylos plume', 10
from public.categories c
left join public.field_sets fs on fs.key = 'writing_instrument'
where c.slug = 'ecriture'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'crayons', 'Crayons', 20
from public.categories c
left join public.field_sets fs on fs.key = 'writing_instrument'
where c.slug = 'ecriture'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'marqueurs', 'Marqueurs', 30
from public.categories c
left join public.field_sets fs on fs.key = 'writing_instrument'
where c.slug = 'ecriture'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'feutres', 'Feutres', 40
from public.categories c
left join public.field_sets fs on fs.key = 'writing_instrument'
where c.slug = 'ecriture'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'craies', 'Craies', 50
from public.categories c
left join public.field_sets fs on fs.key = 'writing_instrument'
where c.slug = 'ecriture'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'cahiers-blocs', 'Cahiers & blocs', 10
from public.families f where f.slug = 'fournitures-scolaires'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'cahiers', 'Cahiers', 0
from public.categories c
left join public.field_sets fs on fs.key = 'notebook'
where c.slug = 'cahiers-blocs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'blocs-notes', 'Blocs-notes', 10
from public.categories c
left join public.field_sets fs on fs.key = 'notebook'
where c.slug = 'cahiers-blocs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'blocs-de-papier', 'Blocs de papier', 20
from public.categories c
left join public.field_sets fs on fs.key = 'notebook'
where c.slug = 'cahiers-blocs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'post-it', 'Post-it', 30
from public.categories c
left join public.field_sets fs on fs.key = 'notebook'
where c.slug = 'cahiers-blocs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'dessin-arts-creatifs', 'Dessin & arts créatifs', 20
from public.families f where f.slug = 'fournitures-scolaires'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'crayons-de-couleur', 'Crayons de couleur', 0
from public.categories c
left join public.field_sets fs on fs.key = 'art_supply'
where c.slug = 'dessin-arts-creatifs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'crayons-de-cire', 'Crayons de cire', 10
from public.categories c
left join public.field_sets fs on fs.key = 'art_supply'
where c.slug = 'dessin-arts-creatifs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'papier-de-construction', 'Papier de construction', 20
from public.categories c
left join public.field_sets fs on fs.key = 'art_supply'
where c.slug = 'dessin-arts-creatifs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'materiel-de-dessin', 'Matériel de dessin', 30
from public.categories c
left join public.field_sets fs on fs.key = 'art_supply'
where c.slug = 'dessin-arts-creatifs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'materiel-artistique', 'Matériel artistique', 40
from public.categories c
left join public.field_sets fs on fs.key = 'art_supply'
where c.slug = 'dessin-arts-creatifs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'geometrie', 'Géométrie', 30
from public.families f where f.slug = 'fournitures-scolaires'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'boites-de-geometrie', 'Boîtes de géométrie', 0
from public.categories c
left join public.field_sets fs on fs.key = 'geometry_tool'
where c.slug = 'geometrie'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'regles', 'Règles', 10
from public.categories c
left join public.field_sets fs on fs.key = 'geometry_tool'
where c.slug = 'geometrie'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'equerres', 'Équerres', 20
from public.categories c
left join public.field_sets fs on fs.key = 'geometry_tool'
where c.slug = 'geometrie'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'rapporteurs', 'Rapporteurs', 30
from public.categories c
left join public.field_sets fs on fs.key = 'geometry_tool'
where c.slug = 'geometrie'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'compas', 'Compas', 40
from public.categories c
left join public.field_sets fs on fs.key = 'geometry_tool'
where c.slug = 'geometrie'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'correction', 'Correction', 40
from public.families f where f.slug = 'fournitures-scolaires'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'gommes', 'Gommes', 0
from public.categories c
left join public.field_sets fs on fs.key = 'correction_supply'
where c.slug = 'correction'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'correcteurs-liquides', 'Correcteurs liquides', 10
from public.categories c
left join public.field_sets fs on fs.key = 'correction_supply'
where c.slug = 'correction'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'correcteurs-en-ruban', 'Correcteurs en ruban', 20
from public.categories c
left join public.field_sets fs on fs.key = 'correction_supply'
where c.slug = 'correction'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'effaceurs', 'Effaceurs', 30
from public.categories c
left join public.field_sets fs on fs.key = 'correction_supply'
where c.slug = 'correction'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'decoupage-taille', 'Découpage & taille', 50
from public.families f where f.slug = 'fournitures-scolaires'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'ciseaux', 'Ciseaux', 0
from public.categories c
left join public.field_sets fs on fs.key = 'cutting_tool'
where c.slug = 'decoupage-taille'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'taille-crayons', 'Taille-crayons', 10
from public.categories c
left join public.field_sets fs on fs.key = 'cutting_tool'
where c.slug = 'decoupage-taille'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'colles-adhesifs', 'Colles & adhésifs', 60
from public.families f where f.slug = 'fournitures-scolaires'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'colles', 'Colles', 0
from public.categories c
left join public.field_sets fs on fs.key = 'adhesive'
where c.slug = 'colles-adhesifs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'colle-en-baton', 'Colle en bâton', 10
from public.categories c
left join public.field_sets fs on fs.key = 'adhesive'
where c.slug = 'colles-adhesifs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'silicone', 'Silicone', 20
from public.categories c
left join public.field_sets fs on fs.key = 'adhesive'
where c.slug = 'colles-adhesifs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'adhesifs', 'Adhésifs', 30
from public.categories c
left join public.field_sets fs on fs.key = 'adhesive'
where c.slug = 'colles-adhesifs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'trousses-accessoires', 'Trousses & accessoires', 70
from public.families f where f.slug = 'fournitures-scolaires'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'trousses', 'Trousses', 0
from public.categories c
left join public.field_sets fs on fs.key = 'school_kit'
where c.slug = 'trousses-accessoires'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'accessoires-scolaires', 'Accessoires scolaires', 10
from public.categories c
left join public.field_sets fs on fs.key = 'school_kit'
where c.slug = 'trousses-accessoires'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'kits-scolaires', 'Kits scolaires', 20
from public.categories c
left join public.field_sets fs on fs.key = 'school_kit'
where c.slug = 'trousses-accessoires'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'materiel-scolaire-divers', 'Matériel scolaire divers', 80
from public.families f where f.slug = 'fournitures-scolaires'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'materiel-scolaire-divers', 'Matériel scolaire divers', 0
from public.categories c
left join public.field_sets fs on fs.key = 'generic'
where c.slug = 'materiel-scolaire-divers'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

-- ======================= Gaming =======================
insert into public.families (slug, name, description, icon, position)
values ('gaming', 'Gaming', 'Jeux, consoles, matériel et mobilier pour jouer dans les meilleures conditions.', 'gamepad', 20)
on conflict (slug) do update
set name = excluded.name, description = excluded.description,
    icon = excluded.icon, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'jeux', 'Jeux', 0
from public.families f where f.slug = 'gaming'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'jeux-pc', 'Jeux PC', 0
from public.categories c
left join public.field_sets fs on fs.key = 'video_game'
where c.slug = 'jeux'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'jeux-playstation', 'Jeux PlayStation', 10
from public.categories c
left join public.field_sets fs on fs.key = 'video_game'
where c.slug = 'jeux'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'jeux-xbox', 'Jeux Xbox', 20
from public.categories c
left join public.field_sets fs on fs.key = 'video_game'
where c.slug = 'jeux'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'jeux-nintendo', 'Jeux Nintendo', 30
from public.categories c
left join public.field_sets fs on fs.key = 'video_game'
where c.slug = 'jeux'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'jeux-numeriques', 'Jeux numériques', 40
from public.categories c
left join public.field_sets fs on fs.key = 'video_game'
where c.slug = 'jeux'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'cartes-cadeaux', 'Cartes cadeaux', 50
from public.categories c
left join public.field_sets fs on fs.key = 'gift_card'
where c.slug = 'jeux'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'abonnements-gaming', 'Abonnements gaming', 60
from public.categories c
left join public.field_sets fs on fs.key = 'gift_card'
where c.slug = 'jeux'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'consoles', 'Consoles', 10
from public.families f where f.slug = 'gaming'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'playstation', 'PlayStation', 0
from public.categories c
left join public.field_sets fs on fs.key = 'console'
where c.slug = 'consoles'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'xbox', 'Xbox', 10
from public.categories c
left join public.field_sets fs on fs.key = 'console'
where c.slug = 'consoles'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'nintendo', 'Nintendo', 20
from public.categories c
left join public.field_sets fs on fs.key = 'console'
where c.slug = 'consoles'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'autres-consoles', 'Autres consoles', 30
from public.categories c
left join public.field_sets fs on fs.key = 'console'
where c.slug = 'consoles'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'materiel-gaming', 'Matériel gaming', 20
from public.families f where f.slug = 'gaming'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'manettes', 'Manettes', 0
from public.categories c
left join public.field_sets fs on fs.key = 'gaming_controller'
where c.slug = 'materiel-gaming'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'claviers-gaming', 'Claviers gaming', 10
from public.categories c
left join public.field_sets fs on fs.key = 'keyboard'
where c.slug = 'materiel-gaming'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'souris-gaming', 'Souris gaming', 20
from public.categories c
left join public.field_sets fs on fs.key = 'mouse'
where c.slug = 'materiel-gaming'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'casques-gaming', 'Casques gaming', 30
from public.categories c
left join public.field_sets fs on fs.key = 'headset'
where c.slug = 'materiel-gaming'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'microphones-gaming', 'Microphones gaming', 40
from public.categories c
left join public.field_sets fs on fs.key = 'microphone'
where c.slug = 'materiel-gaming'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'volants', 'Volants', 50
from public.categories c
left join public.field_sets fs on fs.key = 'gaming_peripheral'
where c.slug = 'materiel-gaming'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'pedales', 'Pédales', 60
from public.categories c
left join public.field_sets fs on fs.key = 'gaming_peripheral'
where c.slug = 'materiel-gaming'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'tapis-gaming', 'Tapis gaming', 70
from public.categories c
left join public.field_sets fs on fs.key = 'gaming_accessory'
where c.slug = 'materiel-gaming'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'mobilier-gaming', 'Mobilier gaming', 30
from public.families f where f.slug = 'gaming'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'fauteuils-gaming', 'Fauteuils gaming', 0
from public.categories c
left join public.field_sets fs on fs.key = 'gaming_furniture'
where c.slug = 'mobilier-gaming'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'bureaux-gaming', 'Bureaux gaming', 10
from public.categories c
left join public.field_sets fs on fs.key = 'gaming_furniture'
where c.slug = 'mobilier-gaming'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'supports-mobilier-gaming', 'Supports', 20
from public.categories c
left join public.field_sets fs on fs.key = 'gaming_furniture'
where c.slug = 'mobilier-gaming'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'accessoires-gaming', 'Accessoires gaming', 40
from public.families f where f.slug = 'gaming'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'cables', 'Câbles', 0
from public.categories c
left join public.field_sets fs on fs.key = 'cable'
where c.slug = 'accessoires-gaming'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'chargeurs', 'Chargeurs', 10
from public.categories c
left join public.field_sets fs on fs.key = 'gaming_accessory'
where c.slug = 'accessoires-gaming'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'supports-console', 'Supports console', 20
from public.categories c
left join public.field_sets fs on fs.key = 'gaming_accessory'
where c.slug = 'accessoires-gaming'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'eclairage-gaming', 'Éclairage gaming', 30
from public.categories c
left join public.field_sets fs on fs.key = 'gaming_accessory'
where c.slug = 'accessoires-gaming'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'autres-accessoires', 'Autres accessoires', 40
from public.categories c
left join public.field_sets fs on fs.key = 'gaming_accessory'
where c.slug = 'accessoires-gaming'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

-- ======================= Bureau =======================
insert into public.families (slug, name, description, icon, position)
values ('bureau', 'Bureau', 'Classement, papeterie et accessoires pour équiper un bureau professionnel.', 'briefcase', 30)
on conflict (slug) do update
set name = excluded.name, description = excluded.description,
    icon = excluded.icon, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'classement-organisation', 'Classement & organisation', 0
from public.families f where f.slug = 'bureau'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'classeurs', 'Classeurs', 0
from public.categories c
left join public.field_sets fs on fs.key = 'filing_supply'
where c.slug = 'classement-organisation'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'chemises', 'Chemises', 10
from public.categories c
left join public.field_sets fs on fs.key = 'filing_supply'
where c.slug = 'classement-organisation'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'dossiers', 'Dossiers', 20
from public.categories c
left join public.field_sets fs on fs.key = 'filing_supply'
where c.slug = 'classement-organisation'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'porte-documents', 'Porte-documents', 30
from public.categories c
left join public.field_sets fs on fs.key = 'filing_supply'
where c.slug = 'classement-organisation'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'boites-de-classement', 'Boîtes de classement', 40
from public.categories c
left join public.field_sets fs on fs.key = 'filing_supply'
where c.slug = 'classement-organisation'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'agrafage', 'Agrafage', 10
from public.families f where f.slug = 'bureau'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'agrafeuses', 'Agrafeuses', 0
from public.categories c
left join public.field_sets fs on fs.key = 'stapler'
where c.slug = 'agrafage'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'agrafes', 'Agrafes', 10
from public.categories c
left join public.field_sets fs on fs.key = 'stapler'
where c.slug = 'agrafage'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'degrafeuses', 'Dégrafeuses', 20
from public.categories c
left join public.field_sets fs on fs.key = 'stapler'
where c.slug = 'agrafage'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'adhesifs', 'Adhésifs', 20
from public.families f where f.slug = 'bureau'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'rubans-adhesifs', 'Rubans adhésifs', 0
from public.categories c
left join public.field_sets fs on fs.key = 'office_adhesive'
where c.slug = 'adhesifs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'rubans-de-masquage', 'Rubans de masquage', 10
from public.categories c
left join public.field_sets fs on fs.key = 'office_adhesive'
where c.slug = 'adhesifs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'scotch', 'Scotch', 20
from public.categories c
left join public.field_sets fs on fs.key = 'office_adhesive'
where c.slug = 'adhesifs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'devidoirs', 'Dévidoirs', 30
from public.categories c
left join public.field_sets fs on fs.key = 'office_adhesive'
where c.slug = 'adhesifs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'fixation', 'Fixation', 30
from public.families f where f.slug = 'bureau'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'trombonnes', 'Trombonnes', 0
from public.categories c
left join public.field_sets fs on fs.key = 'fastener'
where c.slug = 'fixation'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'elastiques', 'Élastiques', 10
from public.categories c
left join public.field_sets fs on fs.key = 'fastener'
where c.slug = 'fixation'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'punaises', 'Punaises', 20
from public.categories c
left join public.field_sets fs on fs.key = 'fastener'
where c.slug = 'fixation'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'crochets', 'Crochets', 30
from public.categories c
left join public.field_sets fs on fs.key = 'fastener'
where c.slug = 'fixation'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'papeterie-de-bureau', 'Papeterie de bureau', 40
from public.families f where f.slug = 'bureau'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'blocs-notes-papeterie-de-bureau', 'Blocs-notes', 0
from public.categories c
left join public.field_sets fs on fs.key = 'office_paper'
where c.slug = 'papeterie-de-bureau'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'post-it-papeterie-de-bureau', 'Post-it', 10
from public.categories c
left join public.field_sets fs on fs.key = 'office_paper'
where c.slug = 'papeterie-de-bureau'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'enveloppes', 'Enveloppes', 20
from public.categories c
left join public.field_sets fs on fs.key = 'office_paper'
where c.slug = 'papeterie-de-bureau'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'papier', 'Papier', 30
from public.categories c
left join public.field_sets fs on fs.key = 'office_paper'
where c.slug = 'papeterie-de-bureau'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'ecriture-de-bureau', 'Écriture de bureau', 50
from public.families f where f.slug = 'bureau'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'stylos-ecriture-de-bureau', 'Stylos', 0
from public.categories c
left join public.field_sets fs on fs.key = 'writing_instrument'
where c.slug = 'ecriture-de-bureau'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'marqueurs-ecriture-de-bureau', 'Marqueurs', 10
from public.categories c
left join public.field_sets fs on fs.key = 'writing_instrument'
where c.slug = 'ecriture-de-bureau'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'crayons-ecriture-de-bureau', 'Crayons', 20
from public.categories c
left join public.field_sets fs on fs.key = 'writing_instrument'
where c.slug = 'ecriture-de-bureau'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'tampons-cachets', 'Tampons & cachets', 60
from public.families f where f.slug = 'bureau'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'tampons', 'Tampons', 0
from public.categories c
left join public.field_sets fs on fs.key = 'stamp'
where c.slug = 'tampons-cachets'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'tampons-encreurs', 'Tampons encreurs', 10
from public.categories c
left join public.field_sets fs on fs.key = 'stamp'
where c.slug = 'tampons-cachets'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'accessoires-de-sceau', 'Accessoires de sceau', 20
from public.categories c
left join public.field_sets fs on fs.key = 'stamp'
where c.slug = 'tampons-cachets'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'accessoires-de-bureau', 'Accessoires de bureau', 70
from public.families f where f.slug = 'bureau'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'organisateurs', 'Organisateurs', 0
from public.categories c
left join public.field_sets fs on fs.key = 'office_accessory'
where c.slug = 'accessoires-de-bureau'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'porte-stylos', 'Porte-stylos', 10
from public.categories c
left join public.field_sets fs on fs.key = 'office_accessory'
where c.slug = 'accessoires-de-bureau'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'cloches-de-bureau', 'Cloches de bureau', 20
from public.categories c
left join public.field_sets fs on fs.key = 'office_accessory'
where c.slug = 'accessoires-de-bureau'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'divers-accessoires-de-bureau', 'Divers', 30
from public.categories c
left join public.field_sets fs on fs.key = 'office_accessory'
where c.slug = 'accessoires-de-bureau'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

-- ======================= Maison & alimentaire =======================
insert into public.families (slug, name, description, icon, position)
values ('maison-alimentaire', 'Maison & alimentaire', 'Entretien, cuisine, rangement, éclairage et épicerie pour la maison.', 'home', 40)
on conflict (slug) do update
set name = excluded.name, description = excluded.description,
    icon = excluded.icon, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'produits-menagers', 'Produits ménagers', 0
from public.families f where f.slug = 'maison-alimentaire'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'nettoyage', 'Nettoyage', 0
from public.categories c
left join public.field_sets fs on fs.key = 'cleaning_product'
where c.slug = 'produits-menagers'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'desinfection', 'Désinfection', 10
from public.categories c
left join public.field_sets fs on fs.key = 'cleaning_product'
where c.slug = 'produits-menagers'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'lessive', 'Lessive', 20
from public.categories c
left join public.field_sets fs on fs.key = 'cleaning_product'
where c.slug = 'produits-menagers'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'vaisselle', 'Vaisselle', 30
from public.categories c
left join public.field_sets fs on fs.key = 'cleaning_product'
where c.slug = 'produits-menagers'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'entretien', 'Entretien', 40
from public.categories c
left join public.field_sets fs on fs.key = 'cleaning_product'
where c.slug = 'produits-menagers'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'cuisine', 'Cuisine', 10
from public.families f where f.slug = 'maison-alimentaire'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'ustensiles', 'Ustensiles', 0
from public.categories c
left join public.field_sets fs on fs.key = 'kitchenware'
where c.slug = 'cuisine'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'rangement', 'Rangement', 10
from public.categories c
left join public.field_sets fs on fs.key = 'storage_container'
where c.slug = 'cuisine'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'contenants', 'Contenants', 20
from public.categories c
left join public.field_sets fs on fs.key = 'storage_container'
where c.slug = 'cuisine'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'accessoires-de-cuisine', 'Accessoires de cuisine', 30
from public.categories c
left join public.field_sets fs on fs.key = 'kitchenware'
where c.slug = 'cuisine'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'rangement-organisation', 'Rangement & organisation', 20
from public.families f where f.slug = 'maison-alimentaire'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'boites', 'Boîtes', 0
from public.categories c
left join public.field_sets fs on fs.key = 'storage_container'
where c.slug = 'rangement-organisation'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'paniers', 'Paniers', 10
from public.categories c
left join public.field_sets fs on fs.key = 'storage_container'
where c.slug = 'rangement-organisation'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'crochets-rangement-organisation', 'Crochets', 20
from public.categories c
left join public.field_sets fs on fs.key = 'storage_container'
where c.slug = 'rangement-organisation'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'organisateurs-rangement-organisation', 'Organisateurs', 30
from public.categories c
left join public.field_sets fs on fs.key = 'storage_container'
where c.slug = 'rangement-organisation'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'eclairage-energie', 'Éclairage & énergie', 30
from public.families f where f.slug = 'maison-alimentaire'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'ampoules', 'Ampoules', 0
from public.categories c
left join public.field_sets fs on fs.key = 'lighting'
where c.slug = 'eclairage-energie'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'lampes', 'Lampes', 10
from public.categories c
left join public.field_sets fs on fs.key = 'lighting'
where c.slug = 'eclairage-energie'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'ampoules-rechargeables', 'Ampoules rechargeables', 20
from public.categories c
left join public.field_sets fs on fs.key = 'lighting'
where c.slug = 'eclairage-energie'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'piles', 'Piles', 30
from public.categories c
left join public.field_sets fs on fs.key = 'battery'
where c.slug = 'eclairage-energie'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'batteries', 'Batteries', 40
from public.categories c
left join public.field_sets fs on fs.key = 'battery'
where c.slug = 'eclairage-energie'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'alimentaire', 'Alimentaire', 40
from public.families f where f.slug = 'maison-alimentaire'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'snacks', 'Snacks', 0
from public.categories c
left join public.field_sets fs on fs.key = 'food'
where c.slug = 'alimentaire'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'biscuits', 'Biscuits', 10
from public.categories c
left join public.field_sets fs on fs.key = 'food'
where c.slug = 'alimentaire'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'bonbons-confiseries', 'Bonbons & confiseries', 20
from public.categories c
left join public.field_sets fs on fs.key = 'food'
where c.slug = 'alimentaire'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'chocolats', 'Chocolats', 30
from public.categories c
left join public.field_sets fs on fs.key = 'food'
where c.slug = 'alimentaire'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'boissons', 'Boissons', 40
from public.categories c
left join public.field_sets fs on fs.key = 'food'
where c.slug = 'alimentaire'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'cafe-the', 'Café & thé', 50
from public.categories c
left join public.field_sets fs on fs.key = 'food'
where c.slug = 'alimentaire'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'epicerie', 'Épicerie', 60
from public.categories c
left join public.field_sets fs on fs.key = 'food'
where c.slug = 'alimentaire'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

-- ======================= Cosmétiques =======================
insert into public.families (slug, name, description, icon, position)
values ('cosmetiques', 'Cosmétiques', 'Soins du visage et du corps, cheveux, parfumerie et maquillage.', 'sparkles', 50)
on conflict (slug) do update
set name = excluded.name, description = excluded.description,
    icon = excluded.icon, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'soins-du-visage', 'Soins du visage', 0
from public.families f where f.slug = 'cosmetiques'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'nettoyants', 'Nettoyants', 0
from public.categories c
left join public.field_sets fs on fs.key = 'cosmetic'
where c.slug = 'soins-du-visage'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'cremes-visage', 'Crèmes visage', 10
from public.categories c
left join public.field_sets fs on fs.key = 'cosmetic'
where c.slug = 'soins-du-visage'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'masques', 'Masques', 20
from public.categories c
left join public.field_sets fs on fs.key = 'cosmetic'
where c.slug = 'soins-du-visage'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'serums', 'Sérums', 30
from public.categories c
left join public.field_sets fs on fs.key = 'cosmetic'
where c.slug = 'soins-du-visage'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'soins-du-corps', 'Soins du corps', 10
from public.families f where f.slug = 'cosmetiques'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'savons', 'Savons', 0
from public.categories c
left join public.field_sets fs on fs.key = 'cosmetic'
where c.slug = 'soins-du-corps'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'lotions', 'Lotions', 10
from public.categories c
left join public.field_sets fs on fs.key = 'cosmetic'
where c.slug = 'soins-du-corps'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'cremes-corps', 'Crèmes corps', 20
from public.categories c
left join public.field_sets fs on fs.key = 'cosmetic'
where c.slug = 'soins-du-corps'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'huiles', 'Huiles', 30
from public.categories c
left join public.field_sets fs on fs.key = 'cosmetic'
where c.slug = 'soins-du-corps'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'soins-capillaires', 'Soins capillaires', 20
from public.families f where f.slug = 'cosmetiques'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'shampooings', 'Shampooings', 0
from public.categories c
left join public.field_sets fs on fs.key = 'cosmetic'
where c.slug = 'soins-capillaires'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'apres-shampooings', 'Après-shampooings', 10
from public.categories c
left join public.field_sets fs on fs.key = 'cosmetic'
where c.slug = 'soins-capillaires'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'huiles-capillaires', 'Huiles capillaires', 20
from public.categories c
left join public.field_sets fs on fs.key = 'cosmetic'
where c.slug = 'soins-capillaires'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'produits-coiffants', 'Produits coiffants', 30
from public.categories c
left join public.field_sets fs on fs.key = 'cosmetic'
where c.slug = 'soins-capillaires'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'parfumerie', 'Parfumerie', 30
from public.families f where f.slug = 'cosmetiques'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'parfums', 'Parfums', 0
from public.categories c
left join public.field_sets fs on fs.key = 'fragrance'
where c.slug = 'parfumerie'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'brumes', 'Brumes', 10
from public.categories c
left join public.field_sets fs on fs.key = 'fragrance'
where c.slug = 'parfumerie'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'deodorants', 'Déodorants', 20
from public.categories c
left join public.field_sets fs on fs.key = 'fragrance'
where c.slug = 'parfumerie'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'maquillage', 'Maquillage', 40
from public.families f where f.slug = 'cosmetiques'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'levres', 'Lèvres', 0
from public.categories c
left join public.field_sets fs on fs.key = 'makeup'
where c.slug = 'maquillage'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'yeux', 'Yeux', 10
from public.categories c
left join public.field_sets fs on fs.key = 'makeup'
where c.slug = 'maquillage'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'teint', 'Teint', 20
from public.categories c
left join public.field_sets fs on fs.key = 'makeup'
where c.slug = 'maquillage'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'ongles', 'Ongles', 30
from public.categories c
left join public.field_sets fs on fs.key = 'makeup'
where c.slug = 'maquillage'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'accessoires-beaute', 'Accessoires beauté', 50
from public.families f where f.slug = 'cosmetiques'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'miroirs', 'Miroirs', 0
from public.categories c
left join public.field_sets fs on fs.key = 'beauty_accessory'
where c.slug = 'accessoires-beaute'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'trousses-beaute', 'Trousses beauté', 10
from public.categories c
left join public.field_sets fs on fs.key = 'beauty_accessory'
where c.slug = 'accessoires-beaute'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'accessoires-de-soin', 'Accessoires de soin', 20
from public.categories c
left join public.field_sets fs on fs.key = 'beauty_accessory'
where c.slug = 'accessoires-beaute'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

-- ======================= Sport & loisirs =======================
insert into public.families (slug, name, description, icon, position)
values ('sport-loisirs', 'Sport & loisirs', 'Football, fitness, jeux de société et loisirs pour toute la famille.', 'trophy', 60)
on conflict (slug) do update
set name = excluded.name, description = excluded.description,
    icon = excluded.icon, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'football', 'Football', 0
from public.families f where f.slug = 'sport-loisirs'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'ballons', 'Ballons', 0
from public.categories c
left join public.field_sets fs on fs.key = 'sports_equipment'
where c.slug = 'football'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'chaussures', 'Chaussures', 10
from public.categories c
left join public.field_sets fs on fs.key = 'footwear'
where c.slug = 'football'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'maillots', 'Maillots', 20
from public.categories c
left join public.field_sets fs on fs.key = 'sports_apparel'
where c.slug = 'football'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'chaussettes', 'Chaussettes', 30
from public.categories c
left join public.field_sets fs on fs.key = 'sports_apparel'
where c.slug = 'football'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'accessoires', 'Accessoires', 40
from public.categories c
left join public.field_sets fs on fs.key = 'sports_equipment'
where c.slug = 'football'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'sports-fitness', 'Sports & fitness', 10
from public.families f where f.slug = 'sport-loisirs'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'equipements', 'Équipements', 0
from public.categories c
left join public.field_sets fs on fs.key = 'sports_equipment'
where c.slug = 'sports-fitness'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'accessoires-sports-fitness', 'Accessoires', 10
from public.categories c
left join public.field_sets fs on fs.key = 'sports_equipment'
where c.slug = 'sports-fitness'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'vetements', 'Vêtements', 20
from public.categories c
left join public.field_sets fs on fs.key = 'sports_apparel'
where c.slug = 'sports-fitness'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'jeux-de-societe', 'Jeux de société', 20
from public.families f where f.slug = 'sport-loisirs'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'echecs', 'Échecs', 0
from public.categories c
left join public.field_sets fs on fs.key = 'board_game'
where c.slug = 'jeux-de-societe'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'ludo', 'Ludo', 10
from public.categories c
left join public.field_sets fs on fs.key = 'board_game'
where c.slug = 'jeux-de-societe'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'jeux-de-cartes', 'Jeux de cartes', 20
from public.categories c
left join public.field_sets fs on fs.key = 'board_game'
where c.slug = 'jeux-de-societe'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'jeux-de-strategie', 'Jeux de stratégie', 30
from public.categories c
left join public.field_sets fs on fs.key = 'board_game'
where c.slug = 'jeux-de-societe'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'jeux-familiaux', 'Jeux familiaux', 40
from public.categories c
left join public.field_sets fs on fs.key = 'board_game'
where c.slug = 'jeux-de-societe'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'autres-jeux-de-societe', 'Autres jeux de société', 50
from public.categories c
left join public.field_sets fs on fs.key = 'board_game'
where c.slug = 'jeux-de-societe'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'jeux-loisirs', 'Jeux & loisirs', 30
from public.families f where f.slug = 'sport-loisirs'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'puzzles', 'Puzzles', 0
from public.categories c
left join public.field_sets fs on fs.key = 'toy'
where c.slug = 'jeux-loisirs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'jeux-educatifs', 'Jeux éducatifs', 10
from public.categories c
left join public.field_sets fs on fs.key = 'toy'
where c.slug = 'jeux-loisirs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'jeux-pour-enfants', 'Jeux pour enfants', 20
from public.categories c
left join public.field_sets fs on fs.key = 'toy'
where c.slug = 'jeux-loisirs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'jeux-d-exterieur', 'Jeux d''extérieur', 30
from public.categories c
left join public.field_sets fs on fs.key = 'toy'
where c.slug = 'jeux-loisirs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

insert into public.categories (family_id, slug, name, position)
select f.id, 'accessoires-de-loisirs', 'Accessoires de loisirs', 40
from public.families f where f.slug = 'sport-loisirs'
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;
insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, 'accessoires-de-loisirs', 'Accessoires de loisirs', 0
from public.categories c
left join public.field_sets fs on fs.key = 'generic'
where c.slug = 'accessoires-de-loisirs'
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;

commit;