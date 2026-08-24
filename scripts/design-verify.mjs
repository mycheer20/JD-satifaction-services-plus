#!/usr/bin/env node
/**
 * Vérification structurelle du CMS Design (Phase 10).
 * Complète les tests unitaires Vitest — ne remplace pas les tests manuels E2E.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
let failed = 0;

function ok(message) {
  console.log(`  ✓ ${message}`);
}

function fail(message) {
  console.error(`  ✗ ${message}`);
  failed += 1;
}

function pagePath(href) {
  if (href === "/design") return join(ROOT, "app/design/page.tsx");
  return join(ROOT, "app", href.slice(1), "page.tsx");
}

const DESIGN_ROUTES = [
  "/design",
  "/design/publication",
  "/design/apparence",
  "/design/mediatheque",
  "/design/accueil",
  "/design/a-propos",
  "/design/galerie",
  "/design/animations",
];

const REQUIRED_PLACEMENTS = ["site.motion", "home.hero", "about.hero", "about.gallery"];

console.log("\nDesign CMS — vérification structurelle\n");

for (const href of DESIGN_ROUTES) {
  const path = pagePath(href);
  if (existsSync(path)) ok(`Route ${href}`);
  else fail(`Route manquante : ${href}`);
}

for (const route of ["/", "/a-propos", "/galerie"]) {
  const path =
    route === "/"
      ? join(ROOT, "app/(storefront)/page.tsx")
      : join(ROOT, "app/(storefront)", route.slice(1), "page.tsx");
  if (existsSync(path)) ok(`Storefront ${route}`);
  else fail(`Storefront manquant : ${route}`);
}

const placementsSource = join(ROOT, "lib/design/placements.ts");
if (existsSync(placementsSource)) {
  const text = readFileSync(placementsSource, "utf8");
  for (const id of REQUIRED_PLACEMENTS) {
    if (text.includes(`"${id}"`)) ok(`Placement ${id}`);
    else fail(`Placement manquant dans placements.ts : ${id}`);
  }
} else {
  fail("lib/design/placements.ts introuvable");
}

const keyFiles = [
  "lib/design/defaults.ts",
  "lib/design/motion-defaults.ts",
  "lib/design/preview.ts",
  "features/design/actions/publication.ts",
  "components/storefront/design-preview-banner.tsx",
  "tests/design/motion.test.ts",
];

for (const file of keyFiles) {
  if (existsSync(join(ROOT, file))) ok(`Fichier ${file}`);
  else fail(`Fichier manquant : ${file}`);
}

console.log("");
if (failed > 0) {
  console.error(`Échec : ${failed} problème(s).\n`);
  process.exit(1);
}

console.log("Toutes les vérifications structurelles sont passées.\n");
