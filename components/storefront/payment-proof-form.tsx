"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  submitPaymentProof,
  type PaymentProofState,
} from "@/features/payments/actions";
import { PAYMENT_PROOF_MAX_FILES } from "@/features/payments/mobile-money";
import { FormField, TextInput } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/badge";

const initialState: PaymentProofState = { status: "idle" };

export function PaymentProofForm({
  paymentId,
  orderId,
  providerLabel,
  defaultTxnId,
  requireFiles = true,
}: {
  paymentId: string;
  orderId: string;
  providerLabel: string;
  defaultTxnId?: string | null;
  requireFiles?: boolean;
}) {
  const [state, action] = useActionState(submitPaymentProof, initialState);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="payment_id" value={paymentId} />
      <input type="hidden" name="order_id" value={orderId} />

      {state.status === "error" && state.message ? (
        <Alert tone="error">{state.message}</Alert>
      ) : null}

      <FormField
        label="Code / ID de transaction"
        htmlFor={`txn-${paymentId}`}
        required
        hint={`Numéro affiché par ${providerLabel} après l'envoi`}
        error={state.fieldErrors?.customer_txn_id}
      >
        <TextInput
          id={`txn-${paymentId}`}
          name="customer_txn_id"
          required
          defaultValue={defaultTxnId ?? ""}
          placeholder="Ex. TXN123456789"
        />
      </FormField>

      <FormField
        label="Captures de la transaction"
        htmlFor={`proofs-${paymentId}`}
        required
        hint={
          requireFiles
            ? `Obligatoire — jusqu'à ${PAYMENT_PROOF_MAX_FILES} photos (JPEG, PNG, WebP, 5 Mo max chacune)`
            : `Optionnel — ajoutez des captures supplémentaires si besoin`
        }
        error={state.fieldErrors?.proofs}
      >
        <input
          id={`proofs-${paymentId}`}
          name="proofs"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,.jpg,.jpeg"
          multiple
          required={requireFiles}
          className="block w-full cursor-pointer rounded-xl border-2 border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-6 text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-[color:var(--accent-soft)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[color:var(--accent)]"
        />
      </FormField>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? "Envoi en cours…" : "Envoyer la preuve de paiement"}
    </Button>
  );
}
