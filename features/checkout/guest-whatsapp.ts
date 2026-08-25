import { formatPrice } from "@/lib/utils";
import { formatOrderDeliveryLines } from "@/lib/orders/delivery-display";
import type { OrderDeliverySnapshot } from "@/features/delivery/types";

export interface GuestCheckoutLine {
  name: string;
  variantLabel?: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

export interface GuestCheckoutDetails {
  name: string;
  email: string;
  phone: string;
  delivery: OrderDeliverySnapshot;
  shippingTotal: number;
  shippingCurrency: string;
  note: string;
  couponCode: string;
  paymentMethodLabel: string;
  lines: GuestCheckoutLine[];
}

/** Message WhatsApp prérempli pour une commande invité (non enregistrée en base). */
export function buildGuestWhatsAppMessage(details: GuestCheckoutDetails): string {
  const lines: string[] = [
    "Bonjour, je souhaite passer commande sur votre site.",
    "",
    "— Coordonnées —",
    `Nom : ${details.name}`,
    `Téléphone : ${details.phone}`,
    `E-mail : ${details.email}`,
    "",
    "— Livraison / retrait —",
    ...formatOrderDeliveryLines(details.delivery),
  ];

  if (details.delivery.fulfillment_mode === "delivery" && details.shippingTotal > 0) {
    lines.push(
      `Frais de livraison : ${formatPrice(details.shippingTotal, details.shippingCurrency)}`,
    );
  }

  lines.push("", "— Articles —");

  let subtotal = 0;
  let currency = details.lines[0]?.currency ?? details.shippingCurrency;

  for (const line of details.lines) {
    currency = line.currency;
    const lineTotal = line.unitPrice * line.quantity;
    subtotal += lineTotal;
    const label = line.variantLabel ? `${line.name} (${line.variantLabel})` : line.name;
    lines.push(`${line.quantity} × ${label} — ${formatPrice(lineTotal, line.currency)}`);
  }

  const grandTotal = subtotal + details.shippingTotal;

  lines.push(
    "",
    `Sous-total : ${formatPrice(subtotal, currency)}`,
    details.shippingTotal > 0
      ? `Livraison : ${formatPrice(details.shippingTotal, details.shippingCurrency)}`
      : "Livraison : Retrait en boutique (gratuit)",
    `Total estimé : ${formatPrice(grandTotal, currency)}`,
    `Paiement souhaité : ${details.paymentMethodLabel}`,
  );

  if (details.couponCode.trim()) {
    lines.push(`Code promo : ${details.couponCode.trim()}`);
  }

  if (details.note.trim()) {
    lines.push(`Instructions : ${details.note.trim()}`);
  }

  lines.push("", "Merci de me confirmer la commande et les prochaines étapes.");

  return lines.join("\n");
}
