"use client";

import { ORDER_STATUS_LABELS } from "@/lib/admin/labels";
import {
  FULFILLMENT_BLOCKED_MESSAGE,
  FULFILLMENT_ORDER_STATUSES,
  orderHasConfirmedPayment,
} from "@/features/orders/payment-rules";
import type { OrderStatus, PaymentStatus } from "@/types/database";
import { FieldShell, Select, TextArea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/badge";

export function OrderStatusForm({
  orderId,
  currentStatus,
  adminNote,
  payments,
  updateAction,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  adminNote: string | null;
  payments: { status: PaymentStatus | string }[];
  updateAction: (formData: FormData) => void | Promise<void>;
}) {
  const isPaid = orderHasConfirmedPayment(payments);

  return (
    <form action={updateAction} className="space-y-4">
      <input type="hidden" name="order_id" value={orderId} />
      {!isPaid ? (
        <Alert tone="warning" className="text-xs">
          {FULFILLMENT_BLOCKED_MESSAGE} Confirmez d&apos;abord le paiement ci-dessous.
        </Alert>
      ) : null}
      <FieldShell label="Statut" htmlFor="status">
        <Select id="status" name="status" defaultValue={currentStatus}>
          {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => {
            const blocked =
              !isPaid && FULFILLMENT_ORDER_STATUSES.includes(value as OrderStatus);
            return (
              <option key={value} value={value} disabled={blocked}>
                {label}
                {blocked ? " (paiement requis)" : ""}
              </option>
            );
          })}
        </Select>
      </FieldShell>
      <FieldShell label="Note interne" htmlFor="admin_note">
        <TextArea id="admin_note" name="admin_note" defaultValue={adminNote ?? ""} />
      </FieldShell>
      <Button type="submit" className="w-full">
        Mettre à jour
      </Button>
    </form>
  );
}
