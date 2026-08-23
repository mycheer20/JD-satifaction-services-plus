import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFamilyBySlug, getFamilyTreeForBuild } from "@/features/catalog/queries";
import { CatalogView } from "@/components/storefront/catalog-view";
import { Card } from "@/components/ui/card";
import { SectionLabel } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { isFamilySlug } from "@/lib/theme/families";

export async function generateStaticParams() {
  const families = await getFamilyTreeForBuild();
  return families.map((family) => ({ slug: family.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/famille/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const family = await getFamilyBySlug(slug);
  if (!family) return {};

  return {
    title: family.seoTitle ?? family.name,
    description: family.seoDescription ?? family.description ?? undefined,
  };
}

export default async function FamilyPage({
  params,
  searchParams,
}: PageProps<"/famille/[slug]">) {
  const [{ slug }, rawSearchParams] = await Promise.all([params, searchParams]);
  const family = await getFamilyBySlug(slug);
  if (!family) notFound();

  return (
    <CatalogView
      title={family.name}
      description={family.description}
      familySlug={isFamilySlug(family.slug) ? family.slug : null}
      breadcrumbs={[
        { href: "/catalogue", label: "Catalogue" },
        { href: `/famille/${family.slug}`, label: family.name },
      ]}
      scope={{ family: family.slug }}
      searchParams={rawSearchParams}
    >
      <Card tone="family" padding="md" className="mb-8">
        <SectionLabel>Catégories de cette famille</SectionLabel>
        <div className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {family.categories.map((category) => (
            <div
              key={category.id}
              className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 transition hover:border-[color:var(--accent)]/40 hover:shadow-sm"
            >
              <Link
                href={`/categorie/${category.slug}`}
                className="text-sm font-bold text-[color:var(--color-foreground)] hover:text-[color:var(--accent)]"
              >
                {category.name}
              </Link>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                {category.subcategories.map((sub) => sub.name).join(" · ")}
              </p>
              <ButtonLink
                href={`/categorie/${category.slug}`}
                variant="ghost"
                size="sm"
                className="mt-3 px-0"
              >
                Explorer →
              </ButtonLink>
            </div>
          ))}
        </div>
      </Card>
    </CatalogView>
  );
}
