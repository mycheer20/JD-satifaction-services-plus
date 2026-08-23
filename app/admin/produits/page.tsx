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
import { listAdminProducts } from "@/features/admin/queries";
import {
  PRODUCT_STATUS_LABELS,
  PRODUCT_STATUS_TONE,
} from "@/lib/admin/labels";
import { formatPrice } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import type { ProductStatus } from "@/types/database";

export default async function AdminProductsPage({
  searchParams,
}: AdminListPageProps) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const status = typeof params.statut === "string" ? params.statut : undefined;
  const products = await listAdminProducts({ q, status, limit: 200 });

  const filtered =
    params.stock === "faible"
      ? products.filter((p) => p.stock <= p.low_stock_threshold)
      : products;

  return (
    <>
      <AdminFlash searchParams={params} />
      <AdminPageHeader
        title="Produits"
        description="Gérez le catalogue complet : prix, stock, images et caractéristiques techniques."
        actions={
          <ButtonLink href="/admin/produits/nouveau">+ Nouveau produit</ButtonLink>
        }
      />

      <AdminTable>
        <AdminTableElement>
          <thead>
            <tr>
              <AdminTh>Produit</AdminTh>
              <AdminTh>Catégorie</AdminTh>
              <AdminTh>Statut</AdminTh>
              <AdminTh>Prix</AdminTh>
              <AdminTh>Stock</AdminTh>
              <AdminTh />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <AdminTr>
                <AdminTd className="py-10 text-center text-muted" >
                  <span className="col-span-6">
                    Aucun produit.{" "}
                    <Link href="/admin/produits/nouveau" className="font-semibold text-[color:var(--accent)]">
                      Créer le premier
                    </Link>
                  </span>
                </AdminTd>
              </AdminTr>
            ) : (
              filtered.map((product) => {
  const sub = product.subcategory as unknown as {
                  name: string;
                  category?: { name: string; family?: { name: string } };
                } | null;
                const categoryPath = sub
                  ? [sub.category?.family?.name, sub.category?.name, sub.name]
                      .filter(Boolean)
                      .join(" › ")
                  : "—";

                return (
                  <AdminTr key={product.id}>
                    <AdminTd>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-xs text-muted">
                        {[product.sku, product.model].filter(Boolean).join(" · ") || product.slug}
                      </p>
                    </AdminTd>
                    <AdminTd className="text-muted">{categoryPath}</AdminTd>
                    <AdminTd>
                      <StatusBadge
                        label={PRODUCT_STATUS_LABELS[product.status as ProductStatus]}
                        tone={PRODUCT_STATUS_TONE[product.status as ProductStatus]}
                      />
                    </AdminTd>
                    <AdminTd>
                      {product.sale_price != null ? (
                        <>
                          <span className="font-semibold text-rose-600">
                            {formatPrice(Number(product.sale_price))}
                          </span>
                          <span className="ml-1 text-xs text-muted line-through">
                            {formatPrice(Number(product.price))}
                          </span>
                        </>
                      ) : (
                        formatPrice(Number(product.price))
                      )}
                    </AdminTd>
                    <AdminTd>{product.stock}</AdminTd>
                    <AdminTd>
                      <Link
                        href={`/admin/produits/${product.id}`}
                        className="text-sm font-semibold text-[color:var(--accent)] hover:underline"
                      >
                        Modifier →
                      </Link>
                    </AdminTd>
                  </AdminTr>
                );
              })
            )}
          </tbody>
        </AdminTableElement>
      </AdminTable>
    </>
  );
}
