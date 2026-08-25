#!/usr/bin/env node
/**
 * Supprime les données de test sans toucher aux comptes ni au catalogue.
 *
 *   npm run db:clean-transactions
 *
 * Conserve : auth.users, user_profiles, produits, taxonomie, services, coupons.
 * Supprime  : commandes, paiements, notifications, demandes, avis, CMS design.
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

import pg from "pg";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

for (const file of [".env.local", ".env"]) {
  const path = join(root, file);
  if (existsSync(path)) dotenv.config({ path, override: false });
}

const connectionString = process.env.DATABASE_URL;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!connectionString) {
  console.error("DATABASE_URL manquant dans .env.local");
  process.exit(1);
}

const sqlPath = join(here, "clean-test-transactions.sql");
const sql = readFileSync(sqlPath, "utf8");

const client = new pg.Client({ connectionString });

/** Vide un bucket Storage (y compris sous-dossiers). */
async function emptyStorageBucket(supabase, bucketId) {
  if (!supabase) return 0;

  const paths = [];

  async function collect(prefix = "") {
    const { data, error } = await supabase.storage.from(bucketId).list(prefix, {
      limit: 1000,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) {
      console.warn(`Storage ${bucketId}${prefix ? `/${prefix}` : ""} : ${error.message}`);
      return;
    }
    if (!data?.length) return;

    for (const item of data) {
      const path = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id === null) {
        await collect(path);
      } else {
        paths.push(path);
      }
    }
  }

  await collect();
  if (paths.length === 0) return 0;

  const batchSize = 100;
  for (let i = 0; i < paths.length; i += batchSize) {
    const batch = paths.slice(i, i + batchSize);
    const { error } = await supabase.storage.from(bucketId).remove(batch);
    if (error) {
      console.warn(`Suppression ${bucketId} : ${error.message}`);
      return paths.length;
    }
  }

  return paths.length;
}

try {
  await client.connect();

  const { rows: before } = await client.query(`
    select 'orders' as tbl, count(*)::int as n from public.orders
    union all select 'design_media', count(*)::int from public.design_media
    union all select 'service_requests', count(*)::int from public.service_requests
    union all select 'user_profiles', count(*)::int from public.user_profiles
  `);
  console.log("Avant nettoyage :", Object.fromEntries(before.map((r) => [r.tbl, r.n])));

  console.log("\nNettoyage base de données (comptes et catalogue conservés)…");
  await client.query(sql);
  console.log("Base nettoyée.");

  if (supabaseUrl && serviceKey) {
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    console.log("\nNettoyage fichiers Storage…");
    for (const bucket of ["payment-proofs", "design-media"]) {
      const removed = await emptyStorageBucket(supabase, bucket);
      console.log(`  ${bucket} : ${removed} fichier(s) supprimé(s).`);
    }
  } else {
    console.log("\nStorage ignoré (NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY absent).");
  }

  const { rows: after } = await client.query(`
    select 'orders' as tbl, count(*)::int as n from public.orders
    union all select 'design_media', count(*)::int from public.design_media
    union all select 'products', count(*)::int from public.products
    union all select 'user_profiles', count(*)::int from public.user_profiles
  `);
  console.log("\nAprès nettoyage :", Object.fromEntries(after.map((r) => [r.tbl, r.n])));
  console.log("\nTerminé. Les comptes utilisateurs sont intacts.");
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  await client.end();
}
