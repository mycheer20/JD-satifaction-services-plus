import type { AdminListPageProps } from "@/lib/admin/page-types";
import { requireAdmin } from "@/features/auth/guards";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminFlash } from "@/components/admin/admin-flash";
import { TaxonomyTable } from "@/components/admin/taxonomy-table";
import { listCategories, listFieldSets, listSubcategories } from "@/features/admin/queries";
import { saveSubcategory } from "@/features/admin/actions/catalog";

export default async function AdminSubcategoriesPage({
  searchParams,
}: AdminListPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const [subcategories, categories, fieldSets] = await Promise.all([
    listSubcategories(),
    listCategories(),
    listFieldSets(),
  ]);

  return (
    <>
      <AdminFlash searchParams={params} />
      <AdminPageHeader
        title="Sous-catégories"
        description="Niveau le plus fin du catalogue — lie chaque produit à un jeu de champs dynamiques."
      />
      <TaxonomyTable
        rows={subcategories.map((s) => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
          position: s.position,
          is_active: s.is_active,
          meta: [
            (s.category as unknown as { name: string; family?: { name: string } } | null)?.family?.name,
            (s.category as unknown as { name: string } | null)?.name,
          ]
            .filter(Boolean)
            .join(" › "),
        }))}
        saveAction={saveSubcategory}
        parentField={{
          name: "category_id",
          label: "Catégorie",
          options: categories.map((c) => ({ value: c.id, label: c.name })),
        }}
        secondaryField={{
          name: "field_set_id",
          label: "Jeu de champs",
          options: [
            { value: "", label: "Aucun" },
            ...fieldSets.map((fs) => ({ value: fs.id, label: fs.name })),
          ],
        }}
      />
    </>
  );
}
