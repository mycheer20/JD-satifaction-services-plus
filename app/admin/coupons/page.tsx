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
  StatusBadge,
} from "@/components/admin/admin-table";
import { listCoupons } from "@/features/admin/queries";
import { deleteCoupon } from "@/features/admin/actions/catalog";
import { formatDate } from "@/lib/utils";
import { ButtonLink, Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AdminCouponsPage({
  searchParams,
}: AdminListPageProps) {
  const params = await searchParams;
  const coupons = await listCoupons();

  return (
    <>
      <AdminFlash searchParams={params} />
      <AdminPageHeader
        title="Coupons"
        description="Codes promotionnels — pourcentage ou montant fixe, limites d'usage et dates."
        actions={<ButtonLink href="/admin/coupons/nouveau">+ Nouveau coupon</ButtonLink>}
      />

      <AdminTable>
        <AdminTableElement>
          <thead>
            <tr>
              <AdminTh>Code</AdminTh>
              <AdminTh>Réduction</AdminTh>
              <AdminTh>Usage</AdminTh>
              <AdminTh>Validité</AdminTh>
              <AdminTh>Statut</AdminTh>
              <AdminTh />
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <AdminTr key={coupon.id}>
                <AdminTd className="font-mono font-bold">{coupon.code}</AdminTd>
                <AdminTd>
                  {coupon.discount_type === "percentage"
                    ? `${coupon.discount_value} %`
                    : `${coupon.discount_value} gdes`}
                </AdminTd>
                <AdminTd>
                  {coupon.usage_count}
                  {coupon.usage_limit != null ? ` / ${coupon.usage_limit}` : ""}
                </AdminTd>
                <AdminTd className="text-xs text-muted">
                  {coupon.starts_at ? formatDate(coupon.starts_at) : "—"} →{" "}
                  {coupon.ends_at ? formatDate(coupon.ends_at) : "—"}
                </AdminTd>
                <AdminTd>
                  <Badge tone={coupon.is_active ? "success" : "neutral"}>
                    {coupon.is_active ? "Actif" : "Inactif"}
                  </Badge>
                </AdminTd>
                <AdminTd className="space-x-2">
                  <Link
                    href={`/admin/coupons/${coupon.id}`}
                    className="text-sm font-semibold text-[color:var(--accent)]"
                  >
                    Modifier
                  </Link>
                  <form action={deleteCoupon} className="inline">
                    <input type="hidden" name="id" value={coupon.id} />
                    <Button type="submit" variant="ghost" size="sm">
                      Suppr.
                    </Button>
                  </form>
                </AdminTd>
              </AdminTr>
            ))}
          </tbody>
        </AdminTableElement>
      </AdminTable>
    </>
  );
}
