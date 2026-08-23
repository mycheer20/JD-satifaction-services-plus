import type { AdminListPageProps } from "@/lib/admin/page-types";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminFlash } from "@/components/admin/admin-flash";
import { saveCoupon } from "@/features/admin/actions/catalog";
import { CouponForm } from "@/components/admin/coupon-form";

export default async function NewCouponPage({
  searchParams,
}: AdminListPageProps) {
  const params = await searchParams;

  return (
    <>
      <AdminFlash searchParams={params} />
      <AdminPageHeader
        title="Nouveau coupon"
        description="Créez un code promotionnel pour la boutique."
      />
      <CouponForm action={saveCoupon} />
    </>
  );
}
