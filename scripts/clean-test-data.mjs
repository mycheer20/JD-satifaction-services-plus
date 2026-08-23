#!/usr/bin/env node
/**
 * Supprime les données de test en prod/dev sans toucher à la taxonomie ni au code.
 *
 *   npm run db:clean-test
 *
 * Supprime : commandes, paiements, notifications admin, produits, avis, demandes design.
 * Conserve : familles, catégories, services, champs, marques, comptes utilisateurs.
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

const sqlPath = join(here, "clean-test-data.sql");
const sql = readFileSync(sqlPath, "utf8").replace(
  /-- Fichiers Storage[\s\S]*commit;/,
  "commit;",
);

const client = new pg.Client({ connectionString });

async function emptyStorageBucket(supabase, bucketId) {
  if (!supabase) return;
  const { data, error } = await supabase.storage.from(bucketId).list("", { limit: 1000 });
  if (error) {
    console.warn(`Storage ${bucketId} : ${error.message}`);
    return;
  }
  if (!data?.length) return;

  const paths = data.map((item) => item.name).filter(Boolean);
  if (paths.length === 0) return;

  const { error: removeError } = await supabase.storage.from(bucketId).remove(paths);
  if (removeError) {
    console.warn(`Suppression ${bucketId} : ${removeError.message}`);
  } else {
    console.log(`Storage ${bucketId} : ${paths.length} fichier(s) supprimé(s).`);
  }
}

try {
  await client.connect();
  console.log("Nettoyage base de données…");
  await client.query(sql);
  console.log("Base nettoyée.");

  if (supabaseUrl && serviceKey) {
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    console.log("Nettoyage fichiers Storage…");
    await emptyStorageBucket(supabase, "product-images");
    await emptyStorageBucket(supabase, "payment-proofs");
  } else {
    console.log("Storage ignoré (clés Supabase absentes).");
  }

  const { rows } = await client.query(`
    select 'orders' as tbl, count(*)::int as n from orders
    union all select 'products', count(*)::int from products
    union all select 'admin_notifications', count(*)::int from admin_notifications
  `);
  console.log("État après nettoyage :", Object.fromEntries(rows.map((r) => [r.tbl, r.n])));
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  await client.end();
}
