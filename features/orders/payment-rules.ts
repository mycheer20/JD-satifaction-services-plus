import type { OrderStatus, PaymentStatus } from "@/types/database";

/** Statuts où la commande entre en préparation / livraison / remise au client. */
export const FULFILLMENT_ORDER_STATUSES: OrderStatus[] = [
  "processing",
  "shipped",
  "delivered",
];

export const CONFIRMED_PAYMENT_STATUSES: PaymentStatus[] = ["paid", "authorized"];

export function isFulfillmentOrderStatus(status: OrderStatus): boolean {
  return FULFILLMENT_ORDER_STATUSES.includes(status);
}

export function orderHasConfirmedPayment(
  payments: { status: PaymentStatus | string }[],
): boolean {
  return payments.some((payment) =>
    CONFIRMED_PAYMENT_STATUSES.includes(payment.status as PaymentStatus),
  );
}

export const FULFILLMENT_BLOCKED_MESSAGE =
  "La livraison ou la remise de la commande n'est possible qu'après confirmation du paiement.";
