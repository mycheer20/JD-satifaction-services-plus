import Link from "next/link";
import { Suspense } from "react";
import { getCatalogFacets, searchProducts } from "@/features/catalog/queries";
import {
  countActiveFilters,
  parseSearchParams,
  type RawSearchParams,
} from "@/features/catalog/search-params";
import { ProductGrid } from "./product-card";
import { CatalogFilters, SortSelect } from "./catalog-filters";
import { EmptyState } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";
import { PageTitle } from "@/components/ui/badge";
import { FamilyTheme } from "@/components/theme/family-theme";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type { Crumb as Breadcrumb };

export async function CatalogView({
  title,
  description,
  breadcrumbs = [],
  scope,
  searchParams,
  familySlug,
  children,
}: {
  title: string;
  description?: string | null;
  breadcrumbs?: Crumb[];
  scope: { family?: string; category?: string; subcategory?: string };
  searchParams: RawSearchParams;
  familySlug?: string | null;
  children?: React.ReactNode;
}) {
  const params = parseSearchParams(searchParams, scope);

  const [result, facets] = await Promise.all([
    searchProducts(params),
    getCatalogFacets(params),
  ]);

  const activeFilters = countActiveFilters(params);
  const themeFamily = familySlug ?? scope.family ?? null;

  return (
    <>
      <FamilyTheme family={themeFamily} />
      <div className="page-container py-8">
        {breadcrumbs.length > 0 ? <Breadcrumbs items={breadcrumbs} /> : null}

        <div
          className={cn(
            "mb-8 overflow-hidden rounded-2xl p-6 sm:p-8",
            themeFamily ? "hero-brand shadow-lg" : "bg-[color:var(--color-surface-muted)]",
          )}
        >
          <PageTitle
            title={title}
            description={description}
            className={cn(
              "mb-0",
              themeFamily &&
                "[&_h1]:text-[color:var(--hero-foreground)] [&_p]:text-[color:var(--hero-muted)]",
            )}
          />
        </div>

        {children}

        <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
          <Suspense fallback={<div className="hidden lg:block" />}>
            <CatalogFilters
              facets={facets}
              activeCount={activeFilters}
              scope={scope}
            />
          </Suspense>

          <div className="min-w-0 space-y-5">
            <Card padding="sm" tone="muted" className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">
                <span className="font-bold text-[color:var(--color-foreground)]">
                  {result.total}
                </span>{" "}
                produit{result.total > 1 ? "s" : ""}
                {params.query ? (
                  <>
                    {" "}
                    pour{" "}
                    <span className="font-semibold text-[color:var(--accent)]">
                      « {params.query} »
                    </span>
                    {result.total === 0 ? (
                      <span className="mt-1 block text-xs text-muted">
                        Vérifiez l&apos;orthographe ou essayez un terme plus général — la
                        recherche tolère les fautes courantes.
                      </span>
                    ) : null}
                  </>
                ) : null}
              </p>
              <Suspense fallback={null}>
                <SortSelect />
              </Suspense>
            </Card>

            {result.products.length === 0 ? (
              <EmptyState
                title="Aucun produit ne correspond"
                description={
                  activeFilters > 0
                    ? "Essayez d'élargir vos filtres ou de modifier votre recherche."
                    : "Cette section ne contient pas encore de produit. Revenez bientôt."
                }
                icon="🔍"
                action={<ButtonLink href="/catalogue">Voir tout le catalogue</ButtonLink>}
              />
            ) : (
              <>
                <ProductGrid products={result.products} />
                <Pagination
                  page={result.page}
                  pageCount={result.pageCount}
                  searchParams={searchParams}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Pagination({
  page,
  pageCount,
  searchParams,
}: {
  page: number;
  pageCount: number;
  searchParams: RawSearchParams;
}) {
  if (pageCount <= 1) return null;

  const build = (target: number) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (key === "page" || value === undefined) continue;
      for (const item of Array.isArray(value) ? value : [value]) next.append(key, item);
    }
    if (target > 1) next.set("page", String(target));
    const query = next.toString();
    return query ? `?${query}` : "?";
  };

  const pages = [...new Set([1, page - 1, page, page + 1, pageCount])]
    .filter((n) => n >= 1 && n <= pageCount)
    .sort((a, b) => a - b);

  const linkBase =
    "inline-flex min-w-10 items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold transition";
  const inactive = `${linkBase} border-2 border-[color:var(--color-border)] text-slate-700 hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)]`;
  const active = `${linkBase} bg-[color:var(--accent)] text-[color:var(--accent-foreground)] shadow-md`;

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2 pt-6">
      {page > 1 ? (
        <Link href={build(page - 1)} className={inactive}>
          ← Préc.
        </Link>
      ) : null}

      {pages.map((target, index) => (
        <span key={target} className="flex items-center gap-2">
          {index > 0 && target - pages[index - 1] > 1 ? (
            <span className="px-1 text-slate-400">…</span>
          ) : null}
          <Link
            href={build(target)}
            aria-current={target === page ? "page" : undefined}
            className={target === page ? active : inactive}
          >
            {target}
          </Link>
        </span>
      ))}

      {page < pageCount ? (
        <Link href={build(page + 1)} className={inactive}>
          Suiv. →
        </Link>
      ) : null}
    </nav>
  );
}
