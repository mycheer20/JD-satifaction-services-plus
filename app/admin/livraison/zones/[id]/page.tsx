import type { AdminDetailPageProps } from "@/lib/admin/page-types";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminFlash } from "@/components/admin/admin-flash";
import { DeliveryZoneForm } from "@/components/admin/delivery-zone-form";
import {
  getDeliveryZoneForAdmin,
  listCitiesForAdmin,
  listCommunesForAdmin,
  listCountriesForAdmin,
  listDepartmentsForAdmin,
} from "@/features/delivery/queries";

export default async function AdminEditDeliveryZonePage({
  params,
  searchParams,
}: AdminDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const zone = await getDeliveryZoneForAdmin(id);
  if (!zone) notFound();

  const countries = (await listCountriesForAdmin()).map((c) => ({ id: c.id, name: c.name }));
  const departments = (await listDepartmentsForAdmin(zone.country_id)).map((d) => ({
    id: d.id,
    name: d.name,
  }));
  const communes = (await listCommunesForAdmin(zone.department_id)).map((c) => ({
    id: c.id,
    name: c.name,
  }));
  const cities = (await listCitiesForAdmin(zone.commune_id)).map((c) => ({
    id: c.id,
    name: c.name,
  }));

  return (
    <>
      <AdminFlash searchParams={query} />
      <AdminPageHeader title={`Modifier ${zone.name}`} description="Tarif et statut de la zone." />
      <DeliveryZoneForm
        zone={{
          id: zone.id,
          name: zone.name,
          delivery_fee: zone.delivery_fee,
          currency: zone.currency,
          is_active: zone.is_active,
          city_id: zone.city_id,
          department_id: zone.department_id,
          commune_id: zone.commune_id,
          country_id: zone.country_id,
        }}
        countries={countries}
        departments={departments}
        communes={communes}
        cities={cities}
      />
    </>
  );
}
