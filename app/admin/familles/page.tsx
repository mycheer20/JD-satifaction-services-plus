import type { AdminListPageProps } from "@/lib/admin/page-types";
import { requireAdmin } from "@/features/auth/guards";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminFlash } from "@/components/admin/admin-flash";
import { TaxonomyTable } from "@/components/admin/taxonomy-table";
import { listFamilies } from "@/features/admin/queries";
import { saveFamily } from "@/features/admin/actions/catalog";

export default async function AdminFamiliesPage({
  searchParams,
}: AdminListPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const families = await listFamilies();

  return (
    <>
      <AdminFlash searchParams={params} />
      <AdminPageHeader
        title="Familles"
        description="Thèmes visuels du catalogue (informatique, gaming, bureau…) — réservé administrateurs."
      />
      <TaxonomyTable
        rows={families.map((f) => ({
          id: f.id,
          name: f.name,
          slug: f.slug,
          position: f.position,
          is_active: f.is_active,
        }))}
        saveAction={saveFamily}
      />
    </>
  );
}
