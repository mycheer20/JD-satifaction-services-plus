import { PaymentProofForm } from "@/components/storefront/payment-proof-form";
import { StoreContactActions } from "@/components/storefront/store-contact-actions";
import { Alert, Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { PaymentProofFileRow, PaymentRow } from "@/types/database";
import { formatDate } from "@/lib/utils";

export function MobileMoneyProofPanel({
  payment,
  orderId,
  orderReference,
  amountLabel,
  proofFiles,
}: {
  payment: PaymentRow;
  orderId: string;
  orderReference: string;
  amountLabel: string;
  proofFiles: PaymentProofFileRow[];
}) {
  const submitted = Boolean(payment.proof_submitted_at);
  const providerLabel = payment.provider === "moncash" ? "MonCash" : "NatCash";

  return (
    <Card padding="md" className="space-y-4 border-2 border-[color:var(--accent)]/30">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--accent)]">
            Confirmer votre paiement {providerLabel}
          </p>
          <p className="mt-1 text-sm text-muted">
            Après avoir envoyé l&apos;argent, transmettez ici votre ID de transaction et
            une ou plusieurs captures. Vous pouvez aussi nous contacter sur WhatsApp.
          </p>
        </div>
        {submitted ? <Badge tone="success">Preuve reçue</Badge> : <Badge tone="warning">En attente</Badge>}
      </div>

      {submitted ? (
        <Alert tone="success">
          <p className="font-semibold">Preuve enregistrée — validation en cours</p>
          <p className="mt-1 text-sm opacity-90">
            Reçue le {formatDate(payment.proof_submitted_at!)}.
            {payment.customer_txn_id
              ? ` ID transaction : ${payment.customer_txn_id}.`
              : ""}{" "}
            Notre équipe confirmera votre paiement sous peu.
          </p>
        </Alert>
      ) : null}

      {proofFiles.length > 0 ? (
        <div className="rounded-xl bg-[color:var(--color-surface-muted)]/80 p-4 text-sm">
          <p className="font-semibold">
            {proofFiles.length} capture{proofFiles.length > 1 ? "s" : ""} déjà envoyée
            {proofFiles.length > 1 ? "s" : ""}
          </p>
          <ul className="mt-2 space-y-1 text-muted">
            {proofFiles.map((file) => (
              <li key={file.id}>{file.file_name}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {payment.status === "pending" ? (
        <PaymentProofForm
          paymentId={payment.id}
          orderId={orderId}
          providerLabel={providerLabel}
          defaultTxnId={payment.customer_txn_id}
          requireFiles={!submitted}
        />
      ) : null}

      <div className="rounded-xl border border-[color:var(--color-border)] p-4">
        <p className="text-sm font-semibold">Ou via WhatsApp</p>
        <p className="mt-1 text-xs text-muted">
          Envoyez la même preuve sur WhatsApp si vous préférez — les deux options fonctionnent.
        </p>
        <StoreContactActions
          className="mt-3"
          subject={`commande ${orderReference}`}
          whatsAppMessage={`Bonjour, voici ma preuve de paiement ${providerLabel} pour la commande ${orderReference} (${amountLabel})${payment.customer_txn_id ? ` — ID: ${payment.customer_txn_id}` : ""}.`}
        />
      </div>
    </Card>
  );
}
