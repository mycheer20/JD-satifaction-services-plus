import type { AdminListPageProps } from "@/lib/admin/page-types";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminFlash } from "@/components/admin/admin-flash";
import {
  AdminTable,
  AdminTableElement,
  AdminTd,
  AdminTh,
  AdminTr,
} from "@/components/admin/admin-table";
import { listBrands } from "@/features/admin/queries";
import { saveBrand, deleteBrand } from "@/features/admin/actions/brands";
import { FieldShell, TextInput } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function AdminBrandsPage({
  searchParams,
}: AdminListPageProps) {
  const params = await searchParams;
  const brands = await listBrands();

  return (
    <>
      <AdminFlash searchParams={params} />
      <AdminPageHeader
        title="Marques"
        description="Gérez les marques affichées dans les filtres et fiches produits."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <AdminTable>
          <AdminTableElement>
            <thead>
              <tr>
                <AdminTh>Nom</AdminTh>
                <AdminTh>Slug</AdminTh>
                <AdminTh />
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <AdminTr key={brand.id}>
                  <AdminTd className="font-semibold">{brand.name}</AdminTd>
                  <AdminTd className="text-muted">{brand.slug}</AdminTd>
                  <AdminTd>
                    <form action={deleteBrand} className="inline">
                      <input type="hidden" name="id" value={brand.id} />
                      <Button type="submit" variant="ghost" size="sm">
                        Supprimer
                      </Button>
                    </form>
                  </AdminTd>
                </AdminTr>
              ))}
            </tbody>
          </AdminTableElement>
        </AdminTable>

        <Card padding="md">
          <h2 className="mb-4 text-base font-bold">Ajouter une marque</h2>
          <form action={saveBrand} className="space-y-4">
            <FieldShell label="Nom" htmlFor="brand-name" required>
              <TextInput id="brand-name" name="name" required />
            </FieldShell>
            <FieldShell label="Slug" htmlFor="brand-slug">
              <TextInput id="brand-slug" name="slug" placeholder="auto" />
            </FieldShell>
            <FieldShell label="Logo URL" htmlFor="brand-logo">
              <TextInput id="brand-logo" name="logo_url" type="url" />
            </FieldShell>
            <Button type="submit" className="w-full">
              Enregistrer
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
