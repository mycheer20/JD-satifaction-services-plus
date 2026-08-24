#!/usr/bin/env node
/**
 * Grants the admin (or staff) role to an existing account.
 *
 *   npm run admin:promote -- vous@exemple.com
 *   npm run admin:promote -- collegue@exemple.com staff
 *
 * Roles are never granted through the application itself: the first admin has
 * to be created deliberately, from a machine that holds the service-role key.
 */

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const file of [".env.local", ".env"]) {
  const path = join(root, file);
  if (existsSync(path)) dotenv.config({ path, override: false });
}

const [email, role = "admin"] = process.argv.slice(2);

if (!email) {
  console.error("Usage : npm run admin:promote -- <email> [admin|staff|designer|customer]");
  process.exit(1);
}

if (!["admin", "staff", "customer", "designer"].includes(role)) {
  console.error(`Rôle invalide : ${role}`);
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis dans .env.local.",
  );
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const normalized = email.trim().toLowerCase();
let user = null;

for (let page = 1; page <= 20 && !user; page += 1) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
  if (error) {
    console.error(`Impossible de lister les comptes : ${error.message}`);
    process.exit(1);
  }
  user = data.users.find((u) => u.email?.toLowerCase() === normalized) ?? null;
  if (data.users.length < 200) break;
}

if (!user) {
  console.error(
    `Aucun compte trouvé pour ${email}. Créez d'abord le compte via /connexion, puis relancez.`,
  );
  process.exit(1);
}

const { error } = await supabase
  .from("user_profiles")
  .upsert({ id: user.id, role }, { onConflict: "id" });

if (error) {
  console.error(`Échec de la mise à jour : ${error.message}`);
  process.exit(1);
}

console.log(`${email} a désormais le rôle « ${role} ».`);
