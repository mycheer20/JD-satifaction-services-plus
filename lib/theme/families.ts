/**
 * Visual identity per product family. Slugs match the database; CSS variables
 * are defined in `app/globals.css` under `[data-family="<slug>"]`.
 */

export type FamilySlug =
  | "informatique"
  | "fournitures-scolaires"
  | "gaming"
  | "bureau"
  | "maison-alimentaire"
  | "cosmetiques"
  | "sport-loisirs";

export type FamilyVisual = {
  slug: FamilySlug;
  /** Short label for badges and chips */
  tagline: string;
  /** Tailwind gradient utility for cards and heroes */
  gradient: string;
  /** Accent dot / stripe color (Tailwind bg-* class) */
  accent: string;
  /** Icon emoji fallback when no image — quick visual cue in nav/cards */
  icon: string;
  /** Mood keyword used in card subtitles */
  mood: string;
};

export const familyVisuals: Record<FamilySlug, FamilyVisual> = {
  informatique: {
    slug: "informatique",
    tagline: "Tech & performance",
    gradient: "family-gradient-tech",
    accent: "bg-cyan-400",
    icon: "💻",
    mood: "Lignes nettes, surfaces sombres et reflets cyan",
  },
  gaming: {
    slug: "gaming",
    tagline: "Néon & immersion",
    gradient: "family-gradient-gaming",
    accent: "bg-fuchsia-500",
    icon: "🎮",
    mood: "Ambiance néon, contrastes vifs et glow",
  },
  "fournitures-scolaires": {
    slug: "fournitures-scolaires",
    tagline: "Clair & coloré",
    gradient: "family-gradient-school",
    accent: "bg-amber-400",
    icon: "📚",
    mood: "Tons papier, couleurs douces et lisibles",
  },
  bureau: {
    slug: "bureau",
    tagline: "Pro & épuré",
    gradient: "family-gradient-office",
    accent: "bg-slate-500",
    icon: "🗂️",
    mood: "Neutres professionnels, organisation visuelle",
  },
  "maison-alimentaire": {
    slug: "maison-alimentaire",
    tagline: "Chaleur & nature",
    gradient: "family-gradient-home",
    accent: "bg-emerald-500",
    icon: "🏠",
    mood: "Tons chauds, verts naturels",
  },
  cosmetiques: {
    slug: "cosmetiques",
    tagline: "Élégance & douceur",
    gradient: "family-gradient-beauty",
    accent: "bg-rose-400",
    icon: "✨",
    mood: "Rose poudré, finitions satinées",
  },
  "sport-loisirs": {
    slug: "sport-loisirs",
    tagline: "Énergie & mouvement",
    gradient: "family-gradient-sport",
    accent: "bg-orange-500",
    icon: "⚽",
    mood: "Couleurs dynamiques, contrastes sportifs",
  },
};

export function isLightFamily(slug: string | null | undefined): boolean {
  return slug === "fournitures-scolaires" || slug === "bureau";
}

export function isFamilySlug(value: string): value is FamilySlug {
  return value in familyVisuals;
}

export function getFamilyVisual(slug: string | null | undefined): FamilyVisual | null {
  if (!slug || !isFamilySlug(slug)) return null;
  return familyVisuals[slug];
}
