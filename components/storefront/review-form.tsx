"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitReview, type ReviewState } from "@/features/reviews/actions";
import { FormField, Select, TextArea, TextInput } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TextLink } from "@/components/ui/link";

const initial: ReviewState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Envoi…" : "Publier mon avis"}
    </Button>
  );
}

export function ReviewForm({
  productId,
  signedIn,
}: {
  productId: string;
  signedIn: boolean;
}) {
  const [state, action] = useActionState(submitReview, initial);

  if (!signedIn) {
    return (
      <Card padding="md" tone="muted">
        <p className="text-sm text-muted">
          <TextLink href="/connexion">Connectez-vous</TextLink> pour laisser un avis sur ce
          produit.
        </p>
      </Card>
    );
  }

  if (state.status === "success") {
    return <Alert tone="success">{state.message}</Alert>;
  }

  return (
    <Card padding="md" tone="family">
      <h3 className="mb-4 text-sm font-bold text-[color:var(--color-foreground)]">
        Donner votre avis
      </h3>
      <form action={action} className="space-y-4">
        <input type="hidden" name="productId" value={productId} />

        {state.status === "error" && state.message ? (
          <Alert tone="error">{state.message}</Alert>
        ) : null}

        <FormField label="Note" htmlFor="rating" required error={state.fieldErrors?.rating}>
          <Select id="rating" name="rating" required defaultValue="">
            <option value="" disabled>
              Choisir…
            </option>
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} — {"★".repeat(value)}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Titre (optionnel)" htmlFor="review-title">
          <TextInput id="review-title" name="title" maxLength={120} />
        </FormField>

        <FormField
          label="Votre avis"
          htmlFor="review-body"
          required
          error={state.fieldErrors?.body}
        >
          <TextArea id="review-body" name="body" required minLength={10} maxLength={2000} />
        </FormField>

        <SubmitButton />
      </form>
    </Card>
  );
}
