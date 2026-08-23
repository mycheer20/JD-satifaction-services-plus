import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  getProductBySlug,
  getProductReviews,
  getRelatedProducts,
} from "@/features/catalog/queries";
import { ProductPurchase } from "@/components/storefront/product-purchase";
import { getStoreContactSnapshot } from "@/lib/store/contact";
import { ProductRail } from "@/components/storefront/product-card";
import { FamilyTheme } from "@/components/theme/family-theme";
import { BreadcrumbsWithCurrent } from "@/components/ui/breadcrumbs";
import { Card } from "@/components/ui/card";
import { SectionLabel } from "@/components/ui/badge";
import { getSessionUser } from "@/features/auth/session";
import { ReviewForm } from "@/components/storefront/review-form";
import { StoreContactBar } from "@/components/storefront/store-contact-actions";
import { formatDateShort } from "@/lib/utils";
import { isFamilySlug } from "@/lib/theme/families";

export async function generateMetadata({
  params,
}: PageProps<"/produit/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.shortDescription ?? product.name,
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? undefined,
      images: product.images[0] ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/produit/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.status !== "active") notFound();

  const { family, category, subcategory } = product.breadcrumb;
  const familySlug = isFamilySlug(family.slug) ? family.slug : null;

  const groups = new Map<string, typeof product.specs>();
  for (const spec of product.specs) {
    const label = spec.group || "Caractéristiques";
    groups.set(label, [...(groups.get(label) ?? []), spec]);
  }

  return (
    <>
      <FamilyTheme family={familySlug} />
      <div className="page-container py-8">
        <BreadcrumbsWithCurrent
          items={[
            { href: `/famille/${family.slug}`, label: family.name },
            { href: `/categorie/${category.slug}`, label: category.name },
            { href: `/sous-categorie/${subcategory.slug}`, label: subcategory.name },
          ]}
          current={product.name}
        />

        <ProductPurchase product={product} contact={getStoreContactSnapshot()} />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-10">
            {product.description ? (
              <section>
                <h2 className="text-xl font-bold tracking-tight text-[color:var(--color-foreground)]">
                  Description
                </h2>
                <Card tone="muted" padding="md" className="mt-4">
                  <div className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
                    {product.description}
                  </div>
                </Card>
              </section>
            ) : null}

            {groups.size > 0 ? (
              <section>
                <h2 className="text-xl font-bold tracking-tight text-[color:var(--color-foreground)]">
                  Caractéristiques
                </h2>
                <div className="mt-4 space-y-6">
                  {[...groups.entries()].map(([label, specs]) => (
                    <Card key={label} padding="none" tone="elevated" className="overflow-hidden">
                      <div className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-5 py-3">
                        <SectionLabel>{label}</SectionLabel>
                      </div>
                      <dl>
                        {specs.map((spec) => (
                          <div
                            key={spec.key}
                            className="grid grid-cols-2 gap-4 border-b border-[color:var(--color-border)] px-5 py-3 text-sm last:border-0"
                          >
                            <dt className="text-slate-500">{spec.label}</dt>
                            <dd className="font-bold text-[color:var(--color-foreground)]">
                              {spec.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </Card>
                  ))}
                </div>
              </section>
            ) : null}

            <Suspense fallback={null}>
              <Reviews productId={product.id} />
            </Suspense>
          </div>

          <aside>
            <Card tone="muted" padding="md" className="text-sm">
              <p className="font-bold text-[color:var(--color-foreground)]">Informations</p>
              <dl className="mt-4 space-y-3 text-slate-600">
                <div className="flex justify-between gap-3">
                  <dt>Catégorie</dt>
                  <dd className="text-right font-bold text-[color:var(--color-foreground)]">
                    {subcategory.name}
                  </dd>
                </div>
                {product.weightGrams ? (
                  <div className="flex justify-between gap-3">
                    <dt>Poids</dt>
                    <dd className="text-right font-bold text-[color:var(--color-foreground)]">
                      {product.weightGrams} g
                    </dd>
                  </div>
                ) : null}
                {product.tags.length > 0 ? (
                  <div className="flex justify-between gap-3">
                    <dt>Tags</dt>
                    <dd className="text-right font-bold text-[color:var(--color-foreground)]">
                      {product.tags.join(", ")}
                    </dd>
                  </div>
                ) : null}
              </dl>
              <StoreContactBar subject={product.name} className="mt-4" />
            </Card>
          </aside>
        </div>

        <div className="mt-16">
          <Suspense fallback={null}>
            <Related subcategorySlug={subcategory.slug} productId={product.id} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

async function Reviews({ productId }: { productId: string }) {
  const [reviews, user] = await Promise.all([
    getProductReviews(productId),
    getSessionUser(),
  ]);

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold tracking-tight text-[color:var(--color-foreground)]">
        Avis clients
        {reviews.length > 0 ? (
          <span className="ml-2 text-base font-semibold text-muted">({reviews.length})</span>
        ) : null}
      </h2>

      {reviews.length > 0 ? (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <Card key={review.id} padding="md">
              <div className="flex items-center justify-between gap-3">
                <span className="text-amber-500" aria-label={`${review.rating} sur 5`}>
                  {"★".repeat(review.rating)}
                  <span className="text-slate-200">{"★".repeat(5 - review.rating)}</span>
                </span>
                <span className="text-xs font-medium text-muted">
                  {formatDateShort(review.created_at)}
                </span>
              </div>
              {review.title ? (
                <p className="mt-2 text-sm font-bold text-[color:var(--color-foreground)]">
                  {review.title}
                </p>
              ) : null}
              {review.body ? (
                <p className="mt-1 text-sm leading-relaxed text-slate-700">{review.body}</p>
              ) : null}
            </Card>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">Aucun avis pour le moment — soyez le premier à donner le vôtre.</p>
      )}

      <ReviewForm productId={productId} signedIn={Boolean(user)} />
    </section>
  );
}

async function Related({
  subcategorySlug,
  productId,
}: {
  subcategorySlug: string;
  productId: string;
}) {
  const products = await getRelatedProducts(subcategorySlug, productId);
  return (
    <ProductRail
      title="Produits similaires"
      href={`/sous-categorie/${subcategorySlug}`}
      products={products}
    />
  );
}
