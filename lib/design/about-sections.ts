import type { DesignPlacementId } from "@/lib/design/placements";

export type AboutSectionId =
  | "hero"
  | "presentation"
  | "history"
  | "mission"
  | "values"
  | "activities"
  | "why-us"
  | "presence"
  | "cta";

export type AboutSectionDef = {
  id: AboutSectionId;
  placement: DesignPlacementId;
  label: string;
  description: string;
  supportsImage: boolean;
  supportsItems: boolean;
  multilineBody: boolean;
};

export const ABOUT_PAGE_SECTIONS: AboutSectionDef[] = [
  {
    id: "hero",
    placement: "about.hero",
    label: "Hero",
    description: "Bannière principale avec titre et sous-titre.",
    supportsImage: true,
    supportsItems: false,
    multilineBody: false,
  },
  {
    id: "presentation",
    placement: "about.presentation",
    label: "Présentation",
    description: "Introduction institutionnelle de l'entreprise.",
    supportsImage: true,
    supportsItems: false,
    multilineBody: true,
  },
  {
    id: "history",
    placement: "about.history",
    label: "Notre histoire",
    description: "Récit et parcours de l'entreprise.",
    supportsImage: true,
    supportsItems: false,
    multilineBody: true,
  },
  {
    id: "mission",
    placement: "about.mission",
    label: "Notre mission",
    description: "Mission et engagement au quotidien.",
    supportsImage: true,
    supportsItems: false,
    multilineBody: true,
  },
  {
    id: "values",
    placement: "about.values",
    label: "Nos valeurs",
    description: "Cartes de valeurs (titre + description par carte).",
    supportsImage: true,
    supportsItems: true,
    multilineBody: false,
  },
  {
    id: "activities",
    placement: "about.activities",
    label: "Nos activités",
    description: "Univers commerciaux et services proposés.",
    supportsImage: true,
    supportsItems: false,
    multilineBody: true,
  },
  {
    id: "why-us",
    placement: "about.why-us",
    label: "Pourquoi nous choisir",
    description: "Arguments différenciateurs sous forme de cartes.",
    supportsImage: true,
    supportsItems: true,
    multilineBody: false,
  },
  {
    id: "presence",
    placement: "about.presence",
    label: "Notre présence",
    description: "Zone d'activité, boutique et livraison.",
    supportsImage: true,
    supportsItems: false,
    multilineBody: true,
  },
  {
    id: "cta",
    placement: "about.cta",
    label: "Appel à l'action",
    description: "Bandeau final orienté contact ou catalogue.",
    supportsImage: true,
    supportsItems: false,
    multilineBody: false,
  },
];

const sectionMap = new Map(ABOUT_PAGE_SECTIONS.map((section) => [section.id, section]));

export function getAboutSectionDef(id: AboutSectionId): AboutSectionDef {
  const def = sectionMap.get(id);
  if (!def) throw new Error(`Section À propos inconnue : ${id}`);
  return def;
}

export function isAboutPlacement(placement: string): placement is DesignPlacementId {
  return ABOUT_PAGE_SECTIONS.some((section) => section.placement === placement);
}
