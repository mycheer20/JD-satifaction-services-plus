import type { SearchSuggestion } from "./types";

/** Builds a storefront URL from a suggestion row returned by `search_suggestions`. */
export function suggestionHref(item: SearchSuggestion): string {
  switch (item.kind) {
    case "product":
      return `/produit/${item.slug}`;
    case "brand":
      return `/catalogue?marque=${encodeURIComponent(item.slug ?? "")}`;
    case "category":
      return `/categorie/${item.slug}`;
    case "subcategory":
      return `/sous-categorie/${item.slug}`;
    case "family":
      return `/famille/${item.slug}`;
    case "model":
      return `/catalogue?modele=${encodeURIComponent(item.label)}`;
    case "correction":
      return `/catalogue?q=${encodeURIComponent(item.label)}`;
    default:
      return `/catalogue?q=${encodeURIComponent(item.label)}`;
  }
}

export const SUGGESTION_KIND_LABELS: Record<SearchSuggestion["kind"], string> = {
  product: "Produit",
  brand: "Marque",
  category: "Catégorie",
  subcategory: "Sous-catégorie",
  family: "Famille",
  model: "Modèle",
  correction: "Suggestion",
};
