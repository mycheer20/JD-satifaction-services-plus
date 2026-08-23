/**
 * The cart lives in the browser. Everything it stores about price is for
 * display only — `place_order` re-reads prices, stock and discounts from the
 * database before an order exists.
 */
export interface CartItem {
  /** Stable identity of a line: product id, or product id + variant id. */
  lineId: string;
  kind: "product" | "service";
  productId?: string;
  variantId?: string;
  serviceId?: string;
  serviceRequestId?: string;
  slug: string;
  name: string;
  variantLabel?: string;
  image: string | null;
  unitPrice: number;
  currency: string;
  quantity: number;
  /** Null when the item is not inventory-tracked. */
  maxQuantity: number | null;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  currency: string;
}

export function makeLineId(productId: string, variantId?: string | null): string {
  return variantId ? `${productId}:${variantId}` : productId;
}

/** The line id a cart entry should have, derived from what it points at. */
export function lineIdFor(item: Omit<CartItem, "lineId">): string {
  if (item.kind === "service") return `service:${item.serviceId}`;
  return makeLineId(item.productId ?? item.slug, item.variantId);
}

export function computeTotals(items: CartItem[], fallbackCurrency: string): CartTotals {
  return {
    itemCount: items.reduce((n, item) => n + item.quantity, 0),
    subtotal: items.reduce((n, item) => n + item.unitPrice * item.quantity, 0),
    currency: items[0]?.currency ?? fallbackCurrency,
  };
}
