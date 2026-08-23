import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getFamilyTreeForBuild } from "@/features/catalog/queries";
import { CatalogView } from "@/components/storefront/catalog-view";
import { isFamilySlug } from "@/lib/theme/families";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  const families = await getFamilyTreeForBuild();
  return families.flatMap((family) =>
    family.categories.map((category) => ({ slug: category.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/categorie/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = await getCategoryBySlug(slug);
  if (!found) return {};

  return {
    title: found.category.seoTitle ?? found.category.name,
    description:
      found.category.seoDescription ??
      `${found.category.name} — ${found.family.name}.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps<"/categorie/[slug]">) {
  const [{ slug }, rawSearchParams] = await Promise.all([params, searchParams]);
  const found = await getCategoryBySlug(slug);
  if (!found) notFound();

  const { family, category } = found;

  return (
    <CatalogView
      title={category.name}
      description={category.description}
      familySlug={isFamilySlug(family.slug) ? family.slug : null}
      breadcrumbs={[
        { href: "/catalogue", label: "Catalogue" },
        { href: `/famille/${family.slug}`, label: family.name },
        { href: `/categorie/${category.slug}`, label: category.name },
      ]}
      scope={{ category: category.slug }}
      searchParams={rawSearchParams}
    >
      {category.subcategories.length > 0 ? (
        <div className="mb-8 flex flex-wrap gap-2">
          {category.subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/sous-categorie/${sub.slug}`}
              className={cn(
                "rounded-full border-2 border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition",
                "hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--color-foreground)]",
              )}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      ) : null}
    </CatalogView>
  );
}
