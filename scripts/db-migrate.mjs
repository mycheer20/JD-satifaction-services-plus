#!/usr/bin/env node
/**
 * Applies every migration then every seed, in filename order, against
 * DATABASE_URL.
 *
 *   npm run db:migrate          -- migrations + seeds
 *   npm run db:migrate -- --seed-only
 *   npm run db:migrate -- --migrations-only
 *
 * DATABASE_URL is the "Connection string" from Supabase (Project settings ->
 * Database). Both migrations and seeds are written to be re-runnable, so this
 * command is safe to repeat.
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
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

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error(
    "DATABASE_URL est absent. Ajoutez-le à .env.local :\n" +
      "  DATABASE_URL=postgresql://postgres.<ref>:<mot-de-passe>@aws-0-<region>.pooler.supabase.com:5432/postgres",
  );
  process.exit(1);
}

const args = new Set(process.argv.slice(2));
const runMigrations = !args.has("--seed-only");
const runSeeds = !args.has("--migrations-only");

function sqlFilesIn(folder) {
  const path = join(root, "supabase", folder);
  if (!existsSync(path)) return [];
  return readdirSync(path)
    .filter((f) => f.endsWith(".sql"))
    .sort()
    .map((f) => ({ label: `${folder}/${f}`, path: join(path, f) }));
}

const files = [
  ...(runMigrations ? sqlFilesIn("migrations") : []),
  ...(runSeeds ? sqlFilesIn("seed") : []),
];

if (files.length === 0) {
  console.error("Aucun fichier SQL à appliquer.");
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
});

try {
  await client.connect();
  for (const file of files) {
    process.stdout.write(`  ${file.label} … `);
    const started = Date.now();
    await client.query(readFileSync(file.path, "utf8"));
    console.log(`ok (${Date.now() - started} ms)`);
  }
  console.log(`\n${files.length} fichiers appliqués.`);
} catch (error) {
  console.error(`\nÉchec : ${error.message}`);
  if (error.position) console.error(`Position : ${error.position}`);
  process.exitCode = 1;
} finally {
  await client.end();
}
