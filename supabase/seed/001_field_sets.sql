-- Seed 001 — Field sets and field definitions
-- GENERATED FILE — do not edit by hand.
-- Source: supabase/taxonomy/*.mjs   Regenerate with: npm run seed:generate


begin;

-- Caractéristiques générales
insert into public.field_sets (key, name, description)
values ('generic', 'Caractéristiques générales', 'Jeu de champs par défaut pour les produits sans spécificité forte.')
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'matiere', 'Matière', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 0
from public.field_sets fs where fs.key = 'generic'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couleur', 'Couleur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'generic'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'dimensions', 'Dimensions', 'text'::public.field_type,
       NULL, '[]'::jsonb, 'L x l x H', NULL,
       NULL, false, false, false, 20
from public.field_sets fs where fs.key = 'generic'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'contenu', 'Contenu de l''emballage', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'generic'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'pays_origine', 'Pays d''origine', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'generic'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'generic'
  and fd.key not in ('matiere', 'couleur', 'dimensions', 'contenu', 'pays_origine');

-- Ordinateur portable
insert into public.field_sets (key, name, description)
values ('laptop', 'Ordinateur portable', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'processeur', 'Processeur', 'text'::public.field_type,
       NULL, '[]'::jsonb, 'Intel Core i5-1235U', NULL,
       'Performance', true, false, true, 0
from public.field_sets fs where fs.key = 'laptop'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'generation_processeur', 'Génération du processeur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       'Performance', false, false, false, 10
from public.field_sets fs where fs.key = 'laptop'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'ram', 'Mémoire RAM', 'select'::public.field_type,
       NULL, '["4 Go","8 Go","12 Go","16 Go","24 Go","32 Go","64 Go"]'::jsonb, NULL, NULL,
       'Performance', false, true, true, 20
from public.field_sets fs where fs.key = 'laptop'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_ram', 'Type de RAM', 'select'::public.field_type,
       NULL, '["DDR3","DDR4","DDR5","LPDDR4X","LPDDR5"]'::jsonb, NULL, NULL,
       'Performance', false, false, false, 30
from public.field_sets fs where fs.key = 'laptop'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'stockage', 'Stockage', 'select'::public.field_type,
       NULL, '["128 Go","256 Go","512 Go","1 To","2 To"]'::jsonb, NULL, NULL,
       'Stockage', false, true, true, 40
from public.field_sets fs where fs.key = 'laptop'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_stockage', 'Type de stockage', 'select'::public.field_type,
       NULL, '["HDD","SSD SATA","SSD NVMe","eMMC"]'::jsonb, NULL, NULL,
       'Stockage', false, true, false, 50
from public.field_sets fs where fs.key = 'laptop'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'gpu', 'Carte graphique', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       'Performance', false, false, true, 60
from public.field_sets fs where fs.key = 'laptop'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'taille_ecran', 'Taille de l''écran', 'select'::public.field_type,
       'pouces', '["11.6","13.3","14","15.6","16","17.3"]'::jsonb, NULL, NULL,
       'Écran', false, true, true, 70
from public.field_sets fs where fs.key = 'laptop'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'resolution', 'Résolution', 'select'::public.field_type,
       NULL, '["1366 x 768","1920 x 1080","2560 x 1440","2880 x 1800","3840 x 2160"]'::jsonb, NULL, NULL,
       'Écran', false, false, false, 80
from public.field_sets fs where fs.key = 'laptop'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_ecran', 'Type d''écran', 'select'::public.field_type,
       NULL, '["TN","IPS","OLED","Tactile"]'::jsonb, NULL, NULL,
       'Écran', false, false, false, 90
from public.field_sets fs where fs.key = 'laptop'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'systeme_exploitation', 'Système d''exploitation', 'select'::public.field_type,
       NULL, '["Windows 11 Famille","Windows 11 Pro","Windows 10","macOS","Linux","Sans OS"]'::jsonb, NULL, NULL,
       'Système', false, true, false, 100
from public.field_sets fs where fs.key = 'laptop'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'batterie', 'Batterie', 'text'::public.field_type,
       NULL, '[]'::jsonb, '3 cellules, 42 Wh', NULL,
       'Autonomie', false, false, false, 110
from public.field_sets fs where fs.key = 'laptop'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'autonomie', 'Autonomie annoncée', 'text'::public.field_type,
       'h', '[]'::jsonb, NULL, NULL,
       'Autonomie', false, false, false, 120
from public.field_sets fs where fs.key = 'laptop'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'wifi', 'Wi-Fi', 'select'::public.field_type,
       NULL, '["Wi-Fi 5","Wi-Fi 6","Wi-Fi 6E","Wi-Fi 7"]'::jsonb, NULL, NULL,
       'Connectivité', false, false, false, 130
from public.field_sets fs where fs.key = 'laptop'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'bluetooth', 'Bluetooth', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       'Connectivité', false, false, false, 140
from public.field_sets fs where fs.key = 'laptop'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'ports', 'Ports', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, '2x USB-A, 1x USB-C, HDMI, jack 3.5 mm', NULL,
       'Connectivité', false, false, false, 150
from public.field_sets fs where fs.key = 'laptop'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'clavier', 'Clavier', 'text'::public.field_type,
       NULL, '[]'::jsonb, 'AZERTY rétroéclairé', NULL,
       'Ergonomie', false, false, false, 160
from public.field_sets fs where fs.key = 'laptop'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'webcam', 'Webcam', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       'Ergonomie', false, false, false, 170
from public.field_sets fs where fs.key = 'laptop'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'poids', 'Poids', 'number'::public.field_type,
       'kg', '[]'::jsonb, NULL, NULL,
       'Format', false, false, false, 180
from public.field_sets fs where fs.key = 'laptop'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'dimensions', 'Dimensions', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       'Format', false, false, false, 190
from public.field_sets fs where fs.key = 'laptop'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'laptop'
  and fd.key not in ('processeur', 'generation_processeur', 'ram', 'type_ram', 'stockage', 'type_stockage', 'gpu', 'taille_ecran', 'resolution', 'type_ecran', 'systeme_exploitation', 'batterie', 'autonomie', 'wifi', 'bluetooth', 'ports', 'clavier', 'webcam', 'poids', 'dimensions');

-- Ordinateur de bureau
insert into public.field_sets (key, name, description)
values ('desktop_pc', 'Ordinateur de bureau', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'processeur', 'Processeur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       'Performance', true, false, true, 0
from public.field_sets fs where fs.key = 'desktop_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'ram', 'Mémoire RAM', 'select'::public.field_type,
       NULL, '["8 Go","16 Go","32 Go","64 Go","128 Go"]'::jsonb, NULL, NULL,
       'Performance', false, true, true, 10
from public.field_sets fs where fs.key = 'desktop_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'stockage', 'Stockage', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       'Stockage', false, false, true, 20
from public.field_sets fs where fs.key = 'desktop_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_stockage', 'Type de stockage', 'select'::public.field_type,
       NULL, '["HDD","SSD SATA","SSD NVMe","Hybride"]'::jsonb, NULL, NULL,
       'Stockage', false, true, false, 30
from public.field_sets fs where fs.key = 'desktop_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'gpu', 'Carte graphique', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       'Performance', false, false, true, 40
from public.field_sets fs where fs.key = 'desktop_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'carte_mere', 'Carte mère', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       'Composants', false, false, false, 50
from public.field_sets fs where fs.key = 'desktop_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'alimentation', 'Alimentation', 'text'::public.field_type,
       'W', '[]'::jsonb, NULL, NULL,
       'Composants', false, false, false, 60
from public.field_sets fs where fs.key = 'desktop_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'boitier', 'Format du boîtier', 'select'::public.field_type,
       NULL, '["Mini-Tour","Moyenne Tour","Grande Tour","SFF"]'::jsonb, NULL, NULL,
       'Composants', false, true, false, 70
from public.field_sets fs where fs.key = 'desktop_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'refroidissement', 'Refroidissement', 'select'::public.field_type,
       NULL, '["Air","AIO liquide","Watercooling custom"]'::jsonb, NULL, NULL,
       'Composants', false, false, false, 80
from public.field_sets fs where fs.key = 'desktop_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'systeme_exploitation', 'Système d''exploitation', 'select'::public.field_type,
       NULL, '["Windows 11 Famille","Windows 11 Pro","Linux","Sans OS"]'::jsonb, NULL, NULL,
       'Système', false, true, false, 90
from public.field_sets fs where fs.key = 'desktop_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'ports', 'Ports', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       'Connectivité', false, false, false, 100
from public.field_sets fs where fs.key = 'desktop_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'reseau', 'Réseau', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       'Connectivité', false, false, false, 110
from public.field_sets fs where fs.key = 'desktop_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'ecran_inclus', 'Écran inclus', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       'Contenu', false, false, false, 120
from public.field_sets fs where fs.key = 'desktop_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'peripheriques_inclus', 'Périphériques inclus', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       'Contenu', false, false, false, 130
from public.field_sets fs where fs.key = 'desktop_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'desktop_pc'
  and fd.key not in ('processeur', 'ram', 'stockage', 'type_stockage', 'gpu', 'carte_mere', 'alimentation', 'boitier', 'refroidissement', 'systeme_exploitation', 'ports', 'reseau', 'ecran_inclus', 'peripheriques_inclus');

-- Mini PC
insert into public.field_sets (key, name, description)
values ('mini_pc', 'Mini PC', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'processeur', 'Processeur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, true, false, true, 0
from public.field_sets fs where fs.key = 'mini_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'ram', 'Mémoire RAM', 'select'::public.field_type,
       NULL, '["4 Go","8 Go","16 Go","32 Go"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'mini_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'stockage', 'Stockage', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 20
from public.field_sets fs where fs.key = 'mini_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'systeme_exploitation', 'Système d''exploitation', 'select'::public.field_type,
       NULL, '["Windows 11","Linux","Sans OS"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 30
from public.field_sets fs where fs.key = 'mini_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'ports', 'Ports', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'mini_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'wifi', 'Wi-Fi', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'mini_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'dimensions', 'Dimensions', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'mini_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'consommation', 'Consommation', 'number'::public.field_type,
       'W', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'mini_pc'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'mini_pc'
  and fd.key not in ('processeur', 'ram', 'stockage', 'systeme_exploitation', 'ports', 'wifi', 'dimensions', 'consommation');

-- Processeur
insert into public.field_sets (key, name, description)
values ('cpu', 'Processeur', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'socket', 'Socket', 'select'::public.field_type,
       NULL, '["LGA 1700","LGA 1851","LGA 1200","AM4","AM5"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'cpu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'nombre_coeurs', 'Nombre de cœurs', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'cpu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'nombre_threads', 'Nombre de threads', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 20
from public.field_sets fs where fs.key = 'cpu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'frequence_base', 'Fréquence de base', 'number'::public.field_type,
       'GHz', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 30
from public.field_sets fs where fs.key = 'cpu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'frequence_turbo', 'Fréquence turbo', 'number'::public.field_type,
       'GHz', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'cpu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'cache', 'Cache', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'cpu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'tdp', 'TDP', 'integer'::public.field_type,
       'W', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'cpu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'gpu_integre', 'GPU intégré', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'cpu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'ventirad_inclus', 'Ventirad inclus', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 80
from public.field_sets fs where fs.key = 'cpu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'cpu'
  and fd.key not in ('socket', 'nombre_coeurs', 'nombre_threads', 'frequence_base', 'frequence_turbo', 'cache', 'tdp', 'gpu_integre', 'ventirad_inclus');

-- Carte graphique
insert into public.field_sets (key, name, description)
values ('gpu', 'Carte graphique', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'chipset', 'Chipset', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, true, false, true, 0
from public.field_sets fs where fs.key = 'gpu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'memoire', 'Mémoire vidéo', 'select'::public.field_type,
       NULL, '["4 Go","6 Go","8 Go","12 Go","16 Go","24 Go"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'gpu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_memoire', 'Type de mémoire', 'select'::public.field_type,
       NULL, '["GDDR5","GDDR6","GDDR6X","GDDR7"]'::jsonb, NULL, NULL,
       NULL, false, false, false, 20
from public.field_sets fs where fs.key = 'gpu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'interface', 'Interface', 'select'::public.field_type,
       NULL, '["PCIe 3.0 x16","PCIe 4.0 x16","PCIe 5.0 x16"]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'gpu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'sorties_video', 'Sorties vidéo', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'gpu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'alimentation_recommandee', 'Alimentation recommandée', 'integer'::public.field_type,
       'W', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'gpu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'connecteurs_alimentation', 'Connecteurs d''alimentation', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'gpu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'longueur', 'Longueur', 'number'::public.field_type,
       'mm', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'gpu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'gpu'
  and fd.key not in ('chipset', 'memoire', 'type_memoire', 'interface', 'sorties_video', 'alimentation_recommandee', 'connecteurs_alimentation', 'longueur');

-- Carte mère
insert into public.field_sets (key, name, description)
values ('motherboard', 'Carte mère', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'socket', 'Socket', 'select'::public.field_type,
       NULL, '["LGA 1700","LGA 1851","AM4","AM5"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'motherboard'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'chipset', 'Chipset', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'motherboard'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'format', 'Format', 'select'::public.field_type,
       NULL, '["ATX","Micro-ATX","Mini-ITX","E-ATX"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 20
from public.field_sets fs where fs.key = 'motherboard'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_ram', 'Type de RAM', 'select'::public.field_type,
       NULL, '["DDR4","DDR5"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 30
from public.field_sets fs where fs.key = 'motherboard'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'slots_ram', 'Slots mémoire', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'motherboard'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'ram_max', 'Mémoire maximale', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'motherboard'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'slots_m2', 'Slots M.2', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'motherboard'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'ports_sata', 'Ports SATA', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'motherboard'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'reseau', 'Réseau', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 80
from public.field_sets fs where fs.key = 'motherboard'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'wifi_integre', 'Wi-Fi intégré', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 90
from public.field_sets fs where fs.key = 'motherboard'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'motherboard'
  and fd.key not in ('socket', 'chipset', 'format', 'type_ram', 'slots_ram', 'ram_max', 'slots_m2', 'ports_sata', 'reseau', 'wifi_integre');

-- Mémoire RAM
insert into public.field_sets (key, name, description)
values ('ram', 'Mémoire RAM', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'capacite', 'Capacité', 'select'::public.field_type,
       NULL, '["4 Go","8 Go","16 Go","32 Go","64 Go"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'ram'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_ram', 'Type', 'select'::public.field_type,
       NULL, '["DDR3","DDR4","DDR5"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'ram'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'frequence', 'Fréquence', 'integer'::public.field_type,
       'MHz', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 20
from public.field_sets fs where fs.key = 'ram'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'latence', 'Latence CAS', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'ram'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'format', 'Format', 'select'::public.field_type,
       NULL, '["DIMM","SO-DIMM"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 40
from public.field_sets fs where fs.key = 'ram'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'nombre_barrettes', 'Nombre de barrettes', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'ram'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'dissipateur', 'Dissipateur', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'ram'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'rgb', 'Éclairage RGB', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'ram'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'ram'
  and fd.key not in ('capacite', 'type_ram', 'frequence', 'latence', 'format', 'nombre_barrettes', 'dissipateur', 'rgb');

-- Disque / SSD
insert into public.field_sets (key, name, description)
values ('storage_drive', 'Disque / SSD', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'capacite', 'Capacité', 'select'::public.field_type,
       NULL, '["120 Go","240 Go","500 Go","1 To","2 To","4 To","8 To"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'storage_drive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_stockage', 'Type', 'select'::public.field_type,
       NULL, '["HDD","SSD SATA","SSD NVMe","SSD externe","HDD externe"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'storage_drive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'format', 'Format', 'select'::public.field_type,
       NULL, '["2.5\"","3.5\"","M.2 2280","M.2 2230"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 20
from public.field_sets fs where fs.key = 'storage_drive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'interface', 'Interface', 'select'::public.field_type,
       NULL, '["SATA III","PCIe 3.0","PCIe 4.0","PCIe 5.0","USB 3.2","USB-C"]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'storage_drive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'vitesse_lecture', 'Vitesse de lecture', 'integer'::public.field_type,
       'Mo/s', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 40
from public.field_sets fs where fs.key = 'storage_drive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'vitesse_ecriture', 'Vitesse d''écriture', 'integer'::public.field_type,
       'Mo/s', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'storage_drive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'vitesse_rotation', 'Vitesse de rotation', 'integer'::public.field_type,
       'tr/min', '[]'::jsonb, NULL, 'Disques mécaniques uniquement.',
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'storage_drive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'endurance', 'Endurance (TBW)', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'storage_drive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'storage_drive'
  and fd.key not in ('capacite', 'type_stockage', 'format', 'interface', 'vitesse_lecture', 'vitesse_ecriture', 'vitesse_rotation', 'endurance');

-- Alimentation
insert into public.field_sets (key, name, description)
values ('psu', 'Alimentation', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'puissance', 'Puissance', 'select'::public.field_type,
       NULL, '["450 W","550 W","650 W","750 W","850 W","1000 W","1200 W"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'psu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'certification', 'Certification', 'select'::public.field_type,
       NULL, '["80+ White","80+ Bronze","80+ Silver","80+ Gold","80+ Platinum","80+ Titanium"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'psu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'modularite', 'Modularité', 'select'::public.field_type,
       NULL, '["Non modulaire","Semi-modulaire","Full modulaire"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 20
from public.field_sets fs where fs.key = 'psu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'format', 'Format', 'select'::public.field_type,
       NULL, '["ATX","SFX","SFX-L"]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'psu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'connecteurs', 'Connecteurs', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'psu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'ventilateur', 'Ventilateur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'psu'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'psu'
  and fd.key not in ('puissance', 'certification', 'modularite', 'format', 'connecteurs', 'ventilateur');

-- Boîtier PC
insert into public.field_sets (key, name, description)
values ('pc_case', 'Boîtier PC', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'format', 'Format', 'select'::public.field_type,
       NULL, '["Mini-ITX","Micro-ATX","Moyenne Tour ATX","Grande Tour E-ATX"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'pc_case'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'materiau', 'Matériau', 'select'::public.field_type,
       NULL, '["Acier","Aluminium","Verre trempé","Mesh"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 10
from public.field_sets fs where fs.key = 'pc_case'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'ventilateurs_inclus', 'Ventilateurs inclus', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 20
from public.field_sets fs where fs.key = 'pc_case'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'emplacements_ventilateurs', 'Emplacements ventilateurs', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'pc_case'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'support_watercooling', 'Support watercooling', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'pc_case'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'longueur_gpu_max', 'Longueur GPU max', 'integer'::public.field_type,
       'mm', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'pc_case'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'hauteur_ventirad_max', 'Hauteur ventirad max', 'integer'::public.field_type,
       'mm', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'pc_case'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'ports_facade', 'Ports en façade', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'pc_case'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'rgb', 'Éclairage RGB', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 80
from public.field_sets fs where fs.key = 'pc_case'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'pc_case'
  and fd.key not in ('format', 'materiau', 'ventilateurs_inclus', 'emplacements_ventilateurs', 'support_watercooling', 'longueur_gpu_max', 'hauteur_ventirad_max', 'ports_facade', 'rgb');

-- Refroidissement
insert into public.field_sets (key, name, description)
values ('cooling', 'Refroidissement', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_refroidissement', 'Type', 'select'::public.field_type,
       NULL, '["Ventirad","AIO 120 mm","AIO 240 mm","AIO 280 mm","AIO 360 mm","Ventilateur boîtier","Pâte thermique"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'cooling'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'sockets_compatibles', 'Sockets compatibles', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'cooling'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'tdp_supporte', 'TDP supporté', 'integer'::public.field_type,
       'W', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 20
from public.field_sets fs where fs.key = 'cooling'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'niveau_sonore', 'Niveau sonore', 'number'::public.field_type,
       'dB', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'cooling'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'vitesse_rotation', 'Vitesse de rotation', 'text'::public.field_type,
       'tr/min', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'cooling'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'rgb', 'Éclairage RGB', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'cooling'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'cooling'
  and fd.key not in ('type_refroidissement', 'sockets_compatibles', 'tdp_supporte', 'niveau_sonore', 'vitesse_rotation', 'rgb');

-- Clavier
insert into public.field_sets (key, name, description)
values ('keyboard', 'Clavier', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_clavier', 'Type', 'select'::public.field_type,
       NULL, '["Membrane","Mécanique","Optique","Semi-mécanique"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'keyboard'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'format', 'Format', 'select'::public.field_type,
       NULL, '["Complet 100%","TKL 87%","75%","65%","60%"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'keyboard'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'disposition', 'Disposition', 'select'::public.field_type,
       NULL, '["AZERTY","QWERTY","QWERTZ"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 20
from public.field_sets fs where fs.key = 'keyboard'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'connexion', 'Connexion', 'select'::public.field_type,
       NULL, '["Filaire USB","Sans fil 2.4 GHz","Bluetooth","Hybride"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 30
from public.field_sets fs where fs.key = 'keyboard'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'switches', 'Switches', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'keyboard'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'retroeclairage', 'Rétroéclairage', 'select'::public.field_type,
       NULL, '["Aucun","Monochrome","RGB"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 50
from public.field_sets fs where fs.key = 'keyboard'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'repose_poignets', 'Repose-poignets', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'keyboard'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'autonomie', 'Autonomie', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'keyboard'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'keyboard'
  and fd.key not in ('type_clavier', 'format', 'disposition', 'connexion', 'switches', 'retroeclairage', 'repose_poignets', 'autonomie');

-- Souris
insert into public.field_sets (key, name, description)
values ('mouse', 'Souris', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'connexion', 'Connexion', 'select'::public.field_type,
       NULL, '["Filaire USB","Sans fil 2.4 GHz","Bluetooth","Hybride"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'mouse'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'capteur', 'Capteur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 10
from public.field_sets fs where fs.key = 'mouse'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'dpi_max', 'DPI maximum', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 20
from public.field_sets fs where fs.key = 'mouse'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'nombre_boutons', 'Nombre de boutons', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'mouse'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'poids', 'Poids', 'number'::public.field_type,
       'g', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'mouse'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'retroeclairage', 'Rétroéclairage', 'select'::public.field_type,
       NULL, '["Aucun","Monochrome","RGB"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 50
from public.field_sets fs where fs.key = 'mouse'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'main', 'Ergonomie', 'select'::public.field_type,
       NULL, '["Ambidextre","Droitier","Gaucher"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 60
from public.field_sets fs where fs.key = 'mouse'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'autonomie', 'Autonomie', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'mouse'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'mouse'
  and fd.key not in ('connexion', 'capteur', 'dpi_max', 'nombre_boutons', 'poids', 'retroeclairage', 'main', 'autonomie');

-- Webcam
insert into public.field_sets (key, name, description)
values ('webcam', 'Webcam', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'resolution', 'Résolution', 'select'::public.field_type,
       NULL, '["720p","1080p","2K","4K"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'webcam'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'images_par_seconde', 'Images par seconde', 'select'::public.field_type,
       NULL, '["30 fps","60 fps"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'webcam'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'champ_vision', 'Champ de vision', 'text'::public.field_type,
       '°', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 20
from public.field_sets fs where fs.key = 'webcam'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'autofocus', 'Autofocus', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'webcam'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'micro_integre', 'Micro intégré', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'webcam'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'connexion', 'Connexion', 'select'::public.field_type,
       NULL, '["USB-A","USB-C"]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'webcam'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'fixation', 'Fixation', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'webcam'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'webcam'
  and fd.key not in ('resolution', 'images_par_seconde', 'champ_vision', 'autofocus', 'micro_integre', 'connexion', 'fixation');

-- Casque audio
insert into public.field_sets (key, name, description)
values ('headset', 'Casque audio', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_casque', 'Type', 'select'::public.field_type,
       NULL, '["Circum-auriculaire","Supra-auriculaire","Intra-auriculaire"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'headset'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'connexion', 'Connexion', 'select'::public.field_type,
       NULL, '["Jack 3.5 mm","USB","Sans fil 2.4 GHz","Bluetooth"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'headset'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'micro', 'Microphone', 'select'::public.field_type,
       NULL, '["Aucun","Intégré","Détachable","Rétractable"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 20
from public.field_sets fs where fs.key = 'headset'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'reduction_bruit', 'Réduction de bruit', 'select'::public.field_type,
       NULL, '["Aucune","Passive","Active (ANC)"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 30
from public.field_sets fs where fs.key = 'headset'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'son_surround', 'Son surround', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'headset'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'impedance', 'Impédance', 'text'::public.field_type,
       'Ω', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'headset'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'autonomie', 'Autonomie', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'headset'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'poids', 'Poids', 'number'::public.field_type,
       'g', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'headset'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'headset'
  and fd.key not in ('type_casque', 'connexion', 'micro', 'reduction_bruit', 'son_surround', 'impedance', 'autonomie', 'poids');

-- Haut-parleurs
insert into public.field_sets (key, name, description)
values ('speaker', 'Haut-parleurs', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'configuration', 'Configuration', 'select'::public.field_type,
       NULL, '["2.0","2.1","5.1","7.1","Enceinte unique","Barre de son"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'speaker'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'puissance', 'Puissance', 'number'::public.field_type,
       'W RMS', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'speaker'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'connexion', 'Connexion', 'select'::public.field_type,
       NULL, '["Jack 3.5 mm","USB","Bluetooth","Optique","HDMI ARC"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 20
from public.field_sets fs where fs.key = 'speaker'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'caisson_basses', 'Caisson de basses', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'speaker'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'alimentation', 'Alimentation', 'select'::public.field_type,
       NULL, '["Secteur","USB","Batterie"]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'speaker'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'autonomie', 'Autonomie', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'speaker'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'speaker'
  and fd.key not in ('configuration', 'puissance', 'connexion', 'caisson_basses', 'alimentation', 'autonomie');

-- Microphone
insert into public.field_sets (key, name, description)
values ('microphone', 'Microphone', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_micro', 'Type', 'select'::public.field_type,
       NULL, '["Dynamique","À condensateur","Cravate","Canon"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'microphone'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'directivite', 'Directivité', 'select'::public.field_type,
       NULL, '["Cardioïde","Omnidirectionnel","Bidirectionnel","Stéréo","Multiple"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'microphone'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'connexion', 'Connexion', 'select'::public.field_type,
       NULL, '["USB","XLR","Jack 3.5 mm","Sans fil"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 20
from public.field_sets fs where fs.key = 'microphone'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'frequence_echantillonnage', 'Fréquence d''échantillonnage', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'microphone'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'accessoires_inclus', 'Accessoires inclus', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'microphone'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'support', 'Support', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'microphone'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'microphone'
  and fd.key not in ('type_micro', 'directivite', 'connexion', 'frequence_echantillonnage', 'accessoires_inclus', 'support');

-- Clé USB
insert into public.field_sets (key, name, description)
values ('usb_flash', 'Clé USB', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'capacite', 'Capacité', 'select'::public.field_type,
       NULL, '["8 Go","16 Go","32 Go","64 Go","128 Go","256 Go","512 Go"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'usb_flash'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'interface', 'Interface', 'select'::public.field_type,
       NULL, '["USB 2.0","USB 3.0","USB 3.2","USB-C","Double connecteur"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'usb_flash'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'vitesse_lecture', 'Vitesse de lecture', 'integer'::public.field_type,
       'Mo/s', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 20
from public.field_sets fs where fs.key = 'usb_flash'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'materiau', 'Matériau', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'usb_flash'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'etanche', 'Résistant à l''eau', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'usb_flash'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'usb_flash'
  and fd.key not in ('capacite', 'interface', 'vitesse_lecture', 'materiau', 'etanche');

-- Carte mémoire
insert into public.field_sets (key, name, description)
values ('memory_card', 'Carte mémoire', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'capacite', 'Capacité', 'select'::public.field_type,
       NULL, '["16 Go","32 Go","64 Go","128 Go","256 Go","512 Go","1 To"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'memory_card'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'format', 'Format', 'select'::public.field_type,
       NULL, '["microSD","SD","CompactFlash","CFexpress"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'memory_card'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'classe_vitesse', 'Classe de vitesse', 'select'::public.field_type,
       NULL, '["Class 10","U1","U3","V30","V60","V90"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 20
from public.field_sets fs where fs.key = 'memory_card'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'vitesse_lecture', 'Vitesse de lecture', 'integer'::public.field_type,
       'Mo/s', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'memory_card'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'vitesse_ecriture', 'Vitesse d''écriture', 'integer'::public.field_type,
       'Mo/s', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'memory_card'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'adaptateur_inclus', 'Adaptateur inclus', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'memory_card'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'memory_card'
  and fd.key not in ('capacite', 'format', 'classe_vitesse', 'vitesse_lecture', 'vitesse_ecriture', 'adaptateur_inclus');

-- Moniteur
insert into public.field_sets (key, name, description)
values ('monitor', 'Moniteur', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'taille_ecran', 'Taille de l''écran', 'select'::public.field_type,
       NULL, '["21.5\"","24\"","27\"","32\"","34\"","49\""]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'monitor'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'resolution', 'Résolution', 'select'::public.field_type,
       NULL, '["1920 x 1080","2560 x 1440","3440 x 1440","3840 x 2160"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'monitor'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'dalle', 'Type de dalle', 'select'::public.field_type,
       NULL, '["TN","VA","IPS","OLED"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 20
from public.field_sets fs where fs.key = 'monitor'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'taux_rafraichissement', 'Taux de rafraîchissement', 'select'::public.field_type,
       NULL, '["60 Hz","75 Hz","100 Hz","144 Hz","165 Hz","180 Hz","240 Hz"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 30
from public.field_sets fs where fs.key = 'monitor'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'temps_reponse', 'Temps de réponse', 'text'::public.field_type,
       'ms', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'monitor'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'connectique', 'Connectique', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'monitor'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'courbe', 'Écran incurvé', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'monitor'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'haut_parleurs', 'Haut-parleurs intégrés', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'monitor'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'pied_reglable', 'Pied réglable', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 80
from public.field_sets fs where fs.key = 'monitor'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'compatibilite_vesa', 'Compatibilité VESA', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 90
from public.field_sets fs where fs.key = 'monitor'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'monitor'
  and fd.key not in ('taille_ecran', 'resolution', 'dalle', 'taux_rafraichissement', 'temps_reponse', 'connectique', 'courbe', 'haut_parleurs', 'pied_reglable', 'compatibilite_vesa');

-- Projecteur
insert into public.field_sets (key, name, description)
values ('projector', 'Projecteur', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'resolution', 'Résolution', 'select'::public.field_type,
       NULL, '["800 x 480","1280 x 720","1920 x 1080","3840 x 2160"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'projector'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'luminosite', 'Luminosité', 'integer'::public.field_type,
       'lumens', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'projector'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'technologie', 'Technologie', 'select'::public.field_type,
       NULL, '["LCD","DLP","LED","Laser"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 20
from public.field_sets fs where fs.key = 'projector'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'contraste', 'Contraste', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'projector'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'distance_projection', 'Distance de projection', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'projector'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'taille_image', 'Taille d''image', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'projector'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'connectique', 'Connectique', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'projector'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'duree_lampe', 'Durée de vie de la lampe', 'text'::public.field_type,
       'h', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'projector'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'haut_parleurs', 'Haut-parleurs intégrés', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 80
from public.field_sets fs where fs.key = 'projector'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'projector'
  and fd.key not in ('resolution', 'luminosite', 'technologie', 'contraste', 'distance_projection', 'taille_image', 'connectique', 'duree_lampe', 'haut_parleurs');

-- Câble / connectique
insert into public.field_sets (key, name, description)
values ('cable', 'Câble / connectique', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_connecteur_a', 'Connecteur A', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, true, false, true, 0
from public.field_sets fs where fs.key = 'cable'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_connecteur_b', 'Connecteur B', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'cable'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'longueur', 'Longueur', 'select'::public.field_type,
       NULL, '["0.5 m","1 m","1.5 m","2 m","3 m","5 m","10 m"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 20
from public.field_sets fs where fs.key = 'cable'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'version', 'Version / norme', 'text'::public.field_type,
       NULL, '[]'::jsonb, 'HDMI 2.1, USB 3.2 Gen 2…', NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'cable'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'debit', 'Débit maximal', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'cable'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'puissance_charge', 'Puissance de charge', 'text'::public.field_type,
       'W', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'cable'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'blindage', 'Blindage', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'cable'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couleur', 'Couleur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'cable'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'cable'
  and fd.key not in ('type_connecteur_a', 'type_connecteur_b', 'longueur', 'version', 'debit', 'puissance_charge', 'blindage', 'couleur');

-- Équipement réseau
insert into public.field_sets (key, name, description)
values ('network_device', 'Équipement réseau', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_equipement', 'Type d''équipement', 'select'::public.field_type,
       NULL, '["Routeur","Switch","Point d''accès","Répéteur","Adaptateur USB","Carte réseau","Powerline"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'network_device'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'normes_wifi', 'Normes Wi-Fi', 'select'::public.field_type,
       NULL, '["Wi-Fi 4","Wi-Fi 5","Wi-Fi 6","Wi-Fi 6E","Wi-Fi 7","Non applicable"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'network_device'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'debit_max', 'Débit maximum', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 20
from public.field_sets fs where fs.key = 'network_device'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'nombre_ports', 'Nombre de ports', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'network_device'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'vitesse_ports', 'Vitesse des ports', 'select'::public.field_type,
       NULL, '["100 Mb/s","1 Gb/s","2.5 Gb/s","10 Gb/s"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 40
from public.field_sets fs where fs.key = 'network_device'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'gestion', 'Gestion', 'select'::public.field_type,
       NULL, '["Non manageable","Manageable","Cloud"]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'network_device'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'poe', 'PoE', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'network_device'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'antennes', 'Antennes', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'network_device'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'network_device'
  and fd.key not in ('type_equipement', 'normes_wifi', 'debit_max', 'nombre_ports', 'vitesse_ports', 'gestion', 'poe', 'antennes');

-- Imprimante
insert into public.field_sets (key, name, description)
values ('printer', 'Imprimante', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'technologie', 'Technologie', 'select'::public.field_type,
       NULL, '["Jet d''encre","Laser monochrome","Laser couleur","Sublimation","Matricielle"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'printer'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'fonctions', 'Fonctions', 'select'::public.field_type,
       NULL, '["Impression seule","Multifonction 3-en-1","Multifonction 4-en-1"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'printer'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couleur_impression', 'Impression couleur', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 20
from public.field_sets fs where fs.key = 'printer'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'format_max', 'Format maximum', 'select'::public.field_type,
       NULL, '["A4","A3","A3+"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 30
from public.field_sets fs where fs.key = 'printer'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'vitesse_impression', 'Vitesse d''impression', 'text'::public.field_type,
       'ppm', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'printer'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'resolution_impression', 'Résolution', 'text'::public.field_type,
       'dpi', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'printer'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'recto_verso', 'Recto-verso automatique', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'printer'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'connectivite', 'Connectivité', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'printer'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'capacite_bac', 'Capacité du bac', 'text'::public.field_type,
       'feuilles', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 80
from public.field_sets fs where fs.key = 'printer'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'consommables_compatibles', 'Consommables compatibles', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 90
from public.field_sets fs where fs.key = 'printer'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'printer'
  and fd.key not in ('technologie', 'fonctions', 'couleur_impression', 'format_max', 'vitesse_impression', 'resolution_impression', 'recto_verso', 'connectivite', 'capacite_bac', 'consommables_compatibles');

-- Consommable d'impression
insert into public.field_sets (key, name, description)
values ('printer_consumable', 'Consommable d''impression', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_consommable', 'Type', 'select'::public.field_type,
       NULL, '["Cartouche d''encre","Toner","Tambour","Kit de maintenance","Ruban"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'printer_consumable'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couleur_consommable', 'Couleur', 'select'::public.field_type,
       NULL, '["Noir","Cyan","Magenta","Jaune","Tricolore","Pack multicolore"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'printer_consumable'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'reference_constructeur', 'Référence constructeur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 20
from public.field_sets fs where fs.key = 'printer_consumable'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'imprimantes_compatibles', 'Imprimantes compatibles', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'printer_consumable'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'rendement', 'Rendement', 'integer'::public.field_type,
       'pages', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'printer_consumable'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'origine', 'Origine', 'select'::public.field_type,
       NULL, '["Original","Compatible","Reconditionné"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 50
from public.field_sets fs where fs.key = 'printer_consumable'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'contenance', 'Contenance', 'text'::public.field_type,
       'ml', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'printer_consumable'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'printer_consumable'
  and fd.key not in ('type_consommable', 'couleur_consommable', 'reference_constructeur', 'imprimantes_compatibles', 'rendement', 'origine', 'contenance');

-- Calculatrice
insert into public.field_sets (key, name, description)
values ('calculator', 'Calculatrice', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_calculatrice', 'Type', 'select'::public.field_type,
       NULL, '["Standard","Scientifique","Graphique","Financière","De bureau","À imprimante"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'calculator'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'nombre_fonctions', 'Nombre de fonctions', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'calculator'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'affichage', 'Affichage', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 20
from public.field_sets fs where fs.key = 'calculator'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'alimentation', 'Alimentation', 'select'::public.field_type,
       NULL, '["Pile","Solaire","Solaire + pile","Rechargeable"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 30
from public.field_sets fs where fs.key = 'calculator'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'mode_examen', 'Mode examen', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'calculator'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'programmable', 'Programmable', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'calculator'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'etui_inclus', 'Étui inclus', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'calculator'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'dimensions', 'Dimensions', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'calculator'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'calculator'
  and fd.key not in ('type_calculatrice', 'nombre_fonctions', 'affichage', 'alimentation', 'mode_examen', 'programmable', 'etui_inclus', 'dimensions');

-- Accessoire informatique
insert into public.field_sets (key, name, description)
values ('computer_accessory', 'Accessoire informatique', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_accessoire', 'Type d''accessoire', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, true, false, true, 0
from public.field_sets fs where fs.key = 'computer_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'compatibilite', 'Compatibilité', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'computer_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'connexion', 'Connexion', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 20
from public.field_sets fs where fs.key = 'computer_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'materiau', 'Matériau', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'computer_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couleur', 'Couleur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'computer_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'dimensions', 'Dimensions', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'computer_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'contenu', 'Contenu de l''emballage', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'computer_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'computer_accessory'
  and fd.key not in ('type_accessoire', 'compatibilite', 'connexion', 'materiau', 'couleur', 'dimensions', 'contenu');

-- Instrument d'écriture
insert into public.field_sets (key, name, description)
values ('writing_instrument', 'Instrument d''écriture', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_instrument', 'Type', 'select'::public.field_type,
       NULL, '["Stylo bille","Stylo gel","Stylo plume","Roller","Crayon graphite","Porte-mine","Marqueur permanent","Marqueur effaçable","Surligneur","Feutre","Craie"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'writing_instrument'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couleur_encre', 'Couleur', 'select'::public.field_type,
       NULL, '["Noir","Bleu","Rouge","Vert","Assorti","Multicolore"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'writing_instrument'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'epaisseur_trait', 'Épaisseur du trait', 'text'::public.field_type,
       'mm', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 20
from public.field_sets fs where fs.key = 'writing_instrument'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'pointe', 'Type de pointe', 'select'::public.field_type,
       NULL, '["Fine","Moyenne","Large","Biseautée","Ogive"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 30
from public.field_sets fs where fs.key = 'writing_instrument'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'rechargeable', 'Rechargeable', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'writing_instrument'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'effacable', 'Effaçable', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'writing_instrument'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'quantite_lot', 'Quantité par lot', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 60
from public.field_sets fs where fs.key = 'writing_instrument'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'grip', 'Zone de préhension', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'writing_instrument'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'writing_instrument'
  and fd.key not in ('type_instrument', 'couleur_encre', 'epaisseur_trait', 'pointe', 'rechargeable', 'effacable', 'quantite_lot', 'grip');

-- Cahier / bloc
insert into public.field_sets (key, name, description)
values ('notebook', 'Cahier / bloc', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'nombre_pages', 'Nombre de pages', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, true, false, true, 0
from public.field_sets fs where fs.key = 'notebook'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'format', 'Format', 'select'::public.field_type,
       NULL, '["A7","A6","A5","A4","A3","17x22","21x29.7","24x32"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'notebook'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'reglure', 'Réglure', 'select'::public.field_type,
       NULL, '["Seyès","Ligné","Quadrillé 5x5","Petits carreaux","Uni","Pointillé","Musique"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 20
from public.field_sets fs where fs.key = 'notebook'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_papier', 'Type de papier', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'notebook'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'grammage', 'Grammage', 'integer'::public.field_type,
       'g/m²', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'notebook'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couverture', 'Couverture', 'select'::public.field_type,
       NULL, '["Souple","Rigide","Polypropylène","Cartonnée"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 50
from public.field_sets fs where fs.key = 'notebook'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'reliure', 'Reliure', 'select'::public.field_type,
       NULL, '["Agrafée","Spirale","Collée","Cousue"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 60
from public.field_sets fs where fs.key = 'notebook'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couleur', 'Couleur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'notebook'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'dimensions', 'Dimensions', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 80
from public.field_sets fs where fs.key = 'notebook'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'quantite_lot', 'Quantité par lot', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 90
from public.field_sets fs where fs.key = 'notebook'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'notebook'
  and fd.key not in ('nombre_pages', 'format', 'reglure', 'type_papier', 'grammage', 'couverture', 'reliure', 'couleur', 'dimensions', 'quantite_lot');

-- Matériel de dessin et d'art
insert into public.field_sets (key, name, description)
values ('art_supply', 'Matériel de dessin et d''art', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_materiel', 'Type de matériel', 'select'::public.field_type,
       NULL, '["Crayons de couleur","Crayons de cire","Pastels","Peinture","Pinceaux","Papier","Toile","Kit complet"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'art_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'nombre_couleurs', 'Nombre de couleurs', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'art_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'support', 'Support recommandé', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 20
from public.field_sets fs where fs.key = 'art_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'lavable', 'Lavable', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'art_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'toxicite', 'Conformité / non-toxique', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'art_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'age_recommande', 'Âge recommandé', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'art_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'format', 'Format', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'art_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'contenu', 'Contenu de l''emballage', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'art_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'art_supply'
  and fd.key not in ('type_materiel', 'nombre_couleurs', 'support', 'lavable', 'toxicite', 'age_recommande', 'format', 'contenu');

-- Instrument de géométrie
insert into public.field_sets (key, name, description)
values ('geometry_tool', 'Instrument de géométrie', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_instrument', 'Type', 'select'::public.field_type,
       NULL, '["Boîte complète","Règle","Équerre","Rapporteur","Compas","Té"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'geometry_tool'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'longueur', 'Longueur / taille', 'text'::public.field_type,
       'cm', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'geometry_tool'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'materiau', 'Matériau', 'select'::public.field_type,
       NULL, '["Plastique","Métal","Bois","Aluminium"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 20
from public.field_sets fs where fs.key = 'geometry_tool'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'graduation', 'Graduation', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'geometry_tool'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'contenu', 'Contenu de la boîte', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'geometry_tool'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'etui_inclus', 'Étui inclus', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'geometry_tool'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'geometry_tool'
  and fd.key not in ('type_instrument', 'longueur', 'materiau', 'graduation', 'contenu', 'etui_inclus');

-- Produit de correction
insert into public.field_sets (key, name, description)
values ('correction_supply', 'Produit de correction', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_correction', 'Type', 'select'::public.field_type,
       NULL, '["Gomme","Correcteur liquide","Correcteur en ruban","Effaceur","Stylo correcteur"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'correction_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'contenance', 'Contenance', 'text'::public.field_type,
       'ml', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'correction_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'longueur_ruban', 'Longueur du ruban', 'text'::public.field_type,
       'm', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 20
from public.field_sets fs where fs.key = 'correction_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'largeur_ruban', 'Largeur du ruban', 'text'::public.field_type,
       'mm', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'correction_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'sechage_rapide', 'Séchage rapide', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'correction_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'rechargeable', 'Rechargeable', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'correction_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'quantite_lot', 'Quantité par lot', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'correction_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'correction_supply'
  and fd.key not in ('type_correction', 'contenance', 'longueur_ruban', 'largeur_ruban', 'sechage_rapide', 'rechargeable', 'quantite_lot');

-- Découpage et taille
insert into public.field_sets (key, name, description)
values ('cutting_tool', 'Découpage et taille', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_outil', 'Type', 'select'::public.field_type,
       NULL, '["Ciseaux scolaires","Ciseaux de bureau","Cutter","Taille-crayon simple","Taille-crayon double","Taille-crayon électrique"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'cutting_tool'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'longueur_lame', 'Longueur de lame', 'text'::public.field_type,
       'cm', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'cutting_tool'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'materiau_lame', 'Matériau de la lame', 'select'::public.field_type,
       NULL, '["Acier inoxydable","Acier carbone","Plastique"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 20
from public.field_sets fs where fs.key = 'cutting_tool'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'bout_rond', 'Bout rond (sécurité enfant)', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'cutting_tool'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'reservoir', 'Avec réservoir', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'cutting_tool'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'gaucher', 'Adapté aux gauchers', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'cutting_tool'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'age_recommande', 'Âge recommandé', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'cutting_tool'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'cutting_tool'
  and fd.key not in ('type_outil', 'longueur_lame', 'materiau_lame', 'bout_rond', 'reservoir', 'gaucher', 'age_recommande');

-- Colle et adhésif
insert into public.field_sets (key, name, description)
values ('adhesive', 'Colle et adhésif', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_colle', 'Type', 'select'::public.field_type,
       NULL, '["Colle en bâton","Colle liquide","Colle en gel","Colle forte","Silicone","Ruban adhésif","Pâte adhésive"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'adhesive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'contenance', 'Contenance', 'text'::public.field_type,
       'g / ml', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'adhesive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'supports', 'Supports compatibles', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 20
from public.field_sets fs where fs.key = 'adhesive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'temps_sechage', 'Temps de séchage', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'adhesive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'repositionnable', 'Repositionnable', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'adhesive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'lavable', 'Lavable', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'adhesive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'sans_solvant', 'Sans solvant', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'adhesive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'quantite_lot', 'Quantité par lot', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'adhesive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'adhesive'
  and fd.key not in ('type_colle', 'contenance', 'supports', 'temps_sechage', 'repositionnable', 'lavable', 'sans_solvant', 'quantite_lot');

-- Trousse et kit scolaire
insert into public.field_sets (key, name, description)
values ('school_kit', 'Trousse et kit scolaire', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_article', 'Type', 'select'::public.field_type,
       NULL, '["Trousse simple","Trousse double","Trousse garnie","Kit scolaire complet","Accessoire"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'school_kit'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'contenu', 'Contenu', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'school_kit'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'materiau', 'Matériau', 'select'::public.field_type,
       NULL, '["Polyester","Toile","Cuir synthétique","Plastique","Métal"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 20
from public.field_sets fs where fs.key = 'school_kit'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'nombre_compartiments', 'Nombre de compartiments', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'school_kit'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'fermeture', 'Fermeture', 'select'::public.field_type,
       NULL, '["Zip","Rabat","Bouton pression","Élastique"]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'school_kit'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couleur', 'Couleur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'school_kit'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'dimensions', 'Dimensions', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'school_kit'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'niveau_scolaire', 'Niveau scolaire', 'select'::public.field_type,
       NULL, '["Maternelle","Primaire","Collège","Lycée","Supérieur"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 70
from public.field_sets fs where fs.key = 'school_kit'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'school_kit'
  and fd.key not in ('type_article', 'contenu', 'materiau', 'nombre_compartiments', 'fermeture', 'couleur', 'dimensions', 'niveau_scolaire');

-- Jeu vidéo
insert into public.field_sets (key, name, description)
values ('video_game', 'Jeu vidéo', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'plateforme', 'Plateforme', 'select'::public.field_type,
       NULL, '["PC","PlayStation 5","PlayStation 4","Xbox Series X|S","Xbox One","Nintendo Switch","Nintendo Switch 2"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'video_game'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'genre', 'Genre', 'select'::public.field_type,
       NULL, '["Action","Aventure","RPG","FPS","Sport","Course","Stratégie","Simulation","Combat","Famille","Horreur"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'video_game'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'support', 'Support', 'select'::public.field_type,
       NULL, '["Boîte physique","Clé numérique","Code de téléchargement"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 20
from public.field_sets fs where fs.key = 'video_game'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'edition', 'Édition', 'select'::public.field_type,
       NULL, '["Standard","Deluxe","Gold","Ultimate","Collector"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 30
from public.field_sets fs where fs.key = 'video_game'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'classification', 'Classification PEGI', 'select'::public.field_type,
       NULL, '["PEGI 3","PEGI 7","PEGI 12","PEGI 16","PEGI 18"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 40
from public.field_sets fs where fs.key = 'video_game'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'langue', 'Langues', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'video_game'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'multijoueur', 'Multijoueur', 'select'::public.field_type,
       NULL, '["Solo","Multijoueur local","Multijoueur en ligne","Solo et multijoueur"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 60
from public.field_sets fs where fs.key = 'video_game'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'editeur', 'Éditeur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'video_game'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'date_sortie', 'Date de sortie', 'date'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 80
from public.field_sets fs where fs.key = 'video_game'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'video_game'
  and fd.key not in ('plateforme', 'genre', 'support', 'edition', 'classification', 'langue', 'multijoueur', 'editeur', 'date_sortie');

-- Carte cadeau et abonnement
insert into public.field_sets (key, name, description)
values ('gift_card', 'Carte cadeau et abonnement', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'plateforme', 'Plateforme', 'select'::public.field_type,
       NULL, '["PlayStation Network","Xbox","Nintendo eShop","Steam","Google Play","Apple","Autre"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'gift_card'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'valeur', 'Valeur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'gift_card'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'duree', 'Durée de l''abonnement', 'select'::public.field_type,
       NULL, '["1 mois","3 mois","6 mois","12 mois","Sans expiration"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 20
from public.field_sets fs where fs.key = 'gift_card'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'region', 'Région', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, 'Zone dans laquelle le code est valable.',
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'gift_card'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'mode_livraison', 'Mode de livraison', 'select'::public.field_type,
       NULL, '["Code par e-mail","Carte physique"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 40
from public.field_sets fs where fs.key = 'gift_card'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'conditions', 'Conditions d''utilisation', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'gift_card'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'gift_card'
  and fd.key not in ('plateforme', 'valeur', 'duree', 'region', 'mode_livraison', 'conditions');

-- Console de jeu
insert into public.field_sets (key, name, description)
values ('console', 'Console de jeu', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'marque_console', 'Famille de console', 'select'::public.field_type,
       NULL, '["PlayStation","Xbox","Nintendo","Rétro","Portable Android","Autre"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'console'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'modele_console', 'Modèle', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'console'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'stockage', 'Stockage', 'select'::public.field_type,
       NULL, '["64 Go","256 Go","512 Go","825 Go","1 To","2 To"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 20
from public.field_sets fs where fs.key = 'console'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'lecteur_disque', 'Lecteur de disque', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 30
from public.field_sets fs where fs.key = 'console'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'resolution_max', 'Résolution maximale', 'select'::public.field_type,
       NULL, '["1080p","1440p","4K","8K"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 40
from public.field_sets fs where fs.key = 'console'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'manettes_incluses', 'Manettes incluses', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'console'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'jeux_inclus', 'Jeux inclus', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'console'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'etat', 'État', 'select'::public.field_type,
       NULL, '["Neuf","Reconditionné"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 70
from public.field_sets fs where fs.key = 'console'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'contenu', 'Contenu de la boîte', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 80
from public.field_sets fs where fs.key = 'console'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'console'
  and fd.key not in ('marque_console', 'modele_console', 'stockage', 'lecteur_disque', 'resolution_max', 'manettes_incluses', 'jeux_inclus', 'etat', 'contenu');

-- Manette
insert into public.field_sets (key, name, description)
values ('gaming_controller', 'Manette', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'plateforme', 'Plateforme', 'select'::public.field_type,
       NULL, '["PlayStation 5","PlayStation 4","Xbox Series X|S","Xbox One","Nintendo Switch","PC","Multiplateforme"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'gaming_controller'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'compatibilite', 'Compatibilité', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'gaming_controller'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'connexion', 'Connexion', 'select'::public.field_type,
       NULL, '["Filaire USB","Sans fil 2.4 GHz","Bluetooth","Hybride"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 20
from public.field_sets fs where fs.key = 'gaming_controller'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'bluetooth', 'Bluetooth', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'gaming_controller'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'usb', 'USB', 'select'::public.field_type,
       NULL, '["USB-A","USB-C","Non applicable"]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'gaming_controller'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'sans_fil', 'Sans fil', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'gaming_controller'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'batterie', 'Batterie', 'select'::public.field_type,
       NULL, '["Rechargeable intégrée","Piles AA","Batterie amovible","Filaire"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 60
from public.field_sets fs where fs.key = 'gaming_controller'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'autonomie', 'Autonomie', 'text'::public.field_type,
       'h', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'gaming_controller'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'vibration', 'Retour haptique / vibration', 'select'::public.field_type,
       NULL, '["Aucun","Vibration simple","Retour haptique avancé","Gâchettes adaptatives"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 80
from public.field_sets fs where fs.key = 'gaming_controller'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couleur', 'Couleur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 90
from public.field_sets fs where fs.key = 'gaming_controller'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'poids', 'Poids', 'number'::public.field_type,
       'g', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 100
from public.field_sets fs where fs.key = 'gaming_controller'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'boutons_programmables', 'Boutons programmables', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 110
from public.field_sets fs where fs.key = 'gaming_controller'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'gaming_controller'
  and fd.key not in ('plateforme', 'compatibilite', 'connexion', 'bluetooth', 'usb', 'sans_fil', 'batterie', 'autonomie', 'vibration', 'couleur', 'poids', 'boutons_programmables');

-- Périphérique gaming
insert into public.field_sets (key, name, description)
values ('gaming_peripheral', 'Périphérique gaming', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_peripherique', 'Type', 'select'::public.field_type,
       NULL, '["Volant","Pédalier","Levier de vitesse","Joystick","Palonnier","Arcade stick"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'gaming_peripheral'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'plateforme', 'Plateformes compatibles', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'gaming_peripheral'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'retour_force', 'Retour de force', 'select'::public.field_type,
       NULL, '["Aucun","Vibration","Retour de force","Direct Drive"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 20
from public.field_sets fs where fs.key = 'gaming_peripheral'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'angle_rotation', 'Angle de rotation', 'text'::public.field_type,
       '°', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'gaming_peripheral'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'materiau', 'Matériau', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'gaming_peripheral'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'fixation', 'Fixation', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'gaming_peripheral'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'pedales_incluses', 'Pédalier inclus', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'gaming_peripheral'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'gaming_peripheral'
  and fd.key not in ('type_peripherique', 'plateforme', 'retour_force', 'angle_rotation', 'materiau', 'fixation', 'pedales_incluses');

-- Mobilier gaming
insert into public.field_sets (key, name, description)
values ('gaming_furniture', 'Mobilier gaming', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_mobilier', 'Type', 'select'::public.field_type,
       NULL, '["Fauteuil gaming","Chaise de bureau","Bureau gaming","Support écran","Support casque"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'gaming_furniture'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'materiau', 'Matériau', 'select'::public.field_type,
       NULL, '["Similicuir","Tissu","Mesh","Bois","Métal","Verre trempé"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'gaming_furniture'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'charge_max', 'Charge maximale', 'integer'::public.field_type,
       'kg', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 20
from public.field_sets fs where fs.key = 'gaming_furniture'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'reglages', 'Réglages', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'gaming_furniture'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'inclinaison', 'Inclinaison du dossier', 'text'::public.field_type,
       '°', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'gaming_furniture'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'accoudoirs', 'Accoudoirs', 'select'::public.field_type,
       NULL, '["Fixes","2D","3D","4D","Sans accoudoirs"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 50
from public.field_sets fs where fs.key = 'gaming_furniture'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'dimensions_plateau', 'Dimensions du plateau', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'gaming_furniture'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'hauteur_reglable', 'Hauteur réglable', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'gaming_furniture'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couleur', 'Couleur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 80
from public.field_sets fs where fs.key = 'gaming_furniture'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'montage_requis', 'Montage requis', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 90
from public.field_sets fs where fs.key = 'gaming_furniture'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'gaming_furniture'
  and fd.key not in ('type_mobilier', 'materiau', 'charge_max', 'reglages', 'inclinaison', 'accoudoirs', 'dimensions_plateau', 'hauteur_reglable', 'couleur', 'montage_requis');

-- Accessoire gaming
insert into public.field_sets (key, name, description)
values ('gaming_accessory', 'Accessoire gaming', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_accessoire', 'Type d''accessoire', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, true, false, true, 0
from public.field_sets fs where fs.key = 'gaming_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'plateforme', 'Plateformes compatibles', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'gaming_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'connexion', 'Connexion', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 20
from public.field_sets fs where fs.key = 'gaming_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'rgb', 'Éclairage RGB', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'gaming_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'dimensions', 'Dimensions', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'gaming_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'materiau', 'Matériau', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'gaming_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couleur', 'Couleur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'gaming_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'contenu', 'Contenu de l''emballage', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'gaming_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'gaming_accessory'
  and fd.key not in ('type_accessoire', 'plateforme', 'connexion', 'rgb', 'dimensions', 'materiau', 'couleur', 'contenu');

-- Classement et organisation
insert into public.field_sets (key, name, description)
values ('filing_supply', 'Classement et organisation', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_classement', 'Type', 'select'::public.field_type,
       NULL, '["Classeur à levier","Classeur à anneaux","Chemise","Sous-chemise","Dossier suspendu","Porte-documents","Boîte de classement","Trieur"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'filing_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'format', 'Format', 'select'::public.field_type,
       NULL, '["A4","A5","A3","Folio"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'filing_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'capacite', 'Capacité', 'text'::public.field_type,
       'feuilles', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 20
from public.field_sets fs where fs.key = 'filing_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'dos', 'Largeur du dos', 'text'::public.field_type,
       'mm', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'filing_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'materiau', 'Matériau', 'select'::public.field_type,
       NULL, '["Carton","Carton plastifié","Polypropylène","Kraft"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 40
from public.field_sets fs where fs.key = 'filing_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'nombre_anneaux', 'Nombre d''anneaux', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'filing_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couleur', 'Couleur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'filing_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'quantite_lot', 'Quantité par lot', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'filing_supply'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'filing_supply'
  and fd.key not in ('type_classement', 'format', 'capacite', 'dos', 'materiau', 'nombre_anneaux', 'couleur', 'quantite_lot');

-- Agrafage
insert into public.field_sets (key, name, description)
values ('stapler', 'Agrafage', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_agrafage', 'Type', 'select'::public.field_type,
       NULL, '["Agrafeuse de bureau","Agrafeuse pince","Agrafeuse longue portée","Agrafes","Dégrafeuse"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'stapler'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'capacite_agrafage', 'Capacité d''agrafage', 'integer'::public.field_type,
       'feuilles', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'stapler'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_agrafes', 'Type d''agrafes', 'select'::public.field_type,
       NULL, '["24/6","26/6","23/8","23/10","No 10"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 20
from public.field_sets fs where fs.key = 'stapler'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'materiau', 'Matériau', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'stapler'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'quantite_lot', 'Quantité par boîte', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'stapler'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couleur', 'Couleur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'stapler'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'stapler'
  and fd.key not in ('type_agrafage', 'capacite_agrafage', 'type_agrafes', 'materiau', 'quantite_lot', 'couleur');

-- Adhésif de bureau
insert into public.field_sets (key, name, description)
values ('office_adhesive', 'Adhésif de bureau', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_adhesif', 'Type', 'select'::public.field_type,
       NULL, '["Ruban transparent","Ruban d''emballage","Ruban de masquage","Ruban double-face","Dévidoir"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'office_adhesive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'largeur', 'Largeur', 'text'::public.field_type,
       'mm', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'office_adhesive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'longueur', 'Longueur', 'text'::public.field_type,
       'm', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 20
from public.field_sets fs where fs.key = 'office_adhesive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couleur', 'Couleur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'office_adhesive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'repositionnable', 'Repositionnable', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'office_adhesive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'quantite_lot', 'Quantité par lot', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'office_adhesive'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'office_adhesive'
  and fd.key not in ('type_adhesif', 'largeur', 'longueur', 'couleur', 'repositionnable', 'quantite_lot');

-- Fixation
insert into public.field_sets (key, name, description)
values ('fastener', 'Fixation', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_fixation', 'Type', 'select'::public.field_type,
       NULL, '["Trombone","Pince double-clip","Élastique","Punaise","Crochet adhésif","Attache-lettre"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'fastener'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'taille', 'Taille', 'text'::public.field_type,
       'mm', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'fastener'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'materiau', 'Matériau', 'select'::public.field_type,
       NULL, '["Métal","Métal gainé","Plastique","Caoutchouc"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 20
from public.field_sets fs where fs.key = 'fastener'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'quantite_lot', 'Quantité par boîte', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 30
from public.field_sets fs where fs.key = 'fastener'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couleur', 'Couleur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'fastener'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'charge_max', 'Charge maximale', 'text'::public.field_type,
       'kg', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'fastener'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'fastener'
  and fd.key not in ('type_fixation', 'taille', 'materiau', 'quantite_lot', 'couleur', 'charge_max');

-- Papeterie
insert into public.field_sets (key, name, description)
values ('office_paper', 'Papeterie', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_papier', 'Type', 'select'::public.field_type,
       NULL, '["Papier d''impression","Bloc-notes","Post-it","Enveloppe","Papier couleur","Papier photo"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'office_paper'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'format', 'Format', 'select'::public.field_type,
       NULL, '["A6","A5","A4","A3","DL","C5","C4"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'office_paper'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'grammage', 'Grammage', 'select'::public.field_type,
       NULL, '["70 g/m²","80 g/m²","90 g/m²","100 g/m²","120 g/m²","160 g/m²","200 g/m²"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 20
from public.field_sets fs where fs.key = 'office_paper'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'quantite', 'Quantité', 'integer'::public.field_type,
       'feuilles', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 30
from public.field_sets fs where fs.key = 'office_paper'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'blancheur', 'Blancheur / couleur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'office_paper'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'fenetre', 'Avec fenêtre', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'office_paper'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'fermeture', 'Fermeture', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'office_paper'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'certification', 'Certification environnementale', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'office_paper'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'office_paper'
  and fd.key not in ('type_papier', 'format', 'grammage', 'quantite', 'blancheur', 'fenetre', 'fermeture', 'certification');

-- Tampon et cachet
insert into public.field_sets (key, name, description)
values ('stamp', 'Tampon et cachet', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_tampon', 'Type', 'select'::public.field_type,
       NULL, '["Tampon auto-encreur","Tampon bois","Tampon dateur","Tampon personnalisable","Encreur","Recharge d''encre"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'stamp'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'personnalisable', 'Personnalisable', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'stamp'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'nombre_lignes', 'Nombre de lignes', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 20
from public.field_sets fs where fs.key = 'stamp'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'dimensions_empreinte', 'Dimensions de l''empreinte', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 30
from public.field_sets fs where fs.key = 'stamp'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couleur_encre', 'Couleur d''encre', 'select'::public.field_type,
       NULL, '["Noir","Bleu","Rouge","Vert","Violet"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 40
from public.field_sets fs where fs.key = 'stamp'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'nombre_empreintes', 'Nombre d''empreintes', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'stamp'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'stamp'
  and fd.key not in ('type_tampon', 'personnalisable', 'nombre_lignes', 'dimensions_empreinte', 'couleur_encre', 'nombre_empreintes');

-- Accessoire de bureau
insert into public.field_sets (key, name, description)
values ('office_accessory', 'Accessoire de bureau', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_accessoire', 'Type d''accessoire', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, true, false, true, 0
from public.field_sets fs where fs.key = 'office_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'materiau', 'Matériau', 'select'::public.field_type,
       NULL, '["Plastique","Métal","Bois","Verre","Cuir synthétique"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'office_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'nombre_compartiments', 'Nombre de compartiments', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 20
from public.field_sets fs where fs.key = 'office_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couleur', 'Couleur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'office_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'dimensions', 'Dimensions', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'office_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'contenu', 'Contenu de l''emballage', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'office_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'office_accessory'
  and fd.key not in ('type_accessoire', 'materiau', 'nombre_compartiments', 'couleur', 'dimensions', 'contenu');

-- Produit ménager
insert into public.field_sets (key, name, description)
values ('cleaning_product', 'Produit ménager', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_produit', 'Type de produit', 'select'::public.field_type,
       NULL, '["Nettoyant multi-surfaces","Désinfectant","Lessive","Adoucissant","Liquide vaisselle","Détartrant","Javel","Entretien sol"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'cleaning_product'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'contenance', 'Contenance', 'text'::public.field_type,
       'L / kg', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'cleaning_product'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'forme', 'Forme', 'select'::public.field_type,
       NULL, '["Liquide","Poudre","Gel","Capsules","Spray","Lingettes"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 20
from public.field_sets fs where fs.key = 'cleaning_product'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'parfum', 'Parfum', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'cleaning_product'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'surfaces', 'Surfaces compatibles', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'cleaning_product'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'mode_utilisation', 'Mode d''utilisation', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'cleaning_product'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'precautions', 'Précautions d''emploi', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'cleaning_product'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'ecologique', 'Formule écologique', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'cleaning_product'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'nombre_doses', 'Nombre de doses / lavages', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 80
from public.field_sets fs where fs.key = 'cleaning_product'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'cleaning_product'
  and fd.key not in ('type_produit', 'contenance', 'forme', 'parfum', 'surfaces', 'mode_utilisation', 'precautions', 'ecologique', 'nombre_doses');

-- Ustensile de cuisine
insert into public.field_sets (key, name, description)
values ('kitchenware', 'Ustensile de cuisine', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_ustensile', 'Type', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, true, false, true, 0
from public.field_sets fs where fs.key = 'kitchenware'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'materiau', 'Matériau', 'select'::public.field_type,
       NULL, '["Inox","Aluminium","Plastique alimentaire","Silicone","Bois","Céramique","Verre","Fonte"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'kitchenware'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'capacite', 'Capacité', 'text'::public.field_type,
       'L', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 20
from public.field_sets fs where fs.key = 'kitchenware'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'dimensions', 'Dimensions', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'kitchenware'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'compatible_lave_vaisselle', 'Compatible lave-vaisselle', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'kitchenware'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'compatible_induction', 'Compatible induction', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'kitchenware'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'passe_au_four', 'Passe au four', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'kitchenware'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'quantite_lot', 'Quantité par lot', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'kitchenware'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'kitchenware'
  and fd.key not in ('type_ustensile', 'materiau', 'capacite', 'dimensions', 'compatible_lave_vaisselle', 'compatible_induction', 'passe_au_four', 'quantite_lot');

-- Rangement et contenant
insert into public.field_sets (key, name, description)
values ('storage_container', 'Rangement et contenant', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_rangement', 'Type', 'select'::public.field_type,
       NULL, '["Boîte hermétique","Boîte de rangement","Panier","Bac","Organisateur","Crochet","Étagère"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'storage_container'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'capacite', 'Capacité', 'text'::public.field_type,
       'L', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'storage_container'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'materiau', 'Matériau', 'select'::public.field_type,
       NULL, '["Plastique","Verre","Inox","Osier","Tissu","Bambou"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 20
from public.field_sets fs where fs.key = 'storage_container'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'hermetique', 'Hermétique', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'storage_container'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'empilable', 'Empilable', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'storage_container'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'dimensions', 'Dimensions', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'storage_container'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couleur', 'Couleur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'storage_container'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'quantite_lot', 'Quantité par lot', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'storage_container'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'storage_container'
  and fd.key not in ('type_rangement', 'capacite', 'materiau', 'hermetique', 'empilable', 'dimensions', 'couleur', 'quantite_lot');

-- Éclairage
insert into public.field_sets (key, name, description)
values ('lighting', 'Éclairage', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_eclairage', 'Type', 'select'::public.field_type,
       NULL, '["Ampoule LED","Ampoule rechargeable","Tube LED","Lampe de bureau","Lampe torche","Projecteur","Guirlande","Applique"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'lighting'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'culot', 'Culot', 'select'::public.field_type,
       NULL, '["E27","E14","B22","GU10","G9","Non applicable"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'lighting'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'puissance', 'Puissance', 'text'::public.field_type,
       'W', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 20
from public.field_sets fs where fs.key = 'lighting'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'flux_lumineux', 'Flux lumineux', 'integer'::public.field_type,
       'lumens', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'lighting'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'temperature_couleur', 'Température de couleur', 'select'::public.field_type,
       NULL, '["Blanc chaud (2700K)","Blanc neutre (4000K)","Blanc froid (6500K)","RGB"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 40
from public.field_sets fs where fs.key = 'lighting'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'autonomie', 'Autonomie', 'text'::public.field_type,
       'h', '[]'::jsonb, NULL, 'Modèles rechargeables uniquement.',
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'lighting'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'duree_vie', 'Durée de vie', 'text'::public.field_type,
       'h', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'lighting'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'dimmable', 'Variable (dimmable)', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'lighting'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'etanche', 'Indice de protection', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 80
from public.field_sets fs where fs.key = 'lighting'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'quantite_lot', 'Quantité par lot', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 90
from public.field_sets fs where fs.key = 'lighting'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'lighting'
  and fd.key not in ('type_eclairage', 'culot', 'puissance', 'flux_lumineux', 'temperature_couleur', 'autonomie', 'duree_vie', 'dimmable', 'etanche', 'quantite_lot');

-- Pile et batterie
insert into public.field_sets (key, name, description)
values ('battery', 'Pile et batterie', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'format_pile', 'Format', 'select'::public.field_type,
       NULL, '["AA (LR6)","AAA (LR03)","C (LR14)","D (LR20)","9V (6LR61)","Bouton CR2032","18650","Batterie externe"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'battery'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'technologie', 'Technologie', 'select'::public.field_type,
       NULL, '["Alcaline","Lithium","NiMH rechargeable","Li-ion","Zinc-carbone"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'battery'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'capacite', 'Capacité', 'text'::public.field_type,
       'mAh', '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 20
from public.field_sets fs where fs.key = 'battery'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'tension', 'Tension', 'text'::public.field_type,
       'V', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'battery'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'rechargeable', 'Rechargeable', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'battery'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'nombre_cycles', 'Nombre de cycles', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'battery'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'quantite_lot', 'Quantité par lot', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 60
from public.field_sets fs where fs.key = 'battery'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'date_expiration', 'Date limite d''utilisation', 'date'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'battery'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'battery'
  and fd.key not in ('format_pile', 'technologie', 'capacite', 'tension', 'rechargeable', 'nombre_cycles', 'quantite_lot', 'date_expiration');

-- Produit alimentaire
insert into public.field_sets (key, name, description)
values ('food', 'Produit alimentaire', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_aliment', 'Type de produit', 'select'::public.field_type,
       NULL, '["Snack salé","Biscuit","Bonbon","Chocolat","Boisson gazeuse","Jus","Eau","Café","Thé","Épicerie sèche","Conserve"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'food'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'poids_volume', 'Poids / volume net', 'text'::public.field_type,
       'g / ml', '[]'::jsonb, NULL, NULL,
       NULL, true, false, true, 10
from public.field_sets fs where fs.key = 'food'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'ingredients', 'Ingrédients', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, true, false, false, 20
from public.field_sets fs where fs.key = 'food'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'allergenes', 'Allergènes', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, 'Mentionner clairement gluten, arachides, lait, œufs, fruits à coque…',
       NULL, false, false, true, 30
from public.field_sets fs where fs.key = 'food'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'valeurs_nutritionnelles', 'Valeurs nutritionnelles', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, 'Pour 100 g ou 100 ml.',
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'food'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'date_fabrication', 'Date de fabrication', 'date'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'food'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'date_expiration', 'Date de péremption', 'date'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, true, false, true, 60
from public.field_sets fs where fs.key = 'food'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'conditions_conservation', 'Conditions de conservation', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'food'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'pays_origine', 'Pays d''origine', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 80
from public.field_sets fs where fs.key = 'food'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'informations_supplementaires', 'Informations supplémentaires', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 90
from public.field_sets fs where fs.key = 'food'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'quantite_lot', 'Quantité par lot', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 100
from public.field_sets fs where fs.key = 'food'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'food'
  and fd.key not in ('type_aliment', 'poids_volume', 'ingredients', 'allergenes', 'valeurs_nutritionnelles', 'date_fabrication', 'date_expiration', 'conditions_conservation', 'pays_origine', 'informations_supplementaires', 'quantite_lot');

-- Produit cosmétique
insert into public.field_sets (key, name, description)
values ('cosmetic', 'Produit cosmétique', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_produit', 'Type de produit', 'select'::public.field_type,
       NULL, '["Nettoyant","Crème","Sérum","Masque","Lotion","Huile","Savon","Gommage","Shampooing","Après-shampooing","Produit coiffant"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'cosmetic'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'volume_poids', 'Volume / poids', 'text'::public.field_type,
       'ml / g', '[]'::jsonb, NULL, NULL,
       NULL, true, false, true, 10
from public.field_sets fs where fs.key = 'cosmetic'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_peau', 'Type de peau / cheveux', 'select'::public.field_type,
       NULL, '["Tous types","Peau sèche","Peau grasse","Peau mixte","Peau sensible","Cheveux secs","Cheveux gras","Cheveux bouclés","Cheveux colorés"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 20
from public.field_sets fs where fs.key = 'cosmetic'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'parfum', 'Parfum', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'cosmetic'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'ingredients', 'Ingrédients (INCI)', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, true, false, false, 40
from public.field_sets fs where fs.key = 'cosmetic'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'mode_utilisation', 'Mode d''utilisation', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'cosmetic'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'precautions', 'Précautions', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'cosmetic'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'date_expiration', 'Date d''expiration', 'date'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'cosmetic'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'pao', 'PAO (durée après ouverture)', 'text'::public.field_type,
       NULL, '[]'::jsonb, '12M', NULL,
       NULL, false, false, false, 80
from public.field_sets fs where fs.key = 'cosmetic'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'pays_origine', 'Pays d''origine', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 90
from public.field_sets fs where fs.key = 'cosmetic'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'bio', 'Certifié bio', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 100
from public.field_sets fs where fs.key = 'cosmetic'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'cosmetic'
  and fd.key not in ('type_produit', 'volume_poids', 'type_peau', 'parfum', 'ingredients', 'mode_utilisation', 'precautions', 'date_expiration', 'pao', 'pays_origine', 'bio');

-- Parfumerie
insert into public.field_sets (key, name, description)
values ('fragrance', 'Parfumerie', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_parfum', 'Type', 'select'::public.field_type,
       NULL, '["Eau de parfum","Eau de toilette","Eau de cologne","Brume corporelle","Déodorant spray","Déodorant stick","Déodorant roll-on"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'fragrance'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'volume', 'Volume', 'select'::public.field_type,
       NULL, '["30 ml","50 ml","75 ml","100 ml","150 ml","200 ml"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'fragrance'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'genre', 'Pour', 'select'::public.field_type,
       NULL, '["Femme","Homme","Mixte"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 20
from public.field_sets fs where fs.key = 'fragrance'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'famille_olfactive', 'Famille olfactive', 'select'::public.field_type,
       NULL, '["Florale","Boisée","Orientale","Fraîche","Fruitée","Épicée","Aromatique"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 30
from public.field_sets fs where fs.key = 'fragrance'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'notes_tete', 'Notes de tête', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'fragrance'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'notes_coeur', 'Notes de cœur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'fragrance'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'notes_fond', 'Notes de fond', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'fragrance'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'tenue', 'Tenue', 'text'::public.field_type,
       'h', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'fragrance'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'ingredients', 'Ingrédients', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 80
from public.field_sets fs where fs.key = 'fragrance'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'precautions', 'Précautions', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 90
from public.field_sets fs where fs.key = 'fragrance'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'fragrance'
  and fd.key not in ('type_parfum', 'volume', 'genre', 'famille_olfactive', 'notes_tete', 'notes_coeur', 'notes_fond', 'tenue', 'ingredients', 'precautions');

-- Maquillage
insert into public.field_sets (key, name, description)
values ('makeup', 'Maquillage', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'zone', 'Zone', 'select'::public.field_type,
       NULL, '["Lèvres","Yeux","Teint","Ongles","Sourcils"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'makeup'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_produit', 'Type de produit', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, true, false, true, 10
from public.field_sets fs where fs.key = 'makeup'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'teinte', 'Teinte', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 20
from public.field_sets fs where fs.key = 'makeup'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'fini', 'Fini', 'select'::public.field_type,
       NULL, '["Mat","Satiné","Brillant","Nacré","Poudré"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 30
from public.field_sets fs where fs.key = 'makeup'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'volume_poids', 'Volume / poids', 'text'::public.field_type,
       'ml / g', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'makeup'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_peau', 'Type de peau', 'select'::public.field_type,
       NULL, '["Tous types","Peau sèche","Peau grasse","Peau mixte","Peau sensible"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 50
from public.field_sets fs where fs.key = 'makeup'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'longue_tenue', 'Longue tenue', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'makeup'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'waterproof', 'Waterproof', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'makeup'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'ingredients', 'Ingrédients', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 80
from public.field_sets fs where fs.key = 'makeup'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'mode_utilisation', 'Mode d''utilisation', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 90
from public.field_sets fs where fs.key = 'makeup'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'date_expiration', 'Date d''expiration', 'date'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 100
from public.field_sets fs where fs.key = 'makeup'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'makeup'
  and fd.key not in ('zone', 'type_produit', 'teinte', 'fini', 'volume_poids', 'type_peau', 'longue_tenue', 'waterproof', 'ingredients', 'mode_utilisation', 'date_expiration');

-- Accessoire beauté
insert into public.field_sets (key, name, description)
values ('beauty_accessory', 'Accessoire beauté', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_accessoire', 'Type d''accessoire', 'select'::public.field_type,
       NULL, '["Miroir","Trousse","Pinceau","Éponge","Lime","Coupe-ongles","Brosse","Peigne","Set de soin"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'beauty_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'materiau', 'Matériau', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 10
from public.field_sets fs where fs.key = 'beauty_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'dimensions', 'Dimensions', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 20
from public.field_sets fs where fs.key = 'beauty_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couleur', 'Couleur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'beauty_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'grossissement', 'Grossissement', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, 'Miroirs uniquement.',
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'beauty_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'eclairage_led', 'Éclairage LED', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'beauty_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'contenu', 'Contenu du set', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'beauty_accessory'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'beauty_accessory'
  and fd.key not in ('type_accessoire', 'materiau', 'dimensions', 'couleur', 'grossissement', 'eclairage_led', 'contenu');

-- Équipement sportif
insert into public.field_sets (key, name, description)
values ('sports_equipment', 'Équipement sportif', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'sport', 'Sport', 'select'::public.field_type,
       NULL, '["Football","Basketball","Fitness","Musculation","Course","Yoga","Natation","Tennis","Cyclisme","Multisport"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'sports_equipment'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_equipement', 'Type d''équipement', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, true, false, true, 10
from public.field_sets fs where fs.key = 'sports_equipment'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'taille', 'Taille', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 20
from public.field_sets fs where fs.key = 'sports_equipment'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'materiau', 'Matériau', 'select'::public.field_type,
       NULL, '["Cuir","Synthétique","PVC","Caoutchouc","Acier","Néoprène","Mousse"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 30
from public.field_sets fs where fs.key = 'sports_equipment'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'poids', 'Poids', 'number'::public.field_type,
       'kg', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'sports_equipment'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'niveau', 'Niveau', 'select'::public.field_type,
       NULL, '["Débutant","Intermédiaire","Confirmé","Compétition"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 50
from public.field_sets fs where fs.key = 'sports_equipment'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'usage', 'Usage', 'select'::public.field_type,
       NULL, '["Intérieur","Extérieur","Intérieur et extérieur"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 60
from public.field_sets fs where fs.key = 'sports_equipment'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'contenu', 'Contenu', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'sports_equipment'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'sports_equipment'
  and fd.key not in ('sport', 'type_equipement', 'taille', 'materiau', 'poids', 'niveau', 'usage', 'contenu');

-- Vêtement de sport
insert into public.field_sets (key, name, description)
values ('sports_apparel', 'Vêtement de sport', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_vetement', 'Type', 'select'::public.field_type,
       NULL, '["Maillot","Short","Survêtement","T-shirt","Chaussettes","Legging","Veste","Brassière"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'sports_apparel'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'taille', 'Taille', 'select'::public.field_type,
       NULL, '["XS","S","M","L","XL","XXL","3XL","Enfant"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'sports_apparel'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'genre', 'Pour', 'select'::public.field_type,
       NULL, '["Homme","Femme","Enfant","Mixte"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 20
from public.field_sets fs where fs.key = 'sports_apparel'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couleur', 'Couleur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 30
from public.field_sets fs where fs.key = 'sports_apparel'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'matiere', 'Matière', 'select'::public.field_type,
       NULL, '["Polyester","Coton","Coton mélangé","Élasthanne","Mesh technique"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 40
from public.field_sets fs where fs.key = 'sports_apparel'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'respirant', 'Tissu respirant', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'sports_apparel'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'equipe', 'Équipe / club', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'sports_apparel'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'saison', 'Saison', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'sports_apparel'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'entretien', 'Conseils d''entretien', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 80
from public.field_sets fs where fs.key = 'sports_apparel'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'sports_apparel'
  and fd.key not in ('type_vetement', 'taille', 'genre', 'couleur', 'matiere', 'respirant', 'equipe', 'saison', 'entretien');

-- Chaussures
insert into public.field_sets (key, name, description)
values ('footwear', 'Chaussures', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_chaussure', 'Type', 'select'::public.field_type,
       NULL, '["Crampons gazon","Crampons synthétique","Chaussures de salle","Running","Fitness","Basketball"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'footwear'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'pointure', 'Pointure', 'select'::public.field_type,
       NULL, '["36","37","38","39","40","41","42","43","44","45","46"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'footwear'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'genre', 'Pour', 'select'::public.field_type,
       NULL, '["Homme","Femme","Enfant","Mixte"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 20
from public.field_sets fs where fs.key = 'footwear'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'couleur', 'Couleur', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'footwear'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'matiere_dessus', 'Matière du dessus', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'footwear'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_semelle', 'Type de semelle', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'footwear'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'fermeture', 'Fermeture', 'select'::public.field_type,
       NULL, '["Lacets","Scratch","Sans lacets","Élastique"]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'footwear'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'poids', 'Poids', 'number'::public.field_type,
       'g', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'footwear'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'footwear'
  and fd.key not in ('type_chaussure', 'pointure', 'genre', 'couleur', 'matiere_dessus', 'type_semelle', 'fermeture', 'poids');

-- Jeu de société
insert into public.field_sets (key, name, description)
values ('board_game', 'Jeu de société', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_jeu', 'Type de jeu', 'select'::public.field_type,
       NULL, '["Échecs","Dames","Ludo","Jeu de cartes","Stratégie","Ambiance","Familial","Coopératif","Dominos","Scrabble"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'board_game'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'nombre_joueurs', 'Nombre de joueurs', 'select'::public.field_type,
       NULL, '["1 joueur","2 joueurs","2 à 4 joueurs","2 à 6 joueurs","3 à 8 joueurs","8 joueurs et plus"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'board_game'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'age_minimum', 'Âge minimum', 'select'::public.field_type,
       NULL, '["3 ans et +","6 ans et +","8 ans et +","10 ans et +","12 ans et +","16 ans et +"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 20
from public.field_sets fs where fs.key = 'board_game'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'duree_partie', 'Durée d''une partie', 'text'::public.field_type,
       'min', '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 30
from public.field_sets fs where fs.key = 'board_game'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'materiau', 'Matériau', 'select'::public.field_type,
       NULL, '["Bois","Plastique","Carton","Métal","Magnétique"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 40
from public.field_sets fs where fs.key = 'board_game'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'langue', 'Langue', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'board_game'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'contenu', 'Contenu de la boîte', 'textarea'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'board_game'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'dimensions', 'Dimensions', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'board_game'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'board_game'
  and fd.key not in ('type_jeu', 'nombre_joueurs', 'age_minimum', 'duree_partie', 'materiau', 'langue', 'contenu', 'dimensions');

-- Jeu et loisir
insert into public.field_sets (key, name, description)
values ('toy', 'Jeu et loisir', NULL)
on conflict (key) do update
set name = excluded.name, description = excluded.description;

insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'type_jouet', 'Type', 'select'::public.field_type,
       NULL, '["Puzzle","Jeu éducatif","Jeu d''éveil","Jeu de construction","Jeu d''extérieur","Jeu d''adresse","Figurine"]'::jsonb, NULL, NULL,
       NULL, true, true, true, 0
from public.field_sets fs where fs.key = 'toy'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'age_recommande', 'Âge recommandé', 'select'::public.field_type,
       NULL, '["0-2 ans","3-5 ans","6-8 ans","9-11 ans","12 ans et +"]'::jsonb, NULL, NULL,
       NULL, false, true, true, 10
from public.field_sets fs where fs.key = 'toy'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'nombre_pieces', 'Nombre de pièces', 'integer'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, true, 20
from public.field_sets fs where fs.key = 'toy'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'materiau', 'Matériau', 'select'::public.field_type,
       NULL, '["Bois","Plastique","Carton","Tissu","Mousse"]'::jsonb, NULL, NULL,
       NULL, false, true, false, 30
from public.field_sets fs where fs.key = 'toy'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'competences', 'Compétences développées', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 40
from public.field_sets fs where fs.key = 'toy'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'piles_requises', 'Piles requises', 'boolean'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 50
from public.field_sets fs where fs.key = 'toy'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'dimensions', 'Dimensions', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 60
from public.field_sets fs where fs.key = 'toy'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, 'securite', 'Normes de sécurité', 'text'::public.field_type,
       NULL, '[]'::jsonb, NULL, NULL,
       NULL, false, false, false, 70
from public.field_sets fs where fs.key = 'toy'
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;
delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = 'toy'
  and fd.key not in ('type_jouet', 'age_recommande', 'nombre_pieces', 'materiau', 'competences', 'piles_requises', 'dimensions', 'securite');

commit;