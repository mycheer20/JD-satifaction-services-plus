import type { AdminListPageProps } from "@/lib/admin/page-types";
import { requireAdmin } from "@/features/auth/guards";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminFlash } from "@/components/admin/admin-flash";
import {
  AdminTable,
  AdminTableElement,
  AdminTd,
  AdminTh,
  AdminTr,
} from "@/components/admin/admin-table";
import { listServicesAdmin } from "@/features/admin/queries";
import { saveService } from "@/features/admin/actions/catalog";
import { FieldShell, TextInput, TextArea, CheckboxField } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminServicesPage({
  searchParams,
}: AdminListPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const services = await listServicesAdmin();

  return (
    <>
      <AdminFlash searchParams={params} />
      <AdminPageHeader
        title="Services design"
        description="Offres créatives du studio — pages, tarifs et visibilité."
      />

      <AdminTable>
        <AdminTableElement>
          <thead>
            <tr>
              <AdminTh>Service</AdminTh>
              <AdminTh>Prix de base</AdminTh>
              <AdminTh>Statut</AdminTh>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <AdminTr key={service.id}>
                <AdminTd>
                  <p className="font-semibold">{service.name}</p>
                  <p className="text-xs text-muted">{service.slug}</p>
                </AdminTd>
                <AdminTd>{service.base_price ?? "—"}</AdminTd>
                <AdminTd>
                  <Badge tone={service.is_active ? "success" : "neutral"}>
                    {service.is_active ? "Actif" : "Inactif"}
                  </Badge>
                </AdminTd>
              </AdminTr>
            ))}
          </tbody>
        </AdminTableElement>
      </AdminTable>

      <Card padding="md" className="mt-8 max-w-xl space-y-4">
        <h2 className="font-bold">Modifier un service</h2>
        <form action={saveService} className="space-y-3">
          <FieldShell label="ID service" htmlFor="svc-id" required hint="UUID depuis la liste">
            <TextInput id="svc-id" name="id" required />
          </FieldShell>
          <FieldShell label="Nom" htmlFor="svc-name" required>
            <TextInput id="svc-name" name="name" required />
          </FieldShell>
          <FieldShell label="Accroche" htmlFor="svc-tagline">
            <TextInput id="svc-tagline" name="tagline" />
          </FieldShell>
          <FieldShell label="Description" htmlFor="svc-desc">
            <TextArea id="svc-desc" name="description" />
          </FieldShell>
          <FieldShell label="Prix de base" htmlFor="svc-price">
            <TextInput id="svc-price" name="base_price" type="number" min={0} />
          </FieldShell>
          <CheckboxField name="is_active" label="Actif" defaultChecked />
          <CheckboxField name="is_featured" label="En vedette" />
          <Button type="submit">Enregistrer</Button>
        </form>
      </Card>
    </>
  );
}
