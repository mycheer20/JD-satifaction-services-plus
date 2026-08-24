import { formatPrice } from "@/lib/utils";

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
  address: string;
  city: string;
  region: string;
  postalCode: string;
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
    "— Livraison —",
    `Adresse : ${details.address}`,
    `Ville : ${details.city}`,
  ];

  if (details.region.trim()) lines.push(`Région : ${details.region.trim()}`);
  if (details.postalCode.trim()) lines.push(`Code postal : ${details.postalCode.trim()}`);
  if (details.note.trim()) lines.push(`Instructions : ${details.note.trim()}`);

  lines.push("", "— Articles —");

  let subtotal = 0;
  let currency = details.lines[0]?.currency ?? "HTG";

  for (const line of details.lines) {
    currency = line.currency;
    const lineTotal = line.unitPrice * line.quantity;
    subtotal += lineTotal;
    const label = line.variantLabel ? `${line.name} (${line.variantLabel})` : line.name;
    lines.push(
      `${line.quantity} × ${label} — ${formatPrice(lineTotal, line.currency)}`,
    );
  }

  lines.push(
    "",
    `Total estimé : ${formatPrice(subtotal, currency)}`,
    `Paiement souhaité : ${details.paymentMethodLabel}`,
  );

  if (details.couponCode.trim()) {
    lines.push(`Code promo : ${details.couponCode.trim()}`);
  }

  lines.push("", "Merci de me confirmer la commande et les prochaines étapes.");

  return lines.join("\n");
}
