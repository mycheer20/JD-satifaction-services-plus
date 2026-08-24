export type DesignNavItem = {
  href: string;
  label: string;
  description?: string;
  icon: string;
  /** Affiché mais non cliquable */
  disabled?: boolean;
  badge?: string;
};

export type DesignNavSection = {
  title: string;
  items: DesignNavItem[];
};

export const DESIGN_NAV: DesignNavSection[] = [
  {
    title: "Général",
    items: [
      {
        href: "/design",
        label: "Vue d'ensemble",
        description: "Statut, modules et emplacements",
        icon: "🏠",
      },
      {
        href: "/design/apparence",
        label: "Apparence & couleurs",
        description: "Tokens globaux du site",
        icon: "🎨",
      },
    ],
  },
  {
    title: "Contenu visuel",
    items: [
      {
        href: "/design/mediatheque",
        label: "Bibliothèque média",
        description: "Images et fichiers",
        icon: "🖼️",
      },
      {
        href: "/design/accueil",
        label: "Page d'accueil",
        description: "Hero, familles, services",
        icon: "✨",
      },
      {
        href: "/design/a-propos",
        label: "Page À propos",
        description: "Sections institutionnelles",
        icon: "🏢",
      },
      {
        href: "/design/galerie",
        label: "Galerie entreprise",
        description: "Photos publiques",
        icon: "📸",
      },
    ],
  },
];
