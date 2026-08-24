/** Adresse de livraison stockée en jsonb sur `orders.shipping_address`. */
export type OrderShippingAddress = {
  line1?: string;
  line2?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country?: string;
};

export function parseOrderShippingAddress(raw: unknown): OrderShippingAddress {
  if (!raw || typeof raw !== "object") return {};
  const value = raw as Record<string, unknown>;
  return {
    line1: typeof value.line1 === "string" ? value.line1 : undefined,
    line2: typeof value.line2 === "string" ? value.line2 : undefined,
    city: typeof value.city === "string" ? value.city : undefined,
    region: typeof value.region === "string" ? value.region : undefined,
    postal_code: typeof value.postal_code === "string" ? value.postal_code : undefined,
    country: typeof value.country === "string" ? value.country : undefined,
  };
}

/** Lignes d'adresse prêtes à afficher (une entrée par ligne). */
export function formatOrderShippingLines(address: OrderShippingAddress): string[] {
  const lines: string[] = [];
  if (address.line1?.trim()) lines.push(address.line1.trim());
  if (address.line2?.trim()) lines.push(address.line2.trim());

  const locality = [address.postal_code?.trim(), address.city?.trim()].filter(Boolean).join(" ");
  if (locality) lines.push(locality);
  if (address.region?.trim()) lines.push(address.region.trim());
  if (address.country?.trim()) lines.push(address.country.trim());

  return lines;
}

export function formatOrderShippingBlock(address: OrderShippingAddress): string {
  return formatOrderShippingLines(address).join("\n");
}

export function hasOrderShippingAddress(address: OrderShippingAddress): boolean {
  return formatOrderShippingLines(address).length > 0;
}
