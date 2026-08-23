import type { AdminListPageProps } from "@/lib/admin/page-types";
import { requireAdmin } from "@/features/auth/guards";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminFlash } from "@/components/admin/admin-flash";
import { TaxonomyTable } from "@/components/admin/taxonomy-table";
import { listCategories, listFamilies } from "@/features/admin/queries";
import { saveCategory } from "@/features/admin/actions/catalog";

export default async function AdminCategoriesPage({
  searchParams,
}: AdminListPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const [categories, families] = await Promise.all([listCategories(), listFamilies()]);

  return (
    <>
      <AdminFlash searchParams={params} />
      <AdminPageHeader
        title="Catégories"
        description="Organisation du catalogue par famille — réservé administrateurs."
      />
      <TaxonomyTable
        rows={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          position: c.position,
          is_active: c.is_active,
          meta: (c.family as unknown as { name: string } | null)?.name,
        }))}
        saveAction={saveCategory}
        parentField={{
          name: "family_id",
          label: "Famille",
          options: families.map((f) => ({ value: f.id, label: f.name })),
        }}
      />
    </>
  );
}
