import type { UserRole } from "@/types/database";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: string;
  /** Visible only to administrators (not staff). */
  adminOnly?: boolean;
  /** Shown in sidebar badge when count > 0. */
  badgeKey?: keyof AdminBadgeCounts;
};

export type AdminNavSection = {
  title: string;
  items: AdminNavItem[];
};

export type AdminBadgeCounts = {
  ordersPending: number;
  reviewsPending: number;
  requestsPending: number;
  lowStock: number;
  notificationsUnread: number;
};

/** Sidebar navigation — mirrors every controllable area of the storefront. */
export const ADMIN_NAV: AdminNavSection[] = [
  {
    title: "Vue d'ensemble",
    items: [
      { href: "/admin", label: "Tableau de bord", icon: "📊" },
      {
        href: "/admin/notifications",
        label: "Notifications",
        icon: "🔔",
        badgeKey: "notificationsUnread",
      },
      { href: "/design", label: "Design du site", icon: "✨", adminOnly: true },
    ],
  },
  {
    title: "Boutique",
    items: [
      { href: "/admin/produits", label: "Produits", icon: "📦", badgeKey: "lowStock" },
      { href: "/admin/marques", label: "Marques", icon: "🏷️" },
      { href: "/admin/commandes", label: "Commandes", icon: "🛒", badgeKey: "ordersPending" },
      { href: "/admin/livraison", label: "Livraison", icon: "📍" },
      { href: "/admin/coupons", label: "Coupons", icon: "🎟️" },
      { href: "/admin/avis", label: "Avis clients", icon: "⭐", badgeKey: "reviewsPending" },
    ],
  },
  {
    title: "Catalogue",
    items: [
      { href: "/admin/familles", label: "Familles", icon: "🛍️", adminOnly: true },
      { href: "/admin/categories", label: "Catégories", icon: "📁", adminOnly: true },
      {
        href: "/admin/sous-categories",
        label: "Sous-catégories",
        icon: "📂",
        adminOnly: true,
      },
      { href: "/admin/champs", label: "Jeux de champs", icon: "🧩", adminOnly: true },
    ],
  },
  {
    title: "Services design",
    items: [
      { href: "/admin/services", label: "Services", icon: "🎨", adminOnly: true },
      {
        href: "/admin/demandes",
        label: "Demandes clients",
        icon: "📋",
        badgeKey: "requestsPending",
      },
    ],
  },
  {
    title: "Système",
    items: [
      { href: "/admin/fournisseurs", label: "Fournisseurs", icon: "🚚", adminOnly: true },
      { href: "/admin/utilisateurs", label: "Utilisateurs", icon: "👥", adminOnly: true },
    ],
  },
];

export function filterAdminNav(role: UserRole, badges?: AdminBadgeCounts): AdminNavSection[] {
  const isAdmin = role === "admin";

  return ADMIN_NAV.map((section) => ({
    ...section,
    items: section.items
      .filter((item) => isAdmin || !item.adminOnly)
      .map((item) => ({
        ...item,
        badge:
          item.badgeKey && badges && badges[item.badgeKey] > 0
            ? badges[item.badgeKey]
            : undefined,
      })),
  }));
}

export function adminNavFlat(role: UserRole) {
  return filterAdminNav(role).flatMap((section) => section.items);
}
