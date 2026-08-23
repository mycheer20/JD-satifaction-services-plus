/** Visual cues per design service — slugs match the database. */

export type ServiceSlug =
  | "creation-de-logo"
  | "flyer"
  | "carte-de-visite"
  | "affiche"
  | "invitation"
  | "banniere"
  | "brochure"
  | "depliant"
  | "menu"
  | "catalogue"
  | "packaging"
  | "retouche-photo"
  | "autres-creations";

export type ServiceVisual = {
  icon: string;
  /** Tailwind text color for icon badge */
  chip: string;
  /** Short keyword for cards */
  keyword: string;
};

const defaults: ServiceVisual = {
  icon: "✏️",
  chip: "bg-indigo-100 text-indigo-700",
  keyword: "Sur mesure",
};

export const serviceVisuals: Record<ServiceSlug, ServiceVisual> = {
  "creation-de-logo": { icon: "🎯", chip: "bg-violet-100 text-violet-700", keyword: "Identité" },
  flyer: { icon: "📄", chip: "bg-sky-100 text-sky-700", keyword: "Print" },
  "carte-de-visite": { icon: "💼", chip: "bg-slate-100 text-slate-700", keyword: "Contact" },
  affiche: { icon: "🖼️", chip: "bg-rose-100 text-rose-700", keyword: "Visibilité" },
  invitation: { icon: "💌", chip: "bg-pink-100 text-pink-700", keyword: "Événement" },
  banniere: { icon: "🪧", chip: "bg-cyan-100 text-cyan-700", keyword: "Web & rue" },
  brochure: { icon: "📖", chip: "bg-emerald-100 text-emerald-700", keyword: "Présentation" },
  depliant: { icon: "📋", chip: "bg-amber-100 text-amber-800", keyword: "Plier" },
  menu: { icon: "🍽️", chip: "bg-orange-100 text-orange-700", keyword: "Restauration" },
  catalogue: { icon: "📚", chip: "bg-blue-100 text-blue-700", keyword: "Offre" },
  packaging: { icon: "📦", chip: "bg-lime-100 text-lime-800", keyword: "Emballage" },
  "retouche-photo": { icon: "📸", chip: "bg-fuchsia-100 text-fuchsia-700", keyword: "Photo" },
  "autres-creations": { icon: "✨", chip: "bg-indigo-100 text-indigo-700", keyword: "Libre" },
};

export function getServiceVisual(slug: string): ServiceVisual {
  return serviceVisuals[slug as ServiceSlug] ?? defaults;
}

export const studioSteps = [
  {
    step: "1",
    title: "Brief détaillé",
    description: "Décrivez votre projet, vos inspirations et vos contraintes.",
  },
  {
    step: "2",
    title: "Analyse & devis",
    description: "Notre équipe étudie votre demande et vous contacte rapidement.",
  },
  {
    step: "3",
    title: "Création & livraison",
    description: "Validation des propositions, retouches et fichiers finaux.",
  },
] as const;
