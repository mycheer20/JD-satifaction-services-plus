import type { Metadata } from "next";
import { CatalogView } from "@/components/storefront/catalog-view";

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Tous nos produits : informatique, fournitures scolaires, gaming, bureau, maison, cosmétiques, sport et loisirs.",
};

export default async function CataloguePage({
  searchParams,
}: PageProps<"/catalogue">) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : undefined;
  const isPromo = params.promo === "1";
  const isFeatured = params.vedette === "1";

  let title = "Tout le catalogue";
  let description: string | undefined =
    "Parcourez l'ensemble des produits disponibles et affinez avec les filtres.";

  if (query) {
    title = `Résultats pour « ${query} »`;
    description = undefined;
  } else if (isPromo) {
    title = "Promotions";
    description = "Produits en promotion — prix réduits tant qu'il y a du stock.";
  } else if (isFeatured) {
    title = "Notre sélection";
    description = "Les produits que nous recommandons en ce moment.";
  }

  return (
    <CatalogView
      title={title}
      description={description}
      breadcrumbs={[{ href: "/catalogue", label: "Catalogue" }]}
      scope={{}}
      searchParams={params}
    />
  );
}
