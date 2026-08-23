-- Seed 003 — Design services and their brief forms
-- GENERATED FILE — do not edit by hand.
-- Source: supabase/taxonomy/*.mjs   Regenerate with: npm run seed:generate


begin;

-- ======================= Création de logo =======================
insert into public.services (
  slug, name, tagline, description, delivery_time, position, is_featured
)
values ('creation-de-logo', 'Création de logo', 'Une identité graphique qui vous ressemble',
        'Conception d''un logo original, décliné dans les formats nécessaires à tous vos supports.', '5 à 7 jours',
        0, true)
on conflict (slug) do update
set name = excluded.name, tagline = excluded.tagline,
    description = excluded.description, delivery_time = excluded.delivery_time,
    position = excluded.position, is_featured = excluded.is_featured;
insert into public.service_forms (service_id, name, description, version, is_active)
select s.id, 'Brief de création de logo', 'Plus votre brief est précis, plus la première proposition sera proche de ce que vous imaginez.', 1, true
from public.services s where s.slug = 'creation-de-logo'
on conflict (service_id, version) do update
set name = excluded.name, description = excluded.description, is_active = true;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_nom', 'Votre nom', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       true, 0
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_entreprise', 'Nom de l''entreprise ou du projet', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       false, 10
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_secteur', 'Secteur d''activité', 'text'::public.field_type,
       '[]'::jsonb, 'Restauration, informatique, mode…', NULL, 'Vos informations',
       false, 20
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_description', 'Décrivez votre activité', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Quelques phrases suffisent : ce que vous faites, pour qui, ce qui vous distingue.', 'Vos informations',
       true, 30
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'slogan', 'Slogan ou baseline', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       false, 40
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'public_cible', 'Public cible', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Âge, localisation, habitudes, ce qui compte pour eux.', 'Vos informations',
       true, 50
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'concurrents', 'Concurrents ou marques comparables', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       false, 60
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'style_souhaite', 'Style souhaité', 'multiselect'::public.field_type,
       '["Minimaliste","Moderne","Classique","Luxe","Ludique","Artisanal","Technologique","Naturel","Vintage","Corporate"]'::jsonb, NULL, NULL, 'Direction artistique',
       true, 70
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'type_logo', 'Type de logo', 'select'::public.field_type,
       '["Typographique (texte seul)","Icône seule","Icône + texte","Emblème / écusson","À votre appréciation"]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 80
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'couleurs_souhaitees', 'Couleurs souhaitées', 'text'::public.field_type,
       '[]'::jsonb, 'Bleu nuit, doré…', NULL, 'Direction artistique',
       false, 90
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'couleurs_a_eviter', 'Couleurs à éviter', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 100
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'symboles_souhaites', 'Symboles ou éléments souhaités', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 110
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'symboles_a_eviter', 'Symboles ou éléments à éviter', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 120
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'typographie_souhaitee', 'Typographie souhaitée', 'select'::public.field_type,
       '["Sans serif (moderne)","Serif (classique)","Script (manuscrite)","Display (originale)","À votre appréciation"]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 130
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'inspirations', 'Inspirations', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Décrivez ou listez des logos que vous appréciez, et pourquoi.', 'Direction artistique',
       false, 140
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'logo_existant', 'Logo existant', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Si vous souhaitez une refonte.', 'Fichiers',
       false, 150
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_references', 'Références et inspirations', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Images, captures ou liens exportés qui illustrent ce que vous aimez.', 'Fichiers',
       false, 160
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_documents', 'Documents utiles', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Textes, tarifs, plans, tout contenu à intégrer.', 'Fichiers',
       false, 170
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'supports_utilisation', 'Supports d''utilisation prévus', 'multiselect'::public.field_type,
       '["Enseigne","Cartes de visite","Réseaux sociaux","Site web","Véhicule","Textile","Emballage","Documents administratifs"]'::jsonb, NULL, NULL, 'Livraison',
       false, 180
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'declinaisons', 'Déclinaisons attendues', 'multiselect'::public.field_type,
       '["Version couleur","Version monochrome","Version noir et blanc","Version fond sombre","Favicon","Version horizontale","Version verticale"]'::jsonb, NULL, NULL, 'Livraison',
       false, 190
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'formats_souhaites', 'Formats de fichiers souhaités', 'multiselect'::public.field_type,
       '["PDF","PNG","JPG","SVG","AI","PSD","EPS","Fichiers sources vectoriels"]'::jsonb, NULL, NULL, 'Livraison',
       false, 200
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'delai', 'Délai souhaité', 'select'::public.field_type,
       '["Urgent (24-48 h)","Sous une semaine","Sous deux semaines","Pas de contrainte"]'::jsonb, NULL, NULL, 'Livraison',
       true, 210
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'budget', 'Budget indicatif', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 220
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'instructions', 'Instructions supplémentaires', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 230
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'creation-de-logo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
delete from public.service_form_fields sff
using public.service_forms sf, public.services s
where sff.form_id = sf.id and sf.service_id = s.id
  and s.slug = 'creation-de-logo' and sf.version = 1
  and sff.key not in ('client_nom', 'client_entreprise', 'client_secteur', 'client_description', 'slogan', 'public_cible', 'concurrents', 'style_souhaite', 'type_logo', 'couleurs_souhaitees', 'couleurs_a_eviter', 'symboles_souhaites', 'symboles_a_eviter', 'typographie_souhaitee', 'inspirations', 'logo_existant', 'fichiers_references', 'fichiers_documents', 'supports_utilisation', 'declinaisons', 'formats_souhaites', 'delai', 'budget', 'instructions');

-- ======================= Flyer =======================
insert into public.services (
  slug, name, tagline, description, delivery_time, position, is_featured
)
values ('flyer', 'Flyer', 'Un support percutant pour vos campagnes',
        'Flyer recto ou recto-verso prêt à imprimer ou à diffuser en ligne.', '2 à 4 jours',
        10, true)
on conflict (slug) do update
set name = excluded.name, tagline = excluded.tagline,
    description = excluded.description, delivery_time = excluded.delivery_time,
    position = excluded.position, is_featured = excluded.is_featured;
insert into public.service_forms (service_id, name, description, version, is_active)
select s.id, 'Brief flyer', NULL, 1, true
from public.services s where s.slug = 'flyer'
on conflict (service_id, version) do update
set name = excluded.name, description = excluded.description, is_active = true;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_nom', 'Votre nom', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       true, 0
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_entreprise', 'Nom de l''entreprise ou du projet', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       false, 10
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_secteur', 'Secteur d''activité', 'text'::public.field_type,
       '[]'::jsonb, 'Restauration, informatique, mode…', NULL, 'Vos informations',
       false, 20
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_description', 'Décrivez votre activité', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Quelques phrases suffisent : ce que vous faites, pour qui, ce qui vous distingue.', 'Vos informations',
       true, 30
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'objectif', 'Objectif du flyer', 'select'::public.field_type,
       '["Promotion / soldes","Ouverture","Événement","Présentation de services","Recrutement","Information"]'::jsonb, NULL, NULL, 'Le projet',
       true, 40
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'format_flyer', 'Format', 'select'::public.field_type,
       '["A6 (10.5 x 14.8 cm)","A5 (14.8 x 21 cm)","A4 (21 x 29.7 cm)","DL (10 x 21 cm)","Carré","Format personnalisé"]'::jsonb, NULL, NULL, 'Le projet',
       true, 50
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'recto_verso', 'Recto-verso', 'select'::public.field_type,
       '["Recto seul","Recto-verso"]'::jsonb, NULL, NULL, 'Le projet',
       true, 60
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'titre_principal', 'Titre principal', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       true, 70
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'texte_recto', 'Texte du recto', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       true, 80
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'texte_verso', 'Texte du verso', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 90
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'offre', 'Offre ou promotion à mettre en avant', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 100
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'coordonnees', 'Coordonnées à afficher', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Téléphone, adresse, réseaux sociaux, site web.', 'Contenu',
       false, 110
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'appel_action', 'Appel à l''action', 'text'::public.field_type,
       '[]'::jsonb, 'Appelez-nous, Visitez la boutique…', NULL, 'Contenu',
       false, 120
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'style_souhaite', 'Style souhaité', 'multiselect'::public.field_type,
       '["Épuré","Coloré","Élégant","Percutant","Festif","Professionnel"]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 130
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'couleurs_souhaitees', 'Couleurs souhaitées', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 140
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'charte_existante', 'Charte graphique existante', 'files'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Fichiers',
       false, 150
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'photos_a_utiliser', 'Photos ou visuels à utiliser', 'files'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Fichiers',
       false, 160
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_references', 'Références et inspirations', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Images, captures ou liens exportés qui illustrent ce que vous aimez.', 'Fichiers',
       false, 170
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_documents', 'Documents utiles', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Textes, tarifs, plans, tout contenu à intégrer.', 'Fichiers',
       false, 180
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'usage_final', 'Usage final', 'select'::public.field_type,
       '["Impression","Diffusion numérique","Les deux"]'::jsonb, NULL, NULL, 'Livraison',
       true, 190
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'quantite_impression', 'Quantité à imprimer', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 200
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'formats_souhaites', 'Formats de fichiers souhaités', 'multiselect'::public.field_type,
       '["PDF","PNG","JPG","SVG","AI","PSD","EPS","PDF prêt à imprimer (fond perdu)"]'::jsonb, NULL, NULL, 'Livraison',
       false, 210
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'delai', 'Délai souhaité', 'select'::public.field_type,
       '["Urgent (24-48 h)","Sous une semaine","Sous deux semaines","Pas de contrainte"]'::jsonb, NULL, NULL, 'Livraison',
       true, 220
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'budget', 'Budget indicatif', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 230
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'instructions', 'Instructions supplémentaires', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 240
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'flyer' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
delete from public.service_form_fields sff
using public.service_forms sf, public.services s
where sff.form_id = sf.id and sf.service_id = s.id
  and s.slug = 'flyer' and sf.version = 1
  and sff.key not in ('client_nom', 'client_entreprise', 'client_secteur', 'client_description', 'objectif', 'format_flyer', 'recto_verso', 'titre_principal', 'texte_recto', 'texte_verso', 'offre', 'coordonnees', 'appel_action', 'style_souhaite', 'couleurs_souhaitees', 'charte_existante', 'photos_a_utiliser', 'fichiers_references', 'fichiers_documents', 'usage_final', 'quantite_impression', 'formats_souhaites', 'delai', 'budget', 'instructions');

-- ======================= Carte de visite =======================
insert into public.services (
  slug, name, tagline, description, delivery_time, position, is_featured
)
values ('carte-de-visite', 'Carte de visite', 'La première impression, soignée',
        'Carte de visite recto-verso alignée sur votre identité visuelle.', '2 à 3 jours',
        20, false)
on conflict (slug) do update
set name = excluded.name, tagline = excluded.tagline,
    description = excluded.description, delivery_time = excluded.delivery_time,
    position = excluded.position, is_featured = excluded.is_featured;
insert into public.service_forms (service_id, name, description, version, is_active)
select s.id, 'Brief carte de visite', NULL, 1, true
from public.services s where s.slug = 'carte-de-visite'
on conflict (service_id, version) do update
set name = excluded.name, description = excluded.description, is_active = true;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_nom', 'Votre nom', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       true, 0
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_entreprise', 'Nom de l''entreprise ou du projet', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       false, 10
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_secteur', 'Secteur d''activité', 'text'::public.field_type,
       '[]'::jsonb, 'Restauration, informatique, mode…', NULL, 'Vos informations',
       false, 20
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_description', 'Décrivez votre activité', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Quelques phrases suffisent : ce que vous faites, pour qui, ce qui vous distingue.', 'Vos informations',
       true, 30
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'nom_titulaire', 'Nom figurant sur la carte', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       true, 40
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fonction', 'Fonction / titre', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 50
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'telephone', 'Téléphone', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 60
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'email_carte', 'E-mail', 'email'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 70
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'adresse', 'Adresse', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 80
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'site_web', 'Site web', 'url'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 90
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'reseaux', 'Comptes à afficher', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 100
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'qr_code', 'Inclure un QR code', 'boolean'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 110
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'qr_destination', 'Destination du QR code', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 120
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'format_carte', 'Format', 'select'::public.field_type,
       '["85 x 55 mm (standard)","90 x 50 mm","Carré 55 x 55 mm","Format personnalisé"]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 130
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'orientation', 'Orientation', 'select'::public.field_type,
       '["Paysage","Portrait"]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 140
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'style_souhaite', 'Style souhaité', 'multiselect'::public.field_type,
       '["Minimaliste","Élégant","Créatif","Corporate","Luxe"]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 150
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'finitions', 'Finitions envisagées', 'multiselect'::public.field_type,
       '["Mat","Brillant","Soft touch","Dorure","Vernis sélectif","Bords arrondis"]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 160
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'logo_existant', 'Votre logo', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'De préférence en fichier vectoriel.', 'Fichiers',
       false, 170
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_references', 'Références et inspirations', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Images, captures ou liens exportés qui illustrent ce que vous aimez.', 'Fichiers',
       false, 180
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_documents', 'Documents utiles', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Textes, tarifs, plans, tout contenu à intégrer.', 'Fichiers',
       false, 190
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'formats_souhaites', 'Formats de fichiers souhaités', 'multiselect'::public.field_type,
       '["PDF","PNG","JPG","SVG","AI","PSD","EPS","PDF prêt à imprimer (fond perdu)"]'::jsonb, NULL, NULL, 'Livraison',
       false, 200
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'delai', 'Délai souhaité', 'select'::public.field_type,
       '["Urgent (24-48 h)","Sous une semaine","Sous deux semaines","Pas de contrainte"]'::jsonb, NULL, NULL, 'Livraison',
       true, 210
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'budget', 'Budget indicatif', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 220
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'instructions', 'Instructions supplémentaires', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 230
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'carte-de-visite' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
delete from public.service_form_fields sff
using public.service_forms sf, public.services s
where sff.form_id = sf.id and sf.service_id = s.id
  and s.slug = 'carte-de-visite' and sf.version = 1
  and sff.key not in ('client_nom', 'client_entreprise', 'client_secteur', 'client_description', 'nom_titulaire', 'fonction', 'telephone', 'email_carte', 'adresse', 'site_web', 'reseaux', 'qr_code', 'qr_destination', 'format_carte', 'orientation', 'style_souhaite', 'finitions', 'logo_existant', 'fichiers_references', 'fichiers_documents', 'formats_souhaites', 'delai', 'budget', 'instructions');

-- ======================= Affiche =======================
insert into public.services (
  slug, name, tagline, description, delivery_time, position, is_featured
)
values ('affiche', 'Affiche', 'Un visuel qui se voit de loin',
        'Affiche grand format pour vos événements, promotions ou communications.', '3 à 5 jours',
        30, false)
on conflict (slug) do update
set name = excluded.name, tagline = excluded.tagline,
    description = excluded.description, delivery_time = excluded.delivery_time,
    position = excluded.position, is_featured = excluded.is_featured;
insert into public.service_forms (service_id, name, description, version, is_active)
select s.id, 'Brief affiche', NULL, 1, true
from public.services s where s.slug = 'affiche'
on conflict (service_id, version) do update
set name = excluded.name, description = excluded.description, is_active = true;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_nom', 'Votre nom', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       true, 0
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_entreprise', 'Nom de l''entreprise ou du projet', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       false, 10
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_secteur', 'Secteur d''activité', 'text'::public.field_type,
       '[]'::jsonb, 'Restauration, informatique, mode…', NULL, 'Vos informations',
       false, 20
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_description', 'Décrivez votre activité', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Quelques phrases suffisent : ce que vous faites, pour qui, ce qui vous distingue.', 'Vos informations',
       true, 30
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'sujet', 'Sujet de l''affiche', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Le projet',
       true, 40
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'format_affiche', 'Format', 'select'::public.field_type,
       '["A3","A2","A1","A0","40 x 60 cm","Format personnalisé"]'::jsonb, NULL, NULL, 'Le projet',
       true, 50
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'lieu_affichage', 'Lieu d''affichage', 'text'::public.field_type,
       '[]'::jsonb, NULL, 'Intérieur, vitrine, panneau extérieur… cela influence la lisibilité.', 'Le projet',
       false, 60
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'distance_lecture', 'Distance de lecture', 'select'::public.field_type,
       '["Moins d''un mètre","1 à 3 mètres","Plus de 3 mètres"]'::jsonb, NULL, NULL, 'Le projet',
       false, 70
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'titre_principal', 'Titre principal', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       true, 80
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'sous_titre', 'Sous-titre', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 90
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'informations_pratiques', 'Informations pratiques', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Date, heure, lieu, tarif, contact.', 'Contenu',
       false, 100
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'mentions_legales', 'Mentions obligatoires', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 110
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'style_souhaite', 'Style souhaité', 'multiselect'::public.field_type,
       '["Typographique","Photographique","Illustré","Minimaliste","Rétro","Audacieux"]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 120
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'couleurs_souhaitees', 'Couleurs souhaitées', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 130
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'photos_a_utiliser', 'Visuels à intégrer', 'files'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Fichiers',
       false, 140
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'logos_partenaires', 'Logos partenaires ou sponsors', 'files'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Fichiers',
       false, 150
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_references', 'Références et inspirations', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Images, captures ou liens exportés qui illustrent ce que vous aimez.', 'Fichiers',
       false, 160
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_documents', 'Documents utiles', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Textes, tarifs, plans, tout contenu à intégrer.', 'Fichiers',
       false, 170
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'formats_souhaites', 'Formats de fichiers souhaités', 'multiselect'::public.field_type,
       '["PDF","PNG","JPG","SVG","AI","PSD","EPS","PDF haute résolution"]'::jsonb, NULL, NULL, 'Livraison',
       false, 180
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'delai', 'Délai souhaité', 'select'::public.field_type,
       '["Urgent (24-48 h)","Sous une semaine","Sous deux semaines","Pas de contrainte"]'::jsonb, NULL, NULL, 'Livraison',
       true, 190
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'budget', 'Budget indicatif', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 200
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'instructions', 'Instructions supplémentaires', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 210
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'affiche' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
delete from public.service_form_fields sff
using public.service_forms sf, public.services s
where sff.form_id = sf.id and sf.service_id = s.id
  and s.slug = 'affiche' and sf.version = 1
  and sff.key not in ('client_nom', 'client_entreprise', 'client_secteur', 'client_description', 'sujet', 'format_affiche', 'lieu_affichage', 'distance_lecture', 'titre_principal', 'sous_titre', 'informations_pratiques', 'mentions_legales', 'style_souhaite', 'couleurs_souhaitees', 'photos_a_utiliser', 'logos_partenaires', 'fichiers_references', 'fichiers_documents', 'formats_souhaites', 'delai', 'budget', 'instructions');

-- ======================= Invitation =======================
insert into public.services (
  slug, name, tagline, description, delivery_time, position, is_featured
)
values ('invitation', 'Invitation', 'Donnez le ton dès l''invitation',
        'Carton d''invitation imprimé ou numérique pour tout type d''événement.', '2 à 4 jours',
        40, false)
on conflict (slug) do update
set name = excluded.name, tagline = excluded.tagline,
    description = excluded.description, delivery_time = excluded.delivery_time,
    position = excluded.position, is_featured = excluded.is_featured;
insert into public.service_forms (service_id, name, description, version, is_active)
select s.id, 'Brief invitation', NULL, 1, true
from public.services s where s.slug = 'invitation'
on conflict (service_id, version) do update
set name = excluded.name, description = excluded.description, is_active = true;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_nom', 'Votre nom', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       true, 0
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_entreprise', 'Nom de l''entreprise ou du projet', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       false, 10
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_secteur', 'Secteur d''activité', 'text'::public.field_type,
       '[]'::jsonb, 'Restauration, informatique, mode…', NULL, 'Vos informations',
       false, 20
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_description', 'Décrivez votre activité', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Quelques phrases suffisent : ce que vous faites, pour qui, ce qui vous distingue.', 'Vos informations',
       true, 30
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'type_evenement', 'Type d''événement', 'select'::public.field_type,
       '["Mariage","Anniversaire","Baptême","Inauguration","Séminaire","Soirée d''entreprise","Remise de diplôme","Autre"]'::jsonb, NULL, NULL, 'L''événement',
       true, 40
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'nom_hotes', 'Nom des hôtes', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'L''événement',
       true, 50
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'date_evenement', 'Date de l''événement', 'date'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'L''événement',
       true, 60
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'heure_evenement', 'Heure', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'L''événement',
       false, 70
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'lieu_evenement', 'Lieu', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'L''événement',
       true, 80
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'programme', 'Programme', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'L''événement',
       false, 90
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'code_vestimentaire', 'Code vestimentaire', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'L''événement',
       false, 100
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'rsvp', 'Modalités de réponse (RSVP)', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'L''événement',
       false, 110
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'texte_personnel', 'Texte personnel ou citation', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 120
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'format_invitation', 'Format', 'select'::public.field_type,
       '["A6","A5","Carré 15 x 15 cm","DL","Numérique (réseaux sociaux)","Format personnalisé"]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 130
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'style_souhaite', 'Style souhaité', 'multiselect'::public.field_type,
       '["Élégant","Romantique","Moderne","Festif","Traditionnel","Minimaliste","Floral"]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 140
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'couleurs_souhaitees', 'Palette de couleurs', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 150
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'photos_a_utiliser', 'Photos à intégrer', 'files'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Fichiers',
       false, 160
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_references', 'Références et inspirations', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Images, captures ou liens exportés qui illustrent ce que vous aimez.', 'Fichiers',
       false, 170
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_documents', 'Documents utiles', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Textes, tarifs, plans, tout contenu à intégrer.', 'Fichiers',
       false, 180
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'nombre_exemplaires', 'Nombre d''exemplaires', 'integer'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 190
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'formats_souhaites', 'Formats de fichiers souhaités', 'multiselect'::public.field_type,
       '["PDF","PNG","JPG","SVG","AI","PSD","EPS"]'::jsonb, NULL, NULL, 'Livraison',
       false, 200
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'delai', 'Délai souhaité', 'select'::public.field_type,
       '["Urgent (24-48 h)","Sous une semaine","Sous deux semaines","Pas de contrainte"]'::jsonb, NULL, NULL, 'Livraison',
       true, 210
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'budget', 'Budget indicatif', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 220
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'instructions', 'Instructions supplémentaires', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 230
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'invitation' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
delete from public.service_form_fields sff
using public.service_forms sf, public.services s
where sff.form_id = sf.id and sf.service_id = s.id
  and s.slug = 'invitation' and sf.version = 1
  and sff.key not in ('client_nom', 'client_entreprise', 'client_secteur', 'client_description', 'type_evenement', 'nom_hotes', 'date_evenement', 'heure_evenement', 'lieu_evenement', 'programme', 'code_vestimentaire', 'rsvp', 'texte_personnel', 'format_invitation', 'style_souhaite', 'couleurs_souhaitees', 'photos_a_utiliser', 'fichiers_references', 'fichiers_documents', 'nombre_exemplaires', 'formats_souhaites', 'delai', 'budget', 'instructions');

-- ======================= Bannière =======================
insert into public.services (
  slug, name, tagline, description, delivery_time, position, is_featured
)
values ('banniere', 'Bannière', 'Pour le web comme pour la rue',
        'Bannière web, couverture de réseau social ou bâche grand format, aux bonnes dimensions.', '1 à 3 jours',
        50, false)
on conflict (slug) do update
set name = excluded.name, tagline = excluded.tagline,
    description = excluded.description, delivery_time = excluded.delivery_time,
    position = excluded.position, is_featured = excluded.is_featured;
insert into public.service_forms (service_id, name, description, version, is_active)
select s.id, 'Brief bannière', NULL, 1, true
from public.services s where s.slug = 'banniere'
on conflict (service_id, version) do update
set name = excluded.name, description = excluded.description, is_active = true;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_nom', 'Votre nom', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       true, 0
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'banniere' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_entreprise', 'Nom de l''entreprise ou du projet', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       false, 10
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'banniere' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_secteur', 'Secteur d''activité', 'text'::public.field_type,
       '[]'::jsonb, 'Restauration, informatique, mode…', NULL, 'Vos informations',
       false, 20
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'banniere' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_description', 'Décrivez votre activité', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Quelques phrases suffisent : ce que vous faites, pour qui, ce qui vous distingue.', 'Vos informations',
       true, 30
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'banniere' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'destination', 'Destination de la bannière', 'select'::public.field_type,
       '["Site web","Réseaux sociaux","Publicité en ligne","Bâche extérieure","Kakemono / roll-up","Enseigne"]'::jsonb, NULL, NULL, 'Le projet',
       true, 40
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'banniere' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'dimensions_souhaitees', 'Dimensions', 'text'::public.field_type,
       '[]'::jsonb, '1200 x 400 px, ou 3 x 1 m', NULL, 'Le projet',
       true, 50
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'banniere' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'declinaisons_tailles', 'Déclinaisons de taille nécessaires', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Listez chaque emplacement et sa taille si plusieurs versions sont attendues.', 'Le projet',
       false, 60
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'banniere' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'message_principal', 'Message principal', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       true, 70
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'banniere' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'message_secondaire', 'Message secondaire', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 80
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'banniere' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'appel_action', 'Bouton / appel à l''action', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 90
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'banniere' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'animee', 'Version animée souhaitée', 'boolean'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 100
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'banniere' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'style_souhaite', 'Style souhaité', 'multiselect'::public.field_type,
       '["Épuré","Impactant","Photographique","Illustré","Dégradé","Corporate"]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 110
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'banniere' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'couleurs_souhaitees', 'Couleurs souhaitées', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 120
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'banniere' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'charte_existante', 'Charte graphique', 'files'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Fichiers',
       false, 130
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'banniere' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'photos_a_utiliser', 'Visuels à intégrer', 'files'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Fichiers',
       false, 140
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'banniere' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_references', 'Références et inspirations', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Images, captures ou liens exportés qui illustrent ce que vous aimez.', 'Fichiers',
       false, 150
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'banniere' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_documents', 'Documents utiles', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Textes, tarifs, plans, tout contenu à intégrer.', 'Fichiers',
       false, 160
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'banniere' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'formats_souhaites', 'Formats de fichiers souhaités', 'multiselect'::public.field_type,
       '["PDF","PNG","JPG","SVG","AI","PSD","EPS","GIF","MP4"]'::jsonb, NULL, NULL, 'Livraison',
       false, 170
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'banniere' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'delai', 'Délai souhaité', 'select'::public.field_type,
       '["Urgent (24-48 h)","Sous une semaine","Sous deux semaines","Pas de contrainte"]'::jsonb, NULL, NULL, 'Livraison',
       true, 180
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'banniere' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'budget', 'Budget indicatif', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 190
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'banniere' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'instructions', 'Instructions supplémentaires', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 200
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'banniere' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
delete from public.service_form_fields sff
using public.service_forms sf, public.services s
where sff.form_id = sf.id and sf.service_id = s.id
  and s.slug = 'banniere' and sf.version = 1
  and sff.key not in ('client_nom', 'client_entreprise', 'client_secteur', 'client_description', 'destination', 'dimensions_souhaitees', 'declinaisons_tailles', 'message_principal', 'message_secondaire', 'appel_action', 'animee', 'style_souhaite', 'couleurs_souhaitees', 'charte_existante', 'photos_a_utiliser', 'fichiers_references', 'fichiers_documents', 'formats_souhaites', 'delai', 'budget', 'instructions');

-- ======================= Brochure =======================
insert into public.services (
  slug, name, tagline, description, delivery_time, position, is_featured
)
values ('brochure', 'Brochure', 'Présentez votre offre en détail',
        'Brochure multipage mise en page pour l''impression et la lecture à l''écran.', '5 à 10 jours',
        60, false)
on conflict (slug) do update
set name = excluded.name, tagline = excluded.tagline,
    description = excluded.description, delivery_time = excluded.delivery_time,
    position = excluded.position, is_featured = excluded.is_featured;
insert into public.service_forms (service_id, name, description, version, is_active)
select s.id, 'Brief brochure', NULL, 1, true
from public.services s where s.slug = 'brochure'
on conflict (service_id, version) do update
set name = excluded.name, description = excluded.description, is_active = true;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_nom', 'Votre nom', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       true, 0
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'brochure' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_entreprise', 'Nom de l''entreprise ou du projet', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       false, 10
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'brochure' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_secteur', 'Secteur d''activité', 'text'::public.field_type,
       '[]'::jsonb, 'Restauration, informatique, mode…', NULL, 'Vos informations',
       false, 20
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'brochure' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_description', 'Décrivez votre activité', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Quelques phrases suffisent : ce que vous faites, pour qui, ce qui vous distingue.', 'Vos informations',
       true, 30
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'brochure' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'objectif', 'Objectif de la brochure', 'select'::public.field_type,
       '["Présentation d''entreprise","Catalogue d''offres","Rapport annuel","Support commercial","Document institutionnel"]'::jsonb, NULL, NULL, 'Le projet',
       true, 40
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'brochure' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'nombre_pages', 'Nombre de pages', 'select'::public.field_type,
       '["4 pages","8 pages","12 pages","16 pages","24 pages","Plus de 24 pages"]'::jsonb, NULL, NULL, 'Le projet',
       true, 50
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'brochure' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'format_brochure', 'Format', 'select'::public.field_type,
       '["A4 portrait","A4 paysage","A5","Carré 21 x 21 cm","Format personnalisé"]'::jsonb, NULL, NULL, 'Le projet',
       true, 60
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'brochure' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'reliure', 'Reliure', 'select'::public.field_type,
       '["Piqûre à cheval","Dos carré collé","Spirale","Sans reliure"]'::jsonb, NULL, NULL, 'Le projet',
       false, 70
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'brochure' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'sommaire', 'Structure envisagée', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Listez les sections ou chapitres, une par ligne.', 'Contenu',
       true, 80
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'brochure' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'textes_fournis', 'Les textes sont-ils prêts ?', 'select'::public.field_type,
       '["Oui, tous","Partiellement","Non, à rédiger"]'::jsonb, NULL, NULL, 'Contenu',
       true, 90
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'brochure' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'contenu_redactionnel', 'Contenu à intégrer', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 100
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'brochure' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'style_souhaite', 'Style de mise en page', 'multiselect'::public.field_type,
       '["Éditorial","Corporate","Magazine","Minimaliste","Illustré","Photographique"]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 110
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'brochure' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'charte_existante', 'Charte graphique', 'files'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Fichiers',
       false, 120
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'brochure' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'photos_a_utiliser', 'Photos et illustrations', 'files'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Fichiers',
       false, 130
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'brochure' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'textes_documents', 'Documents texte', 'files'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Fichiers',
       false, 140
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'brochure' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_references', 'Références et inspirations', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Images, captures ou liens exportés qui illustrent ce que vous aimez.', 'Fichiers',
       false, 150
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'brochure' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_documents', 'Documents utiles', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Textes, tarifs, plans, tout contenu à intégrer.', 'Fichiers',
       false, 160
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'brochure' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'formats_souhaites', 'Formats de fichiers souhaités', 'multiselect'::public.field_type,
       '["PDF","PNG","JPG","SVG","AI","PSD","EPS","PDF interactif","InDesign"]'::jsonb, NULL, NULL, 'Livraison',
       false, 170
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'brochure' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'delai', 'Délai souhaité', 'select'::public.field_type,
       '["Urgent (24-48 h)","Sous une semaine","Sous deux semaines","Pas de contrainte"]'::jsonb, NULL, NULL, 'Livraison',
       true, 180
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'brochure' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'budget', 'Budget indicatif', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 190
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'brochure' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'instructions', 'Instructions supplémentaires', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 200
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'brochure' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
delete from public.service_form_fields sff
using public.service_forms sf, public.services s
where sff.form_id = sf.id and sf.service_id = s.id
  and s.slug = 'brochure' and sf.version = 1
  and sff.key not in ('client_nom', 'client_entreprise', 'client_secteur', 'client_description', 'objectif', 'nombre_pages', 'format_brochure', 'reliure', 'sommaire', 'textes_fournis', 'contenu_redactionnel', 'style_souhaite', 'charte_existante', 'photos_a_utiliser', 'textes_documents', 'fichiers_references', 'fichiers_documents', 'formats_souhaites', 'delai', 'budget', 'instructions');

-- ======================= Dépliant =======================
insert into public.services (
  slug, name, tagline, description, delivery_time, position, is_featured
)
values ('depliant', 'Dépliant', 'Une information claire, bien pliée',
        'Dépliant deux ou trois volets, structuré pour être lu dans le bon ordre.', '3 à 5 jours',
        70, false)
on conflict (slug) do update
set name = excluded.name, tagline = excluded.tagline,
    description = excluded.description, delivery_time = excluded.delivery_time,
    position = excluded.position, is_featured = excluded.is_featured;
insert into public.service_forms (service_id, name, description, version, is_active)
select s.id, 'Brief dépliant', NULL, 1, true
from public.services s where s.slug = 'depliant'
on conflict (service_id, version) do update
set name = excluded.name, description = excluded.description, is_active = true;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_nom', 'Votre nom', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       true, 0
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'depliant' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_entreprise', 'Nom de l''entreprise ou du projet', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       false, 10
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'depliant' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_secteur', 'Secteur d''activité', 'text'::public.field_type,
       '[]'::jsonb, 'Restauration, informatique, mode…', NULL, 'Vos informations',
       false, 20
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'depliant' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_description', 'Décrivez votre activité', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Quelques phrases suffisent : ce que vous faites, pour qui, ce qui vous distingue.', 'Vos informations',
       true, 30
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'depliant' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'type_pliage', 'Type de pliage', 'select'::public.field_type,
       '["2 volets (simple)","3 volets roulé","3 volets accordéon","4 volets portefeuille","Pliage croisé"]'::jsonb, NULL, NULL, 'Le projet',
       true, 40
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'depliant' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'format_ferme', 'Format fermé', 'select'::public.field_type,
       '["DL (10 x 21 cm)","A5","A6","Carré","Format personnalisé"]'::jsonb, NULL, NULL, 'Le projet',
       true, 50
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'depliant' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'contenu_par_volet', 'Contenu volet par volet', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Décrivez ce qui doit figurer sur chaque face, dans l''ordre de lecture.', 'Contenu',
       true, 60
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'depliant' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'titre_couverture', 'Titre de couverture', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       true, 70
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'depliant' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'coordonnees', 'Coordonnées', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 80
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'depliant' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'tarifs', 'Tarifs ou grille de prix', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 90
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'depliant' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'style_souhaite', 'Style souhaité', 'multiselect'::public.field_type,
       '["Épuré","Informatif","Coloré","Professionnel","Touristique"]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 100
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'depliant' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'couleurs_souhaitees', 'Couleurs souhaitées', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 110
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'depliant' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'charte_existante', 'Charte graphique', 'files'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Fichiers',
       false, 120
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'depliant' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'photos_a_utiliser', 'Visuels à intégrer', 'files'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Fichiers',
       false, 130
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'depliant' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_references', 'Références et inspirations', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Images, captures ou liens exportés qui illustrent ce que vous aimez.', 'Fichiers',
       false, 140
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'depliant' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_documents', 'Documents utiles', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Textes, tarifs, plans, tout contenu à intégrer.', 'Fichiers',
       false, 150
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'depliant' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'formats_souhaites', 'Formats de fichiers souhaités', 'multiselect'::public.field_type,
       '["PDF","PNG","JPG","SVG","AI","PSD","EPS","PDF prêt à imprimer (fond perdu)"]'::jsonb, NULL, NULL, 'Livraison',
       false, 160
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'depliant' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'delai', 'Délai souhaité', 'select'::public.field_type,
       '["Urgent (24-48 h)","Sous une semaine","Sous deux semaines","Pas de contrainte"]'::jsonb, NULL, NULL, 'Livraison',
       true, 170
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'depliant' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'budget', 'Budget indicatif', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 180
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'depliant' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'instructions', 'Instructions supplémentaires', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 190
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'depliant' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
delete from public.service_form_fields sff
using public.service_forms sf, public.services s
where sff.form_id = sf.id and sf.service_id = s.id
  and s.slug = 'depliant' and sf.version = 1
  and sff.key not in ('client_nom', 'client_entreprise', 'client_secteur', 'client_description', 'type_pliage', 'format_ferme', 'contenu_par_volet', 'titre_couverture', 'coordonnees', 'tarifs', 'style_souhaite', 'couleurs_souhaitees', 'charte_existante', 'photos_a_utiliser', 'fichiers_references', 'fichiers_documents', 'formats_souhaites', 'delai', 'budget', 'instructions');

-- ======================= Menu =======================
insert into public.services (
  slug, name, tagline, description, delivery_time, position, is_featured
)
values ('menu', 'Menu', 'Une carte qui donne envie',
        'Carte de restaurant, bar ou traiteur, lisible et appétissante.', '3 à 5 jours',
        80, false)
on conflict (slug) do update
set name = excluded.name, tagline = excluded.tagline,
    description = excluded.description, delivery_time = excluded.delivery_time,
    position = excluded.position, is_featured = excluded.is_featured;
insert into public.service_forms (service_id, name, description, version, is_active)
select s.id, 'Brief menu', NULL, 1, true
from public.services s where s.slug = 'menu'
on conflict (service_id, version) do update
set name = excluded.name, description = excluded.description, is_active = true;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_nom', 'Votre nom', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       true, 0
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_entreprise', 'Nom de l''entreprise ou du projet', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       false, 10
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_secteur', 'Secteur d''activité', 'text'::public.field_type,
       '[]'::jsonb, 'Restauration, informatique, mode…', NULL, 'Vos informations',
       false, 20
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_description', 'Décrivez votre activité', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Quelques phrases suffisent : ce que vous faites, pour qui, ce qui vous distingue.', 'Vos informations',
       true, 30
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'type_etablissement', 'Type d''établissement', 'select'::public.field_type,
       '["Restaurant","Fast-food","Bar","Café","Pâtisserie","Traiteur","Food truck"]'::jsonb, NULL, NULL, 'L''établissement',
       true, 40
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'type_cuisine', 'Type de cuisine', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'L''établissement',
       false, 50
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'format_menu', 'Format', 'select'::public.field_type,
       '["A4 recto-verso","A5","Format long (10 x 30 cm)","Dépliant 3 volets","Set de table","Ardoise / affiche","Menu numérique (QR code)"]'::jsonb, NULL, NULL, 'Le projet',
       true, 60
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'nombre_sections', 'Sections du menu', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Entrées, plats, desserts, boissons… une par ligne.', 'Contenu',
       true, 70
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'liste_plats', 'Liste des plats et prix', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Nom du plat, description courte, prix.', 'Contenu',
       true, 80
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'mentions_allergenes', 'Mentions allergènes à afficher', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 90
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'langues', 'Langues du menu', 'multiselect'::public.field_type,
       '["Français","Anglais","Arabe","Espagnol","Autre"]'::jsonb, NULL, NULL, 'Contenu',
       false, 100
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'photos_plats', 'Photos des plats', 'select'::public.field_type,
       '["Avec photos","Sans photos","Quelques photos seulement"]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 110
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'style_souhaite', 'Ambiance souhaitée', 'multiselect'::public.field_type,
       '["Chic","Convivial","Rustique","Moderne","Street food","Traditionnel"]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 120
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'couleurs_souhaitees', 'Couleurs souhaitées', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 130
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'photos_a_utiliser', 'Photos à utiliser', 'files'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Fichiers',
       false, 140
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'menu_actuel', 'Menu actuel', 'files'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Fichiers',
       false, 150
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_references', 'Références et inspirations', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Images, captures ou liens exportés qui illustrent ce que vous aimez.', 'Fichiers',
       false, 160
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_documents', 'Documents utiles', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Textes, tarifs, plans, tout contenu à intégrer.', 'Fichiers',
       false, 170
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'plastification', 'Plastification prévue', 'boolean'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 180
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'formats_souhaites', 'Formats de fichiers souhaités', 'multiselect'::public.field_type,
       '["PDF","PNG","JPG","SVG","AI","PSD","EPS","PDF prêt à imprimer (fond perdu)"]'::jsonb, NULL, NULL, 'Livraison',
       false, 190
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'delai', 'Délai souhaité', 'select'::public.field_type,
       '["Urgent (24-48 h)","Sous une semaine","Sous deux semaines","Pas de contrainte"]'::jsonb, NULL, NULL, 'Livraison',
       true, 200
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'budget', 'Budget indicatif', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 210
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'instructions', 'Instructions supplémentaires', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 220
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'menu' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
delete from public.service_form_fields sff
using public.service_forms sf, public.services s
where sff.form_id = sf.id and sf.service_id = s.id
  and s.slug = 'menu' and sf.version = 1
  and sff.key not in ('client_nom', 'client_entreprise', 'client_secteur', 'client_description', 'type_etablissement', 'type_cuisine', 'format_menu', 'nombre_sections', 'liste_plats', 'mentions_allergenes', 'langues', 'photos_plats', 'style_souhaite', 'couleurs_souhaitees', 'photos_a_utiliser', 'menu_actuel', 'fichiers_references', 'fichiers_documents', 'plastification', 'formats_souhaites', 'delai', 'budget', 'instructions');

-- ======================= Catalogue =======================
insert into public.services (
  slug, name, tagline, description, delivery_time, position, is_featured
)
values ('catalogue', 'Catalogue', 'Votre offre complète, bien présentée',
        'Catalogue produits multipage avec fiches structurées, prix et références.', '7 à 14 jours',
        90, false)
on conflict (slug) do update
set name = excluded.name, tagline = excluded.tagline,
    description = excluded.description, delivery_time = excluded.delivery_time,
    position = excluded.position, is_featured = excluded.is_featured;
insert into public.service_forms (service_id, name, description, version, is_active)
select s.id, 'Brief catalogue', NULL, 1, true
from public.services s where s.slug = 'catalogue'
on conflict (service_id, version) do update
set name = excluded.name, description = excluded.description, is_active = true;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_nom', 'Votre nom', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       true, 0
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'catalogue' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_entreprise', 'Nom de l''entreprise ou du projet', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       false, 10
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'catalogue' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_secteur', 'Secteur d''activité', 'text'::public.field_type,
       '[]'::jsonb, 'Restauration, informatique, mode…', NULL, 'Vos informations',
       false, 20
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'catalogue' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_description', 'Décrivez votre activité', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Quelques phrases suffisent : ce que vous faites, pour qui, ce qui vous distingue.', 'Vos informations',
       true, 30
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'catalogue' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'nombre_produits', 'Nombre de produits à présenter', 'integer'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Le projet',
       true, 40
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'catalogue' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'nombre_pages', 'Nombre de pages estimé', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Le projet',
       false, 50
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'catalogue' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'format_catalogue', 'Format', 'select'::public.field_type,
       '["A4 portrait","A5","Carré 21 x 21 cm","Format personnalisé"]'::jsonb, NULL, NULL, 'Le projet',
       true, 60
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'catalogue' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'organisation', 'Organisation du catalogue', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Par gamme, par catégorie, par usage…', 'Contenu',
       true, 70
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'catalogue' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'elements_fiche', 'Éléments par fiche produit', 'multiselect'::public.field_type,
       '["Photo","Nom","Référence","Description","Caractéristiques","Prix","Code-barres","QR code"]'::jsonb, NULL, NULL, 'Contenu',
       true, 80
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'catalogue' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'affichage_prix', 'Affichage des prix', 'select'::public.field_type,
       '["Prix visibles","Prix sur demande","Grille tarifaire séparée"]'::jsonb, NULL, NULL, 'Contenu',
       false, 90
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'catalogue' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'donnees_produits', 'Fichier de données produits', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Tableur listant vos produits, si vous en avez un.', 'Fichiers',
       false, 100
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'catalogue' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'photos_produits', 'Photos produits', 'files'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Fichiers',
       false, 110
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'catalogue' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'charte_existante', 'Charte graphique', 'files'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Fichiers',
       false, 120
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'catalogue' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'style_souhaite', 'Style de mise en page', 'multiselect'::public.field_type,
       '["Épuré","Dense","Magazine","Technique","Luxe"]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 130
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'catalogue' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_references', 'Références et inspirations', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Images, captures ou liens exportés qui illustrent ce que vous aimez.', 'Fichiers',
       false, 140
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'catalogue' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_documents', 'Documents utiles', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Textes, tarifs, plans, tout contenu à intégrer.', 'Fichiers',
       false, 150
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'catalogue' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'version_numerique', 'Version numérique interactive', 'boolean'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 160
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'catalogue' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'formats_souhaites', 'Formats de fichiers souhaités', 'multiselect'::public.field_type,
       '["PDF","PNG","JPG","SVG","AI","PSD","EPS","PDF interactif","InDesign"]'::jsonb, NULL, NULL, 'Livraison',
       false, 170
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'catalogue' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'delai', 'Délai souhaité', 'select'::public.field_type,
       '["Urgent (24-48 h)","Sous une semaine","Sous deux semaines","Pas de contrainte"]'::jsonb, NULL, NULL, 'Livraison',
       true, 180
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'catalogue' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'budget', 'Budget indicatif', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 190
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'catalogue' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'instructions', 'Instructions supplémentaires', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 200
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'catalogue' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
delete from public.service_form_fields sff
using public.service_forms sf, public.services s
where sff.form_id = sf.id and sf.service_id = s.id
  and s.slug = 'catalogue' and sf.version = 1
  and sff.key not in ('client_nom', 'client_entreprise', 'client_secteur', 'client_description', 'nombre_produits', 'nombre_pages', 'format_catalogue', 'organisation', 'elements_fiche', 'affichage_prix', 'donnees_produits', 'photos_produits', 'charte_existante', 'style_souhaite', 'fichiers_references', 'fichiers_documents', 'version_numerique', 'formats_souhaites', 'delai', 'budget', 'instructions');

-- ======================= Packaging =======================
insert into public.services (
  slug, name, tagline, description, delivery_time, position, is_featured
)
values ('packaging', 'Packaging', 'L''emballage qui fait vendre',
        'Conception d''emballage et d''étiquette, avec gabarit technique prêt pour l''imprimeur.', '7 à 14 jours',
        100, false)
on conflict (slug) do update
set name = excluded.name, tagline = excluded.tagline,
    description = excluded.description, delivery_time = excluded.delivery_time,
    position = excluded.position, is_featured = excluded.is_featured;
insert into public.service_forms (service_id, name, description, version, is_active)
select s.id, 'Brief packaging', NULL, 1, true
from public.services s where s.slug = 'packaging'
on conflict (service_id, version) do update
set name = excluded.name, description = excluded.description, is_active = true;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_nom', 'Votre nom', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       true, 0
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_entreprise', 'Nom de l''entreprise ou du projet', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       false, 10
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_secteur', 'Secteur d''activité', 'text'::public.field_type,
       '[]'::jsonb, 'Restauration, informatique, mode…', NULL, 'Vos informations',
       false, 20
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_description', 'Décrivez votre activité', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Quelques phrases suffisent : ce que vous faites, pour qui, ce qui vous distingue.', 'Vos informations',
       true, 30
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'nom_produit', 'Nom du produit', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Le produit',
       true, 40
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'type_emballage', 'Type d''emballage', 'select'::public.field_type,
       '["Boîte carton","Étiquette","Sachet souple","Pot / bocal","Bouteille","Tube","Blister","Sac"]'::jsonb, NULL, NULL, 'Le produit',
       true, 50
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'dimensions_produit', 'Dimensions de l''emballage', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Le produit',
       true, 60
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'contenance', 'Contenance', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Le produit',
       false, 70
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'gabarit_disponible', 'Gabarit technique fourni par l''imprimeur', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Le fichier de découpe, s''il vous a déjà été communiqué.', 'Fichiers',
       false, 80
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'mentions_obligatoires', 'Mentions obligatoires', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Composition, poids net, code-barres, DLC, coordonnées du fabricant…', 'Contenu',
       true, 90
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'argumentaire', 'Arguments à mettre en avant', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 100
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'code_barres', 'Code-barres à intégrer', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 110
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'gamme', 'Nombre de déclinaisons / parfums', 'text'::public.field_type,
       '[]'::jsonb, NULL, 'Si le packaging doit exister en plusieurs variantes.', 'Contenu',
       false, 120
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'style_souhaite', 'Style souhaité', 'multiselect'::public.field_type,
       '["Premium","Naturel","Ludique","Épuré","Coloré","Artisanal","Industriel"]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 130
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'couleurs_souhaitees', 'Couleurs souhaitées', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 140
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'finitions', 'Finitions envisagées', 'multiselect'::public.field_type,
       '["Mat","Brillant","Vernis sélectif","Dorure à chaud","Gaufrage","Kraft"]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 150
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'concurrents_rayon', 'Produits concurrents en rayon', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 160
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_references', 'Références et inspirations', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Images, captures ou liens exportés qui illustrent ce que vous aimez.', 'Fichiers',
       false, 170
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_documents', 'Documents utiles', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Textes, tarifs, plans, tout contenu à intégrer.', 'Fichiers',
       false, 180
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'formats_souhaites', 'Formats de fichiers souhaités', 'multiselect'::public.field_type,
       '["PDF","PNG","JPG","SVG","AI","PSD","EPS","Fichier de découpe","Illustrator"]'::jsonb, NULL, NULL, 'Livraison',
       false, 190
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'delai', 'Délai souhaité', 'select'::public.field_type,
       '["Urgent (24-48 h)","Sous une semaine","Sous deux semaines","Pas de contrainte"]'::jsonb, NULL, NULL, 'Livraison',
       true, 200
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'budget', 'Budget indicatif', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 210
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'instructions', 'Instructions supplémentaires', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 220
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'packaging' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
delete from public.service_form_fields sff
using public.service_forms sf, public.services s
where sff.form_id = sf.id and sf.service_id = s.id
  and s.slug = 'packaging' and sf.version = 1
  and sff.key not in ('client_nom', 'client_entreprise', 'client_secteur', 'client_description', 'nom_produit', 'type_emballage', 'dimensions_produit', 'contenance', 'gabarit_disponible', 'mentions_obligatoires', 'argumentaire', 'code_barres', 'gamme', 'style_souhaite', 'couleurs_souhaitees', 'finitions', 'concurrents_rayon', 'fichiers_references', 'fichiers_documents', 'formats_souhaites', 'delai', 'budget', 'instructions');

-- ======================= Retouche photo =======================
insert into public.services (
  slug, name, tagline, description, delivery_time, position, is_featured
)
values ('retouche-photo', 'Retouche photo', 'Des visuels prêts à publier',
        'Détourage, correction colorimétrique et nettoyage de vos photos produit ou portrait.', '1 à 3 jours',
        110, false)
on conflict (slug) do update
set name = excluded.name, tagline = excluded.tagline,
    description = excluded.description, delivery_time = excluded.delivery_time,
    position = excluded.position, is_featured = excluded.is_featured;
insert into public.service_forms (service_id, name, description, version, is_active)
select s.id, 'Brief retouche photo', NULL, 1, true
from public.services s where s.slug = 'retouche-photo'
on conflict (service_id, version) do update
set name = excluded.name, description = excluded.description, is_active = true;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_nom', 'Votre nom', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       true, 0
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'retouche-photo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_entreprise', 'Nom de l''entreprise ou du projet', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       false, 10
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'retouche-photo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_secteur', 'Secteur d''activité', 'text'::public.field_type,
       '[]'::jsonb, 'Restauration, informatique, mode…', NULL, 'Vos informations',
       false, 20
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'retouche-photo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_description', 'Décrivez votre activité', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Quelques phrases suffisent : ce que vous faites, pour qui, ce qui vous distingue.', 'Vos informations',
       true, 30
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'retouche-photo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'nombre_photos', 'Nombre de photos à retoucher', 'integer'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Le projet',
       true, 40
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'retouche-photo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'type_photos', 'Type de photos', 'select'::public.field_type,
       '["Photos produit","Portraits","Photos d''événement","Photos immobilières","Photos culinaires","Autre"]'::jsonb, NULL, NULL, 'Le projet',
       true, 50
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'retouche-photo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'retouches_demandees', 'Retouches demandées', 'multiselect'::public.field_type,
       '["Détourage / fond blanc","Correction des couleurs","Correction de l''exposition","Suppression d''éléments","Retouche de peau","Redressement / recadrage","Ajout d''ombre portée","Montage / composition","Agrandissement"]'::jsonb, NULL, NULL, 'Le projet',
       true, 60
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'retouche-photo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fond_souhaite', 'Fond souhaité', 'select'::public.field_type,
       '["Blanc","Transparent","Couleur unie","Fond d''origine conservé","Nouveau décor"]'::jsonb, NULL, NULL, 'Le projet',
       false, 70
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'retouche-photo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'consignes_precises', 'Consignes précises', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Indiquez photo par photo ce qui doit être modifié.', 'Le projet',
       true, 80
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'retouche-photo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'photos_originales', 'Photos à retoucher', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Fichiers d''origine, à la meilleure résolution disponible.', 'Fichiers',
       true, 90
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'retouche-photo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'exemples_rendu', 'Exemples du rendu attendu', 'files'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Fichiers',
       false, 100
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'retouche-photo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'dimensions_sortie', 'Dimensions de sortie', 'text'::public.field_type,
       '[]'::jsonb, '1500 x 1500 px', NULL, 'Livraison',
       false, 110
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'retouche-photo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'usage_final', 'Usage final', 'select'::public.field_type,
       '["Site e-commerce","Réseaux sociaux","Impression","Marketplace","Usage mixte"]'::jsonb, NULL, NULL, 'Livraison',
       false, 120
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'retouche-photo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'formats_souhaites', 'Formats de fichiers souhaités', 'multiselect'::public.field_type,
       '["PDF","PNG","JPG","SVG","AI","PSD","EPS","TIFF"]'::jsonb, NULL, NULL, 'Livraison',
       false, 130
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'retouche-photo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'delai', 'Délai souhaité', 'select'::public.field_type,
       '["Urgent (24-48 h)","Sous une semaine","Sous deux semaines","Pas de contrainte"]'::jsonb, NULL, NULL, 'Livraison',
       true, 140
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'retouche-photo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'budget', 'Budget indicatif', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 150
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'retouche-photo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'instructions', 'Instructions supplémentaires', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 160
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'retouche-photo' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
delete from public.service_form_fields sff
using public.service_forms sf, public.services s
where sff.form_id = sf.id and sf.service_id = s.id
  and s.slug = 'retouche-photo' and sf.version = 1
  and sff.key not in ('client_nom', 'client_entreprise', 'client_secteur', 'client_description', 'nombre_photos', 'type_photos', 'retouches_demandees', 'fond_souhaite', 'consignes_precises', 'photos_originales', 'exemples_rendu', 'dimensions_sortie', 'usage_final', 'formats_souhaites', 'delai', 'budget', 'instructions');

-- ======================= Autres créations =======================
insert into public.services (
  slug, name, tagline, description, delivery_time, position, is_featured
)
values ('autres-creations', 'Autres créations', 'Un projet qui n''entre dans aucune case',
        'Décrivez votre besoin : nous revenons vers vous avec une proposition et un devis.', 'Sur devis',
        120, false)
on conflict (slug) do update
set name = excluded.name, tagline = excluded.tagline,
    description = excluded.description, delivery_time = excluded.delivery_time,
    position = excluded.position, is_featured = excluded.is_featured;
insert into public.service_forms (service_id, name, description, version, is_active)
select s.id, 'Brief création sur mesure', NULL, 1, true
from public.services s where s.slug = 'autres-creations'
on conflict (service_id, version) do update
set name = excluded.name, description = excluded.description, is_active = true;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_nom', 'Votre nom', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       true, 0
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'autres-creations' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_entreprise', 'Nom de l''entreprise ou du projet', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Vos informations',
       false, 10
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'autres-creations' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_secteur', 'Secteur d''activité', 'text'::public.field_type,
       '[]'::jsonb, 'Restauration, informatique, mode…', NULL, 'Vos informations',
       false, 20
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'autres-creations' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'client_description', 'Décrivez votre activité', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Quelques phrases suffisent : ce que vous faites, pour qui, ce qui vous distingue.', 'Vos informations',
       true, 30
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'autres-creations' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'type_creation', 'Type de création souhaitée', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Le projet',
       true, 40
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'autres-creations' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'description_projet', 'Décrivez votre projet', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, 'Le plus précisément possible : à quoi cela sert, où cela sera utilisé, ce que cela doit provoquer.', 'Le projet',
       true, 50
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'autres-creations' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'dimensions_souhaitees', 'Dimensions ou format', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Le projet',
       false, 60
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'autres-creations' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'quantite', 'Quantité ou nombre de déclinaisons', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Le projet',
       false, 70
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'autres-creations' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'contenu_a_integrer', 'Contenu à intégrer', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Contenu',
       false, 80
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'autres-creations' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'style_souhaite', 'Style souhaité', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 90
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'autres-creations' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'couleurs_souhaitees', 'Couleurs souhaitées', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Direction artistique',
       false, 100
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'autres-creations' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'charte_existante', 'Charte graphique existante', 'files'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Fichiers',
       false, 110
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'autres-creations' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_references', 'Références et inspirations', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Images, captures ou liens exportés qui illustrent ce que vous aimez.', 'Fichiers',
       false, 120
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'autres-creations' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'fichiers_documents', 'Documents utiles', 'files'::public.field_type,
       '[]'::jsonb, NULL, 'Textes, tarifs, plans, tout contenu à intégrer.', 'Fichiers',
       false, 130
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'autres-creations' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'formats_souhaites', 'Formats de fichiers souhaités', 'multiselect'::public.field_type,
       '["PDF","PNG","JPG","SVG","AI","PSD","EPS"]'::jsonb, NULL, NULL, 'Livraison',
       false, 140
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'autres-creations' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'delai', 'Délai souhaité', 'select'::public.field_type,
       '["Urgent (24-48 h)","Sous une semaine","Sous deux semaines","Pas de contrainte"]'::jsonb, NULL, NULL, 'Livraison',
       true, 150
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'autres-creations' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'budget', 'Budget indicatif', 'text'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 160
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'autres-creations' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, 'instructions', 'Instructions supplémentaires', 'textarea'::public.field_type,
       '[]'::jsonb, NULL, NULL, 'Livraison',
       false, 170
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = 'autres-creations' and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;
delete from public.service_form_fields sff
using public.service_forms sf, public.services s
where sff.form_id = sf.id and sf.service_id = s.id
  and s.slug = 'autres-creations' and sf.version = 1
  and sff.key not in ('client_nom', 'client_entreprise', 'client_secteur', 'client_description', 'type_creation', 'description_projet', 'dimensions_souhaitees', 'quantite', 'contenu_a_integrer', 'style_souhaite', 'couleurs_souhaitees', 'charte_existante', 'fichiers_references', 'fichiers_documents', 'formats_souhaites', 'delai', 'budget', 'instructions');

commit;