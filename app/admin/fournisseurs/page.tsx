import type { AdminListPageProps } from "@/lib/admin/page-types";
import { requireAdmin } from "@/features/auth/guards";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminFlash } from "@/components/admin/admin-flash";
import { TaxonomyTable } from "@/components/admin/taxonomy-table";
import { listSuppliers } from "@/features/admin/queries";
import { saveSupplier } from "@/features/admin/actions/catalog";
import { Card } from "@/components/ui/card";
import { FieldShell, TextArea, TextInput, CheckboxField } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export default async function AdminSuppliersPage({
  searchParams,
}: AdminListPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const suppliers = await listSuppliers();

  return (
    <>
      <AdminFlash searchParams={params} />
      <AdminPageHeader
        title="Fournisseurs"
        description="Sources d'approvisionnement internes — jamais visibles côté client."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-3">
          {suppliers.map((supplier) => (
            <Card key={supplier.id} padding="md">
              <p className="font-bold">{supplier.name}</p>
              {supplier.contact_email ? (
                <p className="text-sm text-muted">{supplier.contact_email}</p>
              ) : null}
              {supplier.notes ? (
                <p className="mt-2 text-sm">{supplier.notes}</p>
              ) : null}
            </Card>
          ))}
        </div>

        <Card padding="md">
          <h2 className="mb-4 font-bold">Ajouter / modifier</h2>
          <form action={saveSupplier} className="space-y-3">
            <FieldShell label="ID (modifier)" htmlFor="sup-id">
              <TextInput id="sup-id" name="id" />
            </FieldShell>
            <FieldShell label="Nom" htmlFor="sup-name" required>
              <TextInput id="sup-name" name="name" required />
            </FieldShell>
            <FieldShell label="E-mail" htmlFor="sup-email">
              <TextInput id="sup-email" name="contact_email" type="email" />
            </FieldShell>
            <FieldShell label="Téléphone" htmlFor="sup-phone">
              <TextInput id="sup-phone" name="contact_phone" />
            </FieldShell>
            <FieldShell label="Site web" htmlFor="sup-web">
              <TextInput id="sup-web" name="website" />
            </FieldShell>
            <FieldShell label="Notes" htmlFor="sup-notes">
              <TextArea id="sup-notes" name="notes" />
            </FieldShell>
            <CheckboxField name="is_active" label="Actif" defaultChecked />
            <Button type="submit" className="w-full">
              Enregistrer
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
