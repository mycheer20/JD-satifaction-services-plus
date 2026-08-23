/**
 * Home page composition.
 *
 * The page renders this list in order. Reordering, hiding or relabelling a
 * section is an edit here — the page component itself does not need to change.
 * A `family` section pulls its products from the family with that slug.
 */

export type HomeSection =
  | { kind: "hero" }
  | { kind: "families" }
  | { kind: "featured"; title: string; description?: string }
  | { kind: "new"; title: string; description?: string }
  | { kind: "promotions"; title: string; description?: string }
  | { kind: "family"; family: string; title: string; description?: string }
  | { kind: "services"; title: string; description?: string };

export const homeSections: HomeSection[] = [
  { kind: "hero" },
  { kind: "families" },
  {
    kind: "featured",
    title: "Notre sélection",
    description: "Les produits que nous recommandons en ce moment.",
  },
  {
    kind: "promotions",
    title: "Promotions",
    description: "Des prix réduits, tant qu'il y a du stock.",
  },
  {
    kind: "new",
    title: "Nouveautés",
    description: "Les derniers produits ajoutés au catalogue.",
  },
  {
    kind: "family",
    family: "gaming",
    title: "Gaming",
    description: "Consoles, jeux, manettes et mobilier pour bien jouer.",
  },
  {
    kind: "family",
    family: "informatique",
    title: "Informatique",
    description: "Ordinateurs, composants et périphériques.",
  },
  {
    kind: "family",
    family: "fournitures-scolaires",
    title: "Fournitures scolaires",
    description: "Tout le nécessaire pour l'année scolaire.",
  },
  {
    kind: "family",
    family: "bureau",
    title: "Bureau",
    description: "Mobilier, organisation et consommables pour le travail.",
  },
  {
    kind: "family",
    family: "maison-alimentaire",
    title: "Maison & alimentaire",
    description: "Entretien, cuisine, éclairage et épicerie.",
  },
  {
    kind: "family",
    family: "cosmetiques",
    title: "Cosmétiques",
    description: "Soins, parfumerie et maquillage.",
  },
  {
    kind: "family",
    family: "sport-loisirs",
    title: "Sport & loisirs",
    description: "Football, fitness et jeux de société.",
  },
  {
    kind: "services",
    title: "Services de design",
    description:
      "Logo, flyer, carte de visite, packaging… décrivez votre projet, nous le mettons en forme.",
  },
];
