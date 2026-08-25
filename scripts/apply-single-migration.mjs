#!/usr/bin/env node
/**
 * Applique un fichier de migration SQL via DATABASE_URL ou SUPABASE_DB_PASSWORD.
 * Gère les mots de passe contenant des caractères spéciaux (@, #, etc.).
 *
 *   node scripts/apply-single-migration.mjs supabase/migrations/0018_delivery_geography.sql
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

import pg from "pg";
import dotenv from "dotenv";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

for (const file of [".env.local", ".env"]) {
  const path = join(root, file);
  if (existsSync(path)) dotenv.config({ path, override: false });
}

const sqlFile = process.argv[2];
if (!sqlFile) {
  console.error("Usage: node scripts/apply-single-migration.mjs <path-to.sql>");
  process.exit(1);
}

const sqlPath = resolve(root, sqlFile);
const sql = readFileSync(sqlPath, "utf8");

function buildClientConfig() {
  const directPassword = process.env.SUPABASE_DB_PASSWORD?.trim();
  const rawUrl = process.env.DATABASE_URL?.trim();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (directPassword) {
    const ref = supabaseUrl?.match(/https:\/\/([^.]+)\./)?.[1];
    const host = process.env.SUPABASE_DB_HOST?.trim() || (ref ? `db.${ref}.supabase.co` : null);
    if (!host) {
      console.error("SUPABASE_DB_HOST ou NEXT_PUBLIC_SUPABASE_URL requis avec SUPABASE_DB_PASSWORD");
      process.exit(1);
    }
    return {
      host,
      port: 5432,
      user: "postgres",
      password: directPassword,
      database: "postgres",
      ssl: { rejectUnauthorized: false },
    };
  }

  if (!rawUrl) {
    console.error("DATABASE_URL ou SUPABASE_DB_PASSWORD requis dans .env.local");
    process.exit(1);
  }

  // Mot de passe avec @ : extraire via l'hôte connu (db.<ref>.supabase.co)
  const ref = supabaseUrl?.match(/https:\/\/([^.]+)\./)?.[1];
  const dbHost = ref ? `db.${ref}.supabase.co` : null;
  if (dbHost && rawUrl.includes(`@${dbHost}`)) {
    const prefix = "postgresql://postgres:";
    const marker = `@${dbHost}`;
    const start = rawUrl.indexOf(prefix);
    const end = rawUrl.indexOf(marker);
    if (start === 0 && end > prefix.length) {
      const password = decodeURIComponent(rawUrl.slice(prefix.length, end));
      return {
        host: dbHost,
        port: 5432,
        user: "postgres",
        password,
        database: "postgres",
        ssl: { rejectUnauthorized: false },
      };
    }
  }

  return {
    connectionString: rawUrl,
    ssl: rawUrl.includes("localhost") ? false : { rejectUnauthorized: false },
  };
}

const client = new pg.Client(buildClientConfig());

try {
  await client.connect();
  console.log(`Application de ${sqlFile}…`);
  const started = Date.now();
  await client.query(sql);
  console.log(`OK (${Date.now() - started} ms)`);
} catch (error) {
  console.error(`Échec : ${error.message}`);
  process.exitCode = 1;
} finally {
  await client.end();
}
