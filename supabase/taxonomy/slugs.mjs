/**
 * Slug resolution for the commercial tree.
 *
 * Slugs are the public URLs, so this has to produce the same result whichever
 * seeding path runs. It lives here rather than in `generate.mjs` so the SQL
 * generator and the API seeder share one implementation and cannot drift.
 */

import { slugify } from "./helpers.mjs";
import { families } from "./taxonomy.mjs";

/**
 * Resolves globally unique slugs. A name that collides with one already taken
 * at the same level gets its parent slug appended, which is both readable and
 * stable as long as the names do not change.
 */
export function resolveSlugs() {
  const familySlugs = new Set();
  const categorySlugs = new Set();
  const subcategorySlugs = new Set();
  const collisions = [];

  const take = (registry, base, parentSlug, label) => {
    let slug = base;
    if (registry.has(slug)) {
      slug = `${base}-${parentSlug}`;
      collisions.push(`${label}: "${base}" -> "${slug}"`);
    }
    if (registry.has(slug)) {
      let n = 2;
      while (registry.has(`${slug}-${n}`)) n += 1;
      slug = `${slug}-${n}`;
    }
    registry.add(slug);
    return slug;
  };

  const resolved = families.map((family, fi) => {
    const familySlug = take(familySlugs, slugify(family.name), "", family.name);
    return {
      ...family,
      slug: familySlug,
      position: fi * 10,
      categories: family.categories.map((category, ci) => {
        const categorySlug = take(
          categorySlugs,
          slugify(category.name),
          familySlug,
          category.name,
        );
        return {
          ...category,
          slug: categorySlug,
          position: ci * 10,
          subcategories: category.subcategories.map((sub, si) => ({
            ...sub,
            slug: take(
              subcategorySlugs,
              slugify(sub.name),
              categorySlug,
              sub.name,
            ),
            position: si * 10,
          })),
        };
      }),
    };
  });

  return { resolved, collisions };
}
