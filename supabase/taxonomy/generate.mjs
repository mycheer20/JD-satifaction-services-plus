#!/usr/bin/env node
/**
 * Generates the seed SQL from the definitions in this folder.
 *
 *   npm run seed:generate
 *
 * The output is idempotent: every statement upserts on a natural key (slug or
 * key), so running the seed twice changes nothing. It also prunes field
 * definitions and service form fields that no longer exist in the source,
 * which keeps a renamed field from lingering in the database.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { slugify, sql, json } from "./helpers.mjs";
import { fieldSets } from "./field-sets.mjs";
import { services } from "./services.mjs";
import { resolveSlugs } from "./slugs.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "seed");

const header = (title) => `-- ${title}
-- GENERATED FILE — do not edit by hand.
-- Source: supabase/taxonomy/*.mjs   Regenerate with: npm run seed:generate

`;

// ---------------------------------------------------------------------------
// Field sets
// ---------------------------------------------------------------------------

function buildFieldSetsSeed() {
  const lines = [header("Seed 001 — Field sets and field definitions")];
  lines.push("begin;\n");

  for (const set of fieldSets) {
    lines.push(`-- ${set.name}`);
    lines.push(`insert into public.field_sets (key, name, description)
values (${sql(set.key)}, ${sql(set.name)}, ${sql(set.description ?? null)})
on conflict (key) do update
set name = excluded.name, description = excluded.description;\n`);

    set.fields.forEach((f, index) => {
      lines.push(`insert into public.field_definitions (
  field_set_id, key, label, type, unit, options, placeholder, help_text,
  group_label, is_required, is_filterable, is_key_spec, position
)
select fs.id, ${sql(f.key)}, ${sql(f.label)}, ${sql(f.type)}::public.field_type,
       ${sql(f.unit)}, ${json(f.options)}, ${sql(f.placeholder)}, ${sql(f.helpText)},
       ${sql(f.group)}, ${sql(f.required)}, ${sql(f.filterable)}, ${sql(f.keySpec)}, ${index * 10}
from public.field_sets fs where fs.key = ${sql(set.key)}
on conflict (field_set_id, key) do update
set label = excluded.label, type = excluded.type, unit = excluded.unit,
    options = excluded.options, placeholder = excluded.placeholder,
    help_text = excluded.help_text, group_label = excluded.group_label,
    is_required = excluded.is_required, is_filterable = excluded.is_filterable,
    is_key_spec = excluded.is_key_spec, position = excluded.position;`);
    });

    const keys = set.fields.map((f) => sql(f.key)).join(", ");
    lines.push(`delete from public.field_definitions fd
using public.field_sets fs
where fd.field_set_id = fs.id and fs.key = ${sql(set.key)}
  and fd.key not in (${keys});\n`);
  }

  lines.push("commit;");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Taxonomy
// ---------------------------------------------------------------------------

function buildTaxonomySeed(resolved) {
  const lines = [header("Seed 002 — Families, categories and subcategories")];
  lines.push("begin;\n");

  for (const family of resolved) {
    lines.push(`-- ======================= ${family.name} =======================`);
    lines.push(`insert into public.families (slug, name, description, icon, position)
values (${sql(family.slug)}, ${sql(family.name)}, ${sql(family.description ?? null)}, ${sql(family.icon ?? null)}, ${family.position})
on conflict (slug) do update
set name = excluded.name, description = excluded.description,
    icon = excluded.icon, position = excluded.position;\n`);

    for (const category of family.categories) {
      lines.push(`insert into public.categories (family_id, slug, name, position)
select f.id, ${sql(category.slug)}, ${sql(category.name)}, ${category.position}
from public.families f where f.slug = ${sql(family.slug)}
on conflict (slug) do update
set family_id = excluded.family_id, name = excluded.name, position = excluded.position;`);

      for (const sub of category.subcategories) {
        lines.push(`insert into public.subcategories (category_id, field_set_id, slug, name, position)
select c.id, fs.id, ${sql(sub.slug)}, ${sql(sub.name)}, ${sub.position}
from public.categories c
left join public.field_sets fs on fs.key = ${sql(sub.set)}
where c.slug = ${sql(category.slug)}
on conflict (slug) do update
set category_id = excluded.category_id, field_set_id = excluded.field_set_id,
    name = excluded.name, position = excluded.position;`);
      }
      lines.push("");
    }
  }

  lines.push("commit;");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

function buildServicesSeed() {
  const lines = [header("Seed 003 — Design services and their brief forms")];
  lines.push("begin;\n");

  services.forEach((service, index) => {
    const slug = slugify(service.name);
    lines.push(`-- ======================= ${service.name} =======================`);
    lines.push(`insert into public.services (
  slug, name, tagline, description, delivery_time, position, is_featured
)
values (${sql(slug)}, ${sql(service.name)}, ${sql(service.tagline ?? null)},
        ${sql(service.description ?? null)}, ${sql(service.deliveryTime ?? null)},
        ${index * 10}, ${sql(service.featured ?? false)})
on conflict (slug) do update
set name = excluded.name, tagline = excluded.tagline,
    description = excluded.description, delivery_time = excluded.delivery_time,
    position = excluded.position, is_featured = excluded.is_featured;`);

    lines.push(`insert into public.service_forms (service_id, name, description, version, is_active)
select s.id, ${sql(service.form.name)}, ${sql(service.form.description ?? null)}, 1, true
from public.services s where s.slug = ${sql(slug)}
on conflict (service_id, version) do update
set name = excluded.name, description = excluded.description, is_active = true;`);

    service.form.fields.forEach((f, i) => {
      lines.push(`insert into public.service_form_fields (
  form_id, key, label, type, options, placeholder, help_text, group_label,
  is_required, position
)
select sf.id, ${sql(f.key)}, ${sql(f.label)}, ${sql(f.type)}::public.field_type,
       ${json(f.options)}, ${sql(f.placeholder)}, ${sql(f.helpText)}, ${sql(f.group)},
       ${sql(f.required)}, ${i * 10}
from public.service_forms sf
join public.services s on s.id = sf.service_id
where s.slug = ${sql(slug)} and sf.version = 1
on conflict (form_id, key) do update
set label = excluded.label, type = excluded.type, options = excluded.options,
    placeholder = excluded.placeholder, help_text = excluded.help_text,
    group_label = excluded.group_label, is_required = excluded.is_required,
    position = excluded.position;`);
    });

    const keys = service.form.fields.map((f) => sql(f.key)).join(", ");
    lines.push(`delete from public.service_form_fields sff
using public.service_forms sf, public.services s
where sff.form_id = sf.id and sf.service_id = s.id
  and s.slug = ${sql(slug)} and sf.version = 1
  and sff.key not in (${keys});\n`);
  });

  lines.push("commit;");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------

function main() {
  const knownSets = new Set(fieldSets.map((f) => f.key));
  const { resolved, collisions } = resolveSlugs();

  const missing = [];
  let familyCount = 0;
  let categoryCount = 0;
  let subcategoryCount = 0;

  for (const family of resolved) {
    familyCount += 1;
    for (const category of family.categories) {
      categoryCount += 1;
      for (const sub of category.subcategories) {
        subcategoryCount += 1;
        if (!knownSets.has(sub.set)) {
          missing.push(`${family.name} > ${category.name} > ${sub.name}: "${sub.set}"`);
        }
      }
    }
  }

  if (missing.length > 0) {
    console.error("Jeux de champs introuvables :");
    for (const m of missing) console.error(`  - ${m}`);
    process.exit(1);
  }

  const duplicateFieldKeys = [];
  for (const set of fieldSets) {
    const seen = new Set();
    for (const f of set.fields) {
      if (seen.has(f.key)) duplicateFieldKeys.push(`${set.key}.${f.key}`);
      seen.add(f.key);
    }
  }
  if (duplicateFieldKeys.length > 0) {
    console.error(`Clés de champ dupliquées : ${duplicateFieldKeys.join(", ")}`);
    process.exit(1);
  }

  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "001_field_sets.sql"), buildFieldSetsSeed(), "utf8");
  writeFileSync(join(outDir, "002_taxonomy.sql"), buildTaxonomySeed(resolved), "utf8");
  writeFileSync(join(outDir, "003_services.sql"), buildServicesSeed(), "utf8");

  const fieldCount = fieldSets.reduce((n, s) => n + s.fields.length, 0);
  const serviceFieldCount = services.reduce((n, s) => n + s.form.fields.length, 0);

  console.log("Seed généré dans supabase/seed/");
  console.log(`  ${fieldSets.length} jeux de champs, ${fieldCount} champs produit`);
  console.log(`  ${familyCount} familles, ${categoryCount} catégories, ${subcategoryCount} sous-catégories`);
  console.log(`  ${services.length} services, ${serviceFieldCount} champs de brief`);
  if (collisions.length > 0) {
    console.log(`  ${collisions.length} slugs désambiguïsés :`);
    for (const c of collisions) console.log(`    ${c}`);
  }
}

main();
