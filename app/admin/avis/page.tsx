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
import { listAdminReviews } from "@/features/admin/queries";
import { REVIEW_STATUS_LABELS, REVIEW_STATUS_TONE } from "@/lib/admin/labels";
import { moderateReview } from "@/features/admin/actions/orders";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ReviewStatus } from "@/types/database";

export default async function AdminReviewsPage({
  searchParams,
}: AdminListPageProps) {
  const params = await searchParams;
  const status = typeof params.statut === "string" ? params.statut : undefined;
  const reviews = await listAdminReviews(status);

  return (
    <>
      <AdminFlash searchParams={params} />
      <AdminPageHeader
        title="Avis clients"
        description="Modérez les avis produits avant publication sur la boutique."
      />

      <AdminTable>
        <AdminTableElement>
          <thead>
            <tr>
              <AdminTh>Produit</AdminTh>
              <AdminTh>Note</AdminTh>
              <AdminTh>Commentaire</AdminTh>
              <AdminTh>Statut</AdminTh>
              <AdminTh>Actions</AdminTh>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => {
              const product = review.product as unknown as { name: string; slug: string } | null;
              return (
                <AdminTr key={review.id}>
                  <AdminTd>
                    {product ? (
                      <Link href={`/produit/${product.slug}`} className="font-semibold hover:underline">
                        {product.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </AdminTd>
                  <AdminTd>
                    <span className="text-amber-500">{"★".repeat(review.rating)}</span>
                  </AdminTd>
                  <AdminTd className="max-w-xs">
                    {review.title ? <p className="font-semibold">{review.title}</p> : null}
                    <p className="truncate text-muted">{review.body}</p>
                    <p className="text-xs text-muted">{formatDate(review.created_at)}</p>
                  </AdminTd>
                  <AdminTd>
                    <StatusBadge
                      label={REVIEW_STATUS_LABELS[review.status as ReviewStatus]}
                      tone={REVIEW_STATUS_TONE[review.status as ReviewStatus]}
                    />
                  </AdminTd>
                  <AdminTd>
                    <div className="flex flex-wrap gap-2">
                      <form action={moderateReview}>
                        <input type="hidden" name="review_id" value={review.id} />
                        <input type="hidden" name="status" value="approved" />
                        <Button type="submit" variant="soft" size="sm">
                          Approuver
                        </Button>
                      </form>
                      <form action={moderateReview}>
                        <input type="hidden" name="review_id" value={review.id} />
                        <input type="hidden" name="status" value="rejected" />
                        <Button type="submit" variant="ghost" size="sm">
                          Refuser
                        </Button>
                      </form>
                    </div>
                  </AdminTd>
                </AdminTr>
              );
            })}
          </tbody>
        </AdminTableElement>
      </AdminTable>
    </>
  );
}
