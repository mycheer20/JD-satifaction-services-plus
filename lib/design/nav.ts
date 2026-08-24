export type DesignNavAccent =
  | "violet"
  | "sky"
  | "amber"
  | "rose"
  | "emerald"
  | "fuchsia"
  | "cyan";

export type DesignNavItem = {
  href: string;
  label: string;
  description?: string;
  icon: string;
  accent?: DesignNavAccent;
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
        accent: "violet",
      },
      {
        href: "/design/publication",
        label: "Publication & aperçu",
        description: "Prévisualiser et publier le site",
        icon: "🚀",
        accent: "emerald",
        badge: "Nouveau",
      },
      {
        href: "/design/apparence",
        label: "Apparence & couleurs",
        description: "Tokens globaux du site",
        icon: "🎨",
        accent: "sky",
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
        accent: "amber",
      },
      {
        href: "/design/accueil",
        label: "Page d'accueil",
        description: "Hero, familles, services",
        icon: "✨",
        accent: "cyan",
      },
      {
        href: "/design/a-propos",
        label: "Page À propos",
        description: "Sections institutionnelles",
        icon: "🏢",
        accent: "rose",
      },
      {
        href: "/design/galerie",
        label: "Galerie entreprise",
        description: "Photos publiques",
        icon: "📸",
        accent: "amber",
      },
      {
        href: "/design/animations",
        label: "Animations",
        description: "Transitions, survols et apparitions",
        icon: "🎬",
        accent: "fuchsia",
      },
    ],
  },
];

export const DESIGN_NAV_ACCENTS: Record<
  DesignNavAccent,
  { icon: string; active: string; ring: string }
> = {
  violet: {
    icon: "bg-gradient-to-br from-violet-400 to-indigo-500 shadow-violet-500/30",
    active: "bg-gradient-to-r from-violet-500/20 to-indigo-500/10 ring-1 ring-violet-400/40",
    ring: "ring-violet-400/50",
  },
  sky: {
    icon: "bg-gradient-to-br from-sky-400 to-blue-500 shadow-sky-500/30",
    active: "bg-gradient-to-r from-sky-500/20 to-blue-500/10 ring-1 ring-sky-400/40",
    ring: "ring-sky-400/50",
  },
  amber: {
    icon: "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30",
    active: "bg-gradient-to-r from-amber-500/20 to-orange-500/10 ring-1 ring-amber-400/40",
    ring: "ring-amber-400/50",
  },
  rose: {
    icon: "bg-gradient-to-br from-rose-400 to-pink-500 shadow-rose-500/30",
    active: "bg-gradient-to-r from-rose-500/20 to-pink-500/10 ring-1 ring-rose-400/40",
    ring: "ring-rose-400/50",
  },
  emerald: {
    icon: "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/30",
    active: "bg-gradient-to-r from-emerald-500/20 to-teal-500/10 ring-1 ring-emerald-400/40",
    ring: "ring-emerald-400/50",
  },
  fuchsia: {
    icon: "bg-gradient-to-br from-fuchsia-400 via-pink-500 to-orange-400 shadow-fuchsia-500/40",
    active: "bg-gradient-to-r from-fuchsia-500/25 via-pink-500/15 to-orange-400/10 ring-1 ring-fuchsia-400/50",
    ring: "ring-fuchsia-400/60",
  },
  cyan: {
    icon: "bg-gradient-to-br from-cyan-400 to-teal-500 shadow-cyan-500/30",
    active: "bg-gradient-to-r from-cyan-500/20 to-teal-500/10 ring-1 ring-cyan-400/40",
    ring: "ring-cyan-400/50",
  },
};
