import type { AdminDetailPageProps } from "@/lib/admin/page-types";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminFlash } from "@/components/admin/admin-flash";
import { CouponForm } from "@/components/admin/coupon-form";
import { listCoupons } from "@/features/admin/queries";
import { saveCoupon } from "@/features/admin/actions/catalog";

export default async function EditCouponPage({
  params,
  searchParams,
}: AdminDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const coupons = await listCoupons();
  const coupon = coupons.find((c) => c.id === id);
  if (!coupon) notFound();

  return (
    <>
      <AdminFlash searchParams={query} />
      <AdminPageHeader title={`Coupon ${coupon.code}`} description="Modifier le code promotionnel." />
      <CouponForm action={saveCoupon} defaults={coupon} />
    </>
  );
}
