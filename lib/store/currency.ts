import { publicEnv } from "@/lib/public-env";

/** Devise principale de la boutique — prix stockés en gourdes haïtiennes. */
export const PRIMARY_CURRENCY = "HTG";

const numberFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

const usdFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

/** Taux du jour : combien de gourdes pour 1 USD. */
export function usdHtgRate(): number {
  const raw = process.env.NEXT_PUBLIC_USD_HTG_RATE?.trim();
  const rate = raw ? Number(raw.replace(",", ".")) : NaN;
  if (Number.isFinite(rate) && rate > 0) return rate;
  return 132;
}

export function usdHtgRateLabel(): string | null {
  const label = process.env.NEXT_PUBLIC_USD_HTG_RATE_DATE?.trim();
  return label || null;
}

/** Montant HTG → USD (indicatif). */
export function htgToUsd(amountHtg: number): number {
  return amountHtg / usdHtgRate();
}

export function formatGourdes(
  amount: number | null | undefined,
  options?: { compact?: boolean },
): string {
  if (amount === null || amount === undefined) return "—";
  const formatted = numberFormatter.format(Math.round(amount));
  return options?.compact ? `${formatted} G` : `${formatted} gdes`;
}

export function formatUsd(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "—";
  return usdFormatter.format(amount);
}

export function formatDualPrice(amountHtg: number | null | undefined): {
  htg: string;
  usd: string;
} {
  if (amountHtg === null || amountHtg === undefined) {
    return { htg: "—", usd: "—" };
  }
  return {
    htg: formatGourdes(amountHtg),
    usd: formatUsd(htgToUsd(amountHtg)),
  };
}

/** Affiche en gourdes si HTG/XOF (legacy), sinon devise ISO. */
export function formatStorePrice(
  amount: number | null | undefined,
  currency = publicEnv.currency,
): string {
  if (amount === null || amount === undefined) return "—";
  if (currency === "HTG" || currency === "XOF") {
    return formatGourdes(amount);
  }
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "USD" ? 2 : 0,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

export function isHaitiStoreCurrency(currency?: string): boolean {
  const code = currency ?? publicEnv.currency;
  return code === "HTG" || code === "XOF";
}
