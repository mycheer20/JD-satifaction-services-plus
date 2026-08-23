import "server-only";

import { buildPaymentInstructions } from "@/features/payments/instructions";
import type { PaymentStatus } from "@/types/database";

export interface PaymentIntentRequest {
  orderId: string;
  reference: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string | null;
  returnUrl: string;
}

export interface PaymentIntentResult {
  status: PaymentStatus;
  redirectUrl?: string;
  transactionReference?: string;
  payload?: Record<string, unknown>;
  failureReason?: string;
}

export interface PaymentProvider {
  id: string;
  label: string;
  description: string;
  isOffline: boolean;
  /** Visible et sélectionnable au checkout. */
  enabledForCheckout: boolean;
  createIntent(request: PaymentIntentRequest): Promise<PaymentIntentResult>;
  parseWebhook?(
    rawBody: string,
    headers: Headers,
  ): Promise<{
    eventId: string;
    transactionReference: string;
    status: PaymentStatus;
    payload: Record<string, unknown>;
  } | null>;
}

function offlineIntent(
  providerId: string,
  request: PaymentIntentRequest,
): PaymentIntentResult {
  const instructions = buildPaymentInstructions(
    providerId,
    request.reference,
    request.amount,
    request.currency,
  );

  return {
    status: "pending",
    transactionReference: request.reference,
    payload: {
      providerId,
      reference: request.reference,
      instructions,
      notificationSent: true,
    },
  };
}

const pickupInStore: PaymentProvider = {
  id: "pickup_in_store",
  label: "Paiement sur place (retrait boutique)",
  description:
    "Vous réglez et récupérez votre commande à notre boutique. Adresse et plan Google Maps après validation.",
  isOffline: true,
  enabledForCheckout: true,
  async createIntent(request) {
    return offlineIntent("pickup_in_store", request);
  },
};

const bankTransfer: PaymentProvider = {
  id: "bank_transfer",
  label: "Virement bancaire",
  description:
    "Accord préalable sur WhatsApp requis. Les coordonnées bancaires (hors infos confidentielles) sont affichées après commande.",
  isOffline: true,
  enabledForCheckout: true,
  async createIntent(request) {
    return offlineIntent("bank_transfer", request);
  },
};

/** Stripe — réservé pour une activation ultérieure (non proposé au checkout). */
const transferCard: PaymentProvider = {
  id: "transfer_card",
  label: "Carte bancaire (Stripe)",
  description:
    "Paiement sécurisé par carte via Stripe — disponible prochainement.",
  isOffline: false,
  enabledForCheckout: false,
  async createIntent(request) {
    return offlineIntent("transfer_card", request);
  },
};

const natCash: PaymentProvider = {
  id: "natcash",
  label: "NatCash",
  description:
    "Envoyez le montant exact à notre portefeuille NatCash avec la référence de commande.",
  isOffline: true,
  enabledForCheckout: true,
  async createIntent(request) {
    return offlineIntent("natcash", request);
  },
};

const monCash: PaymentProvider = {
  id: "moncash",
  label: "MonCash",
  description:
    "Envoyez le montant exact à notre portefeuille MonCash avec la référence de commande.",
  isOffline: true,
  enabledForCheckout: true,
  async createIntent(request) {
    return offlineIntent("moncash", request);
  },
};

const registry = new Map<string, PaymentProvider>(
  [pickupInStore, bankTransfer, transferCard, natCash, monCash].map((provider) => [
    provider.id,
    provider,
  ]),
);

export function registerPaymentProvider(provider: PaymentProvider) {
  registry.set(provider.id, provider);
}

export function getPaymentProvider(id: string): PaymentProvider | null {
  return registry.get(id) ?? null;
}

export function isCheckoutPaymentProvider(id: string): boolean {
  const provider = registry.get(id);
  return Boolean(provider?.enabledForCheckout);
}

export function listPaymentProviders(): PaymentProvider[] {
  return [...registry.values()];
}

export function listPaymentMethodsForCheckout() {
  return listPaymentProviders()
    .filter((provider) => provider.enabledForCheckout)
    .map((provider) => ({
      id: provider.id,
      label: provider.label,
      description: provider.description,
    }));
}
