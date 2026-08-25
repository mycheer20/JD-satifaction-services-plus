import type { AdminListPageProps } from "@/lib/admin/page-types";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminFlash } from "@/components/admin/admin-flash";
import { DeliveryZoneForm } from "@/components/admin/delivery-zone-form";
import { listCountriesForAdmin } from "@/features/delivery/queries";

export default async function AdminNewDeliveryZonePage({
  searchParams,
}: AdminListPageProps) {
  const params = await searchParams;
  const countries = (await listCountriesForAdmin()).map((c) => ({ id: c.id, name: c.name }));

  return (
    <>
      <AdminFlash searchParams={params} />
      <AdminPageHeader
        title="Nouvelle zone de livraison"
        description="Liez la zone à une ville et définissez le tarif — visible au checkout si active."
      />
      <DeliveryZoneForm countries={countries} departments={[]} communes={[]} cities={[]} />
    </>
  );
}
