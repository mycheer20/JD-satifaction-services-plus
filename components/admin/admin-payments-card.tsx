import { getPaymentProofSignedUrls } from "@/features/payments/proof-queries";
import { isMobileMoneyProvider } from "@/features/payments/mobile-money";
import { confirmPayment } from "@/features/admin/actions/orders";
import { StatusBadge } from "@/components/admin/admin-table";
import {
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_TONE,
} from "@/lib/admin/labels";
import { formatDate, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { PaymentProofFileRow, PaymentStatus } from "@/types/database";

export async function AdminPaymentsCard({
  orderId,
  payments,
}: {
  orderId: string;
  payments: {
    id: string;
    provider: string;
    payment_method: string;
    status: string;
    amount: number;
    customer_txn_id: string | null;
    proof_submitted_at: string | null;
    proof_files: PaymentProofFileRow[];
  }[];
}) {
  return (
    <div className="space-y-3">
      <h2 className="font-bold">Paiements</h2>
      {payments.map((payment) => (
        <AdminPaymentItem key={payment.id} orderId={orderId} payment={payment} />
      ))}
    </div>
  );
}

async function AdminPaymentItem({
  orderId,
  payment,
}: {
  orderId: string;
  payment: {
    id: string;
    provider: string;
    payment_method: string;
    status: string;
    amount: number;
    customer_txn_id: string | null;
    proof_submitted_at: string | null;
    proof_files: PaymentProofFileRow[];
  };
}) {
  const proofUrls =
    payment.proof_files?.length > 0
      ? await getPaymentProofSignedUrls(payment.proof_files)
      : [];

  return (
    <div className="rounded-xl border p-3 text-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span>{payment.payment_method}</span>
        <StatusBadge
          label={PAYMENT_STATUS_LABELS[payment.status as PaymentStatus]}
          tone={PAYMENT_STATUS_TONE[payment.status as PaymentStatus]}
        />
      </div>
      <p className="font-semibold">{formatPrice(Number(payment.amount))}</p>
      {isMobileMoneyProvider(payment.provider) && payment.customer_txn_id ? (
        <p className="mt-2 text-xs text-muted">
          ID client :{" "}
          <span className="font-mono font-semibold text-[color:var(--color-foreground)]">
            {payment.customer_txn_id}
          </span>
        </p>
      ) : null}
      {payment.proof_submitted_at ? (
        <p className="mt-1 text-xs text-emerald-700">
          Preuve reçue le {formatDate(payment.proof_submitted_at)}
        </p>
      ) : null}
      {proofUrls.length > 0 ? (
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {proofUrls.map((file) => (
            <li key={file.id}>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-lg border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.url}
                  alt={file.fileName}
                  className="aspect-video w-full object-cover"
                />
              </a>
              <p className="mt-1 truncate text-[10px] text-muted">{file.fileName}</p>
            </li>
          ))}
        </ul>
      ) : null}
      {payment.status === "pending" ? (
        <form action={confirmPayment} className="mt-3">
          <input type="hidden" name="payment_id" value={payment.id} />
          <input type="hidden" name="order_id" value={orderId} />
          <Button type="submit" variant="soft" size="sm" className="w-full">
            Confirmer réception
          </Button>
        </form>
      ) : null}
    </div>
  );
}
