#!/usr/bin/env node
/**
 * Loads the reference data through the Supabase REST API.
 *
 *   npm run db:seed:api
 *
 * `db:seed` needs DATABASE_URL, which means the database password. This path
 * only needs SUPABASE_SERVICE_ROLE_KEY, so it works on a project where the
 * password was never recorded. It reads the same definitions in
 * `supabase/taxonomy/`, and shares the slug resolution with the SQL generator,
 * so both routes produce identical rows.
 *
 * Every write is an upsert on a natural key, so the command is re-runnable.
 */

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

import { fieldSets } from "../supabase/taxonomy/field-sets.mjs";
import { services } from "../supabase/taxonomy/services.mjs";
import { resolveSlugs } from "../supabase/taxonomy/slugs.mjs";
import { slugify } from "../supabase/taxonomy/helpers.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const file of [".env.local", ".env"]) {
  const path = join(root, file);
  if (existsSync(path)) dotenv.config({ path, override: false });
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis dans .env.local.",
  );
  process.exit(1);
}

const db = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** PostgREST rejects very large payloads, so writes go out in slices. */
const CHUNK = 500;

async function upsert(table, rows, onConflict) {
  for (let i = 0; i < rows.length; i += CHUNK) {
    const { error } = await db
      .from(table)
      .upsert(rows.slice(i, i + CHUNK), { onConflict });
    if (error) throw new Error(`${table}: ${error.message}`);
  }
}

async function selectAll(table, columns) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db
      .from(table)
      .select(columns)
      .range(from, from + 999);
    if (error) throw new Error(`${table}: ${error.message}`);
    rows.push(...data);
    if (data.length < 1000) return rows;
  }
}

function step(label) {
  process.stdout.write(`  ${label} … `);
  return Date.now();
}

function done(started, detail) {
  console.log(`${detail} (${Date.now() - started} ms)`);
}

// ---------------------------------------------------------------------------
// Field sets
// ---------------------------------------------------------------------------

async function seedFieldSets() {
  let t = step("jeux de champs");
  await upsert(
    "field_sets",
    fieldSets.map((s) => ({
      key: s.key,
      name: s.name,
      description: s.description ?? null,
    })),
    "key",
  );

  const idByKey = new Map(
    (await selectAll("field_sets", "id, key")).map((r) => [r.key, r.id]),
  );
  done(t, `${fieldSets.length}`);

  t = step("définitions de champs");
  const definitions = fieldSets.flatMap((set) =>
    set.fields.map((f, index) => ({
      field_set_id: idByKey.get(set.key),
      key: f.key,
      label: f.label,
      type: f.type,
      unit: f.unit ?? null,
      options: f.options ?? [],
      placeholder: f.placeholder ?? null,
      help_text: f.helpText ?? null,
      group_label: f.group ?? null,
      is_required: f.required ?? false,
      is_filterable: f.filterable ?? false,
      is_key_spec: f.keySpec ?? false,
      position: index * 10,
    })),
  );
  await upsert("field_definitions", definitions, "field_set_id,key");

  // A field renamed in the source would otherwise survive as an orphan row and
  // keep showing up in the admin form.
  const wanted = new Set(definitions.map((d) => `${d.field_set_id}:${d.key}`));
  const stale = (await selectAll("field_definitions", "id, field_set_id, key")).filter(
    (r) => !wanted.has(`${r.field_set_id}:${r.key}`),
  );
  if (stale.length > 0) {
    const { error } = await db
      .from("field_definitions")
      .delete()
      .in("id", stale.map((r) => r.id));
    if (error) throw new Error(`field_definitions (purge): ${error.message}`);
  }
  done(t, `${definitions.length}${stale.length ? `, ${stale.length} obsolètes supprimées` : ""}`);
}

// ---------------------------------------------------------------------------
// Taxonomy
// ---------------------------------------------------------------------------

async function seedTaxonomy(resolved) {
  let t = step("familles");
  await upsert(
    "families",
    resolved.map((f) => ({
      slug: f.slug,
      name: f.name,
      description: f.description ?? null,
      icon: f.icon ?? null,
      position: f.position,
    })),
    "slug",
  );
  const familyIdBySlug = new Map(
    (await selectAll("families", "id, slug")).map((r) => [r.slug, r.id]),
  );
  done(t, `${resolved.length}`);

  t = step("catégories");
  const categories = resolved.flatMap((f) =>
    f.categories.map((c) => ({
      family_id: familyIdBySlug.get(f.slug),
      slug: c.slug,
      name: c.name,
      position: c.position,
    })),
  );
  await upsert("categories", categories, "slug");
  const categoryIdBySlug = new Map(
    (await selectAll("categories", "id, slug")).map((r) => [r.slug, r.id]),
  );
  done(t, `${categories.length}`);

  t = step("sous-catégories");
  const fieldSetIdByKey = new Map(
    (await selectAll("field_sets", "id, key")).map((r) => [r.key, r.id]),
  );
  const subcategories = resolved.flatMap((f) =>
    f.categories.flatMap((c) =>
      c.subcategories.map((s) => ({
        category_id: categoryIdBySlug.get(c.slug),
        field_set_id: fieldSetIdByKey.get(s.set) ?? null,
        slug: s.slug,
        name: s.name,
        position: s.position,
      })),
    ),
  );
  await upsert("subcategories", subcategories, "slug");
  done(t, `${subcategories.length}`);
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

async function seedServices() {
  let t = step("services");
  const rows = services.map((s, index) => ({
    slug: slugify(s.name),
    name: s.name,
    tagline: s.tagline ?? null,
    description: s.description ?? null,
    delivery_time: s.deliveryTime ?? null,
    position: index * 10,
    is_featured: s.featured ?? false,
  }));
  await upsert("services", rows, "slug");
  const serviceIdBySlug = new Map(
    (await selectAll("services", "id, slug")).map((r) => [r.slug, r.id]),
  );
  done(t, `${rows.length}`);

  t = step("formulaires de brief");
  await upsert(
    "service_forms",
    services.map((s) => ({
      service_id: serviceIdBySlug.get(slugify(s.name)),
      name: s.form.name,
      description: s.form.description ?? null,
      version: 1,
      is_active: true,
    })),
    "service_id,version",
  );
  const formIdByService = new Map(
    (await selectAll("service_forms", "id, service_id, version"))
      .filter((r) => r.version === 1)
      .map((r) => [r.service_id, r.id]),
  );
  done(t, `${services.length}`);

  t = step("champs de brief");
  const fields = services.flatMap((s) =>
    s.form.fields.map((f, i) => ({
      form_id: formIdByService.get(serviceIdBySlug.get(slugify(s.name))),
      key: f.key,
      label: f.label,
      type: f.type,
      options: f.options ?? [],
      placeholder: f.placeholder ?? null,
      help_text: f.helpText ?? null,
      group_label: f.group ?? null,
      is_required: f.required ?? false,
      position: i * 10,
    })),
  );
  await upsert("service_form_fields", fields, "form_id,key");

  const wanted = new Set(fields.map((f) => `${f.form_id}:${f.key}`));
  const stale = (await selectAll("service_form_fields", "id, form_id, key")).filter(
    (r) => !wanted.has(`${r.form_id}:${r.key}`),
  );
  if (stale.length > 0) {
    const { error } = await db
      .from("service_form_fields")
      .delete()
      .in("id", stale.map((r) => r.id));
    if (error) throw new Error(`service_form_fields (purge): ${error.message}`);
  }
  done(t, `${fields.length}${stale.length ? `, ${stale.length} obsolètes supprimés` : ""}`);
}

// ---------------------------------------------------------------------------

try {
  const { resolved, collisions } = resolveSlugs();

  await seedFieldSets();
  await seedTaxonomy(resolved);
  await seedServices();

  if (collisions.length > 0) {
    console.log(`\n${collisions.length} slugs désambiguïsés :`);
    for (const c of collisions) console.log(`  ${c}`);
  }
  console.log("\nSeed appliqué.");
} catch (error) {
  console.error(`\nÉchec : ${error.message}`);
  process.exitCode = 1;
}
