import type { AdminListPageProps } from "@/lib/admin/page-types";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminFlash } from "@/components/admin/admin-flash";
import {
  AdminTable,
  AdminTableElement,
  AdminTd,
  AdminTh,
  AdminTr,
} from "@/components/admin/admin-table";
import { listAdminDeliveryZones } from "@/features/delivery/queries";
import { deleteDeliveryZone, toggleDeliveryZone } from "@/features/admin/actions/delivery";
import { formatDate, formatPrice } from "@/lib/utils";
import { ButtonLink, Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TextInput } from "@/components/ui/field";

export default async function AdminDeliveryZonesPage({
  searchParams,
}: AdminListPageProps) {
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q : "";
  const zones = await listAdminDeliveryZones({ search: search || undefined });

  return (
    <>
      <AdminFlash searchParams={params} />
      <AdminPageHeader
        title="Zones de livraison"
        description="Tarifs par zone — visibles dynamiquement au checkout. Désactivez une zone pour la retirer sans perdre l'historique."
        actions={
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/admin/livraison/localisations" variant="outline">
              Localisations
            </ButtonLink>
            <ButtonLink href="/admin/livraison/zones/nouveau">+ Nouvelle zone</ButtonLink>
          </div>
        }
      />

      <form method="get" className="mb-6 flex max-w-md gap-2">
        <TextInput name="q" defaultValue={search} placeholder="Rechercher zone, ville…" />
        <Button type="submit" variant="outline">
          Filtrer
        </Button>
      </form>

      <AdminTable>
        <AdminTableElement>
          <thead>
            <tr>
              <AdminTh>Zone</AdminTh>
              <AdminTh>Ville</AdminTh>
              <AdminTh>Commune</AdminTh>
              <AdminTh>Département</AdminTh>
              <AdminTh>Tarif</AdminTh>
              <AdminTh>Statut</AdminTh>
              <AdminTh>Créée</AdminTh>
              <AdminTh />
            </tr>
          </thead>
          <tbody>
            {zones.length === 0 ? (
              <AdminTr>
                <AdminTd colSpan={8} className="py-8 text-center text-muted">
                  Aucune zone. Créez d&apos;abord les localisations, puis une zone.
                </AdminTd>
              </AdminTr>
            ) : (
              zones.map((zone) => (
                <AdminTr key={zone.id}>
                  <AdminTd className="font-semibold">{zone.name}</AdminTd>
                  <AdminTd>{zone.city_name}</AdminTd>
                  <AdminTd>{zone.commune_name}</AdminTd>
                  <AdminTd>{zone.department_name}</AdminTd>
                  <AdminTd>{formatPrice(zone.delivery_fee, zone.currency)}</AdminTd>
                  <AdminTd>
                    <Badge tone={zone.is_active ? "success" : "neutral"}>
                      {zone.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </AdminTd>
                  <AdminTd className="text-xs text-muted">{formatDate(zone.created_at)}</AdminTd>
                  <AdminTd className="space-x-2 whitespace-nowrap">
                    <Link
                      href={`/admin/livraison/zones/${zone.id}`}
                      className="text-sm font-semibold text-[color:var(--accent)]"
                    >
                      Modifier
                    </Link>
                    <form action={toggleDeliveryZone} className="inline">
                      <input type="hidden" name="id" value={zone.id} />
                      <input type="hidden" name="is_active" value={zone.is_active ? "0" : "1"} />
                      <Button type="submit" variant="ghost" size="sm">
                        {zone.is_active ? "Désact." : "Activer"}
                      </Button>
                    </form>
                    <form action={deleteDeliveryZone} className="inline">
                      <input type="hidden" name="id" value={zone.id} />
                      <Button type="submit" variant="ghost" size="sm">
                        Suppr.
                      </Button>
                    </form>
                  </AdminTd>
                </AdminTr>
              ))
            )}
          </tbody>
        </AdminTableElement>
      </AdminTable>
    </>
  );
}
