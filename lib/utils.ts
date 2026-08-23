import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { publicEnv } from "@/lib/public-env";
import { formatGourdes, formatStorePrice, isHaitiStoreCurrency } from "@/lib/store/currency";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatPrice(
  amount: number | null | undefined,
  currency = publicEnv.currency,
  locale = "fr-FR",
): string {
  if (amount === null || amount === undefined) return "—";
  if (isHaitiStoreCurrency(currency)) {
    return formatGourdes(amount);
  }
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "USD" ? 2 : 0,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

/** Alias explicite pour l'admin et les rapports. */
export { formatStorePrice };

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatDateShort(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(date);
}
