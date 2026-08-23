import "server-only";

import { pickupAddressLines, storeContact } from "@/lib/store/contact";
import { formatDualPrice, formatStorePrice, isHaitiStoreCurrency } from "@/lib/store/currency";
import type { PaymentRow } from "@/types/database";

function paymentAmountLabel(amount: number, currency: string): string {
  if (isHaitiStoreCurrency(currency)) {
    const dual = formatDualPrice(amount);
    return `${dual.htg} (≈ ${dual.usd})`;
  }
  return formatStorePrice(amount, currency);
}

export type PaymentInstructionKind =
  | "pickup_in_store"
  | "bank_transfer"
  | "transfer_card"
  | "natcash"
  | "moncash";

export type PaymentInstructions = {
  kind: PaymentInstructionKind;
  title: string;
  summary: string;
  steps: string[];
  reference: string;
  amountLabel: string;
  pickup?: {
    label: string;
    addressLines: string[];
    hours: string;
    mapsUrl: string;
  };
  transfer?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  /** Virement bancaire : accord WhatsApp requis avant d'effectuer le virement. */
  whatsAppRequired?: boolean;
  mobileMoney?: {
    provider: "NatCash" | "MonCash";
    walletName: string;
    walletNumber: string;
  };
};

export function buildPaymentInstructions(
  providerId: string,
  reference: string,
  amount: number,
  currency: string,
): PaymentInstructions {
  const amountLabel = paymentAmountLabel(amount, currency);
  const base = { reference, amountLabel };

  switch (providerId) {
    case "pickup_in_store":
      return {
        kind: "pickup_in_store",
        title: "Retrait & paiement en boutique",
        summary:
          "Présentez-vous à notre point de retrait avec votre référence de commande pour régler et récupérer vos articles.",
        steps: [
          `Notez votre référence : ${reference}`,
          `Montant à régler sur place : ${amountLabel}`,
          `Adresse : ${pickupAddressLines().join(", ")}`,
          "Apportez une pièce d'identité si demandée.",
          "Notre équipe vous remettra la commande après paiement.",
        ],
        pickup: {
          label: storeContact.pickup.label,
          addressLines: pickupAddressLines(),
          hours: storeContact.pickup.hours,
          mapsUrl: storeContact.pickup.mapsUrl,
        },
        ...base,
      };

    case "bank_transfer":
      return {
        kind: "bank_transfer",
        title: "Virement bancaire",
        summary:
          "Contactez-nous sur WhatsApp pour confirmer votre commande. Le virement ne doit être effectué qu'après accord de notre équipe.",
        steps: [
          `Contactez-nous sur WhatsApp avec votre référence : ${reference}`,
          "Attendez notre confirmation et les instructions finales avant d'effectuer le virement.",
          `Montant à virer : ${amountLabel}`,
          `Référence obligatoire (libellé) : ${reference}`,
          `Banque : ${storeContact.bank.bankName}`,
          `Titulaire : ${storeContact.bank.accountName}`,
          `N° compte : ${storeContact.bank.accountNumber}`,
          "Envoyez la preuve de virement par WhatsApp pour valider votre paiement.",
        ],
        transfer: {
          bankName: storeContact.bank.bankName,
          accountName: storeContact.bank.accountName,
          accountNumber: storeContact.bank.accountNumber,
        },
        whatsAppRequired: true,
        ...base,
      };

    case "transfer_card":
      return {
        kind: "transfer_card",
        title: "Carte bancaire (Stripe)",
        summary:
          "Le paiement par carte via Stripe sera disponible prochainement. Contactez-nous sur WhatsApp en attendant.",
        steps: [
          `Montant : ${amountLabel}`,
          `Référence : ${reference}`,
          "Ce mode de paiement n'est pas encore activé.",
          "Contactez-nous sur WhatsApp pour convenir d'un autre moyen de paiement.",
        ],
        whatsAppRequired: true,
        ...base,
      };

    case "natcash":
      return {
        kind: "natcash",
        title: "Paiement NatCash",
        summary: "Envoyez le montant exact vers notre portefeuille NatCash.",
        steps: [
          `Montant : ${amountLabel}`,
          `Référence (motif) : ${reference}`,
          `Portefeuille : ${storeContact.natcash.walletName}`,
          `Numéro NatCash : ${storeContact.natcash.walletNumber}`,
          "Conservez la confirmation et envoyez votre preuve sur la page commande ou par WhatsApp.",
        ],
        mobileMoney: {
          provider: "NatCash",
          walletName: storeContact.natcash.walletName,
          walletNumber: storeContact.natcash.walletNumber,
        },
        ...base,
      };

    case "moncash":
      return {
        kind: "moncash",
        title: "Paiement MonCash",
        summary: "Envoyez le montant exact vers notre portefeuille MonCash.",
        steps: [
          `Montant : ${amountLabel}`,
          `Référence (motif) : ${reference}`,
          `Portefeuille : ${storeContact.moncash.walletName}`,
          `Numéro MonCash : ${storeContact.moncash.walletNumber}`,
          "Conservez la confirmation et envoyez votre preuve sur la page commande ou par WhatsApp.",
        ],
        mobileMoney: {
          provider: "MonCash",
          walletName: storeContact.moncash.walletName,
          walletNumber: storeContact.moncash.walletNumber,
        },
        ...base,
      };

    default:
      return {
        kind: "bank_transfer",
        title: "Instructions de paiement",
        summary: "Suivez les indications communiquées par notre équipe.",
        steps: [`Référence : ${reference}`, `Montant : ${amountLabel}`],
        ...base,
      };
  }
}

export function instructionsFromPayment(payment: PaymentRow): PaymentInstructions | null {
  const payload = payment.provider_payload as Record<string, unknown> | null;
  if (payload?.instructions && typeof payload.instructions === "object") {
    return payload.instructions as PaymentInstructions;
  }
  let providerId =
    typeof payload?.providerId === "string" ? payload.providerId : payment.provider;
  if (providerId === "cash_on_delivery") providerId = "pickup_in_store";

  const reference =
    payment.transaction_reference ??
    (typeof payload?.reference === "string" ? payload.reference : "—");

  return buildPaymentInstructions(
    providerId,
    reference,
    Number(payment.amount),
    payment.currency,
  );
}
