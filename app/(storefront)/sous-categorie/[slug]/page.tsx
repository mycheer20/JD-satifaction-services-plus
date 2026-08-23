import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSubcategoryBySlug } from "@/features/catalog/queries";
import { CatalogView } from "@/components/storefront/catalog-view";
import { isFamilySlug } from "@/lib/theme/families";

export async function generateMetadata({
  params,
}: PageProps<"/sous-categorie/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = await getSubcategoryBySlug(slug);
  if (!found) return {};

  return {
    title: found.subcategory.seoTitle ?? found.subcategory.name,
    description:
      found.subcategory.seoDescription ??
      `${found.subcategory.name} — ${found.category.name}, ${found.family.name}.`,
  };
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: PageProps<"/sous-categorie/[slug]">) {
  const [{ slug }, rawSearchParams] = await Promise.all([params, searchParams]);
  const found = await getSubcategoryBySlug(slug);
  if (!found) notFound();

  const { family, category, subcategory } = found;

  return (
    <CatalogView
      title={subcategory.name}
      description={subcategory.description}
      familySlug={isFamilySlug(family.slug) ? family.slug : null}
      breadcrumbs={[
        { href: "/catalogue", label: "Catalogue" },
        { href: `/famille/${family.slug}`, label: family.name },
        { href: `/categorie/${category.slug}`, label: category.name },
        { href: `/sous-categorie/${subcategory.slug}`, label: subcategory.name },
      ]}
      scope={{ subcategory: subcategory.slug }}
      searchParams={rawSearchParams}
    />
  );
}
