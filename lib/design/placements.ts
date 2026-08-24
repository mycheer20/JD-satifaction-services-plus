/**
 * Registre des emplacements visuels — défini en code, jamais modifiable par le designer.
 * Chaque placement liste les capacités autorisées.
 */

export type DesignCapability =
  | "image"
  | "slider"
  | "overlay"
  | "animation"
  | "autoplay"
  | "hover"
  | "gallery"
  | "tokens";

export type DesignPlacementId =
  | "site.motion"
  | "home.hero"
  | "home.families"
  | "home.family.informatique"
  | "home.family.gaming"
  | "home.family.fournitures-scolaires"
  | "home.family.bureau"
  | "home.family.maison-alimentaire"
  | "home.family.cosmetiques"
  | "home.family.sport-loisirs"
  | "home.services"
  | "about.hero"
  | "about.presentation"
  | "about.history"
  | "about.mission"
  | "about.values"
  | "about.activities"
  | "about.why-us"
  | "about.presence"
  | "about.gallery"
  | "about.cta";

export type DesignPlacement = {
  id: DesignPlacementId;
  label: string;
  description?: string;
  capabilities: DesignCapability[];
  /** Slug famille lié (cartes accueil). */
  familySlug?: string;
};

const familyPlacements = (
  [
    ["informatique", "Informatique"],
    ["gaming", "Gaming"],
    ["fournitures-scolaires", "Fournitures scolaires"],
    ["bureau", "Bureau"],
    ["maison-alimentaire", "Maison & alimentaire"],
    ["cosmetiques", "Cosmétiques"],
    ["sport-loisirs", "Sport & loisirs"],
  ] as const
).map(([slug, label]) => ({
  id: `home.family.${slug}` as DesignPlacementId,
  label: `Accueil — ${label}`,
  description: `Image de couverture pour la carte famille « ${label} ».`,
  capabilities: ["image", "overlay", "hover"] as DesignCapability[],
  familySlug: slug,
}));

export const DESIGN_PLACEMENTS: DesignPlacement[] = [
  {
    id: "site.motion",
    label: "Animations globales",
    description: "Transitions, survols et apparitions au défilement sur tout le site.",
    capabilities: ["animation", "hover"],
  },
  {
    id: "home.hero",
    label: "Accueil — Hero",
    description: "Bannière principale de la page d'accueil.",
    capabilities: ["image", "slider", "overlay", "animation", "autoplay"],
  },
  {
    id: "home.families",
    label: "Accueil — Grille familles",
    description: "Conteneur de la section familles (sans image directe).",
    capabilities: [],
  },
  ...familyPlacements,
  {
    id: "home.services",
    label: "Accueil — Services design",
    description: "Bannière optionnelle au-dessus des services.",
    capabilities: ["image", "overlay"],
  },
  {
    id: "about.hero",
    label: "À propos — Hero",
    description: "Bannière de la page institutionnelle.",
    capabilities: ["image", "overlay", "animation"],
  },
  {
    id: "about.presentation",
    label: "À propos — Présentation",
    description: "Illustration de la section présentation.",
    capabilities: ["image", "overlay"],
  },
  {
    id: "about.history",
    label: "À propos — Notre histoire",
    capabilities: ["image"],
  },
  {
    id: "about.mission",
    label: "À propos — Notre mission",
    capabilities: ["image"],
  },
  {
    id: "about.values",
    label: "À propos — Nos valeurs",
    capabilities: ["image", "gallery"],
  },
  {
    id: "about.activities",
    label: "À propos — Nos activités",
    capabilities: ["image", "gallery"],
  },
  {
    id: "about.why-us",
    label: "À propos — Pourquoi nous choisir",
    capabilities: ["image"],
  },
  {
    id: "about.presence",
    label: "À propos — Notre présence",
    capabilities: ["image"],
  },
  {
    id: "about.gallery",
    label: "À propos — Galerie",
    description: "Grande galerie d'images de l'entreprise.",
    capabilities: ["gallery"],
  },
  {
    id: "about.cta",
    label: "À propos — Appel à l'action",
    capabilities: ["image", "overlay"],
  },
];

const placementMap = new Map(DESIGN_PLACEMENTS.map((p) => [p.id, p]));

export function getPlacement(id: string): DesignPlacement | undefined {
  return placementMap.get(id as DesignPlacementId);
}

export function isValidPlacement(id: string): id is DesignPlacementId {
  return placementMap.has(id as DesignPlacementId);
}

export function placementSupports(
  id: DesignPlacementId,
  capability: DesignCapability,
): boolean {
  return getPlacement(id)?.capabilities.includes(capability) ?? false;
}

export const DESIGN_BUCKET = "design-media" as const;

export const DESIGN_GALLERY_CATEGORIES = [
  { id: "entreprise", label: "Entreprise" },
  { id: "boutique", label: "Boutique" },
  { id: "produits", label: "Produits" },
  { id: "equipe", label: "Équipe" },
  { id: "stock", label: "Stock" },
  { id: "livraisons", label: "Livraisons" },
  { id: "evenements", label: "Événements" },
  { id: "autres", label: "Autres" },
] as const;

export type DesignGalleryCategoryId =
  (typeof DESIGN_GALLERY_CATEGORIES)[number]["id"];

export const SLIDE_TRANSITIONS = ["fade", "slide", "zoom"] as const;
export type SlideTransition = (typeof SLIDE_TRANSITIONS)[number];
