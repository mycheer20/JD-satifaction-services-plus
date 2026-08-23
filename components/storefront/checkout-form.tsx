"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useCart } from "@/features/cart/cart-context";
import { submitOrder, type CheckoutState } from "@/features/checkout/actions";
import { FormField, RadioField, TextArea, TextInput } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Alert, EmptyState } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TextLink } from "@/components/ui/link";
import { ButtonLink } from "@/components/ui/button";
import { PriceDisplay } from "@/components/storefront/price-display";
import { Skeleton } from "@/components/ui/badge";

interface PaymentMethod {
  id: string;
  label: string;
  description: string;
}

const initialState: CheckoutState = { status: "idle" };

export function CheckoutForm({
  paymentMethods,
  defaults,
}: {
  paymentMethods: PaymentMethod[];
  defaults: { name: string; email: string; phone: string };
}) {
  const { items, totals, ready } = useCart();
  const [state, action] = useActionState(submitOrder, initialState);

  if (!ready) {
    return <Skeleton className="h-96" />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Votre panier est vide"
        description="Ajoutez au moins un produit avant de passer commande."
        icon="🛒"
        action={<ButtonLink href="/catalogue">Voir le catalogue</ButtonLink>}
      />
    );
  }

  const payload = JSON.stringify(
    items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      serviceId: item.serviceId,
      quantity: item.quantity,
    })),
  );

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <input type="hidden" name="items" value={payload} />

      <div className="space-y-6">
        {state.status === "error" && state.message ? (
          <Alert tone="error">{state.message}</Alert>
        ) : null}

        <Card padding="md" className="space-y-4">
          <h2 className="text-base font-bold text-[color:var(--color-foreground)]">
            Vos coordonnées
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Nom complet" htmlFor="name" required error={state.fieldErrors?.name}>
              <TextInput id="name" name="name" required defaultValue={defaults.name} />
            </FormField>
            <FormField label="Téléphone" htmlFor="phone" required error={state.fieldErrors?.phone}>
              <TextInput
                id="phone"
                name="phone"
                type="tel"
                required
                defaultValue={defaults.phone}
              />
            </FormField>
            <FormField
              label="Adresse e-mail"
              htmlFor="email"
              required
              error={state.fieldErrors?.email}
              className="sm:col-span-2"
            >
              <TextInput
                id="email"
                name="email"
                type="email"
                required
                defaultValue={defaults.email}
              />
            </FormField>
          </div>
        </Card>

        <Card padding="md" className="space-y-4">
          <h2 className="text-base font-bold text-[color:var(--color-foreground)]">Livraison</h2>
          <p className="text-xs text-muted">
            La préparation et l&apos;expédition débutent après confirmation de votre paiement.
          </p>
          <FormField label="Adresse" htmlFor="address" required error={state.fieldErrors?.address}>
            <TextArea id="address" name="address" rows={2} required />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Ville" htmlFor="city" required error={state.fieldErrors?.city}>
              <TextInput id="city" name="city" required />
            </FormField>
            <FormField label="Région" htmlFor="region">
              <TextInput id="region" name="region" />
            </FormField>
            <FormField label="Code postal" htmlFor="postalCode">
              <TextInput id="postalCode" name="postalCode" />
            </FormField>
          </div>
          <FormField label="Instructions de livraison" htmlFor="note">
            <TextArea id="note" name="note" rows={2} />
          </FormField>
        </Card>

        <Card padding="md" className="space-y-3">
          <h2 className="text-base font-bold text-[color:var(--color-foreground)]">
            Moyen de paiement
          </h2>
          {state.fieldErrors?.paymentMethod ? (
            <p className="text-xs font-semibold text-rose-600">
              {state.fieldErrors.paymentMethod}
            </p>
          ) : null}
          <p className="text-xs leading-relaxed text-muted">
            Virement bancaire : contactez-nous sur WhatsApp avant d&apos;envoyer l&apos;argent.
            MonCash / NatCash : vous enverrez la preuve de paiement après validation de la commande.
          </p>
          <div className="space-y-2">
            {paymentMethods.map((method, index) => (
              <RadioField
                key={method.id}
                name="paymentMethod"
                value={method.id}
                defaultChecked={index === 0}
                required
                label={method.label}
                description={method.description}
                className="rounded-xl border-2 border-[color:var(--color-border)] p-4 transition has-[:checked]:border-[color:var(--accent)] has-[:checked]:bg-[color:var(--accent-soft)]"
              />
            ))}
          </div>
        </Card>
      </div>

      <Card tone="muted" padding="md" className="h-fit space-y-4">
        <p className="text-base font-bold text-[color:var(--color-foreground)]">Votre commande</p>

        <ul className="space-y-2 border-b border-[color:var(--color-border)] pb-3 text-sm">
          {items.map((item) => (
            <li key={item.lineId} className="flex justify-between gap-3">
              <span className="min-w-0 flex-1 truncate text-slate-600">
                {item.quantity} × {item.name}
              </span>
              <span className="shrink-0 font-bold text-[color:var(--color-foreground)]">
                <PriceDisplay
                  amount={item.unitPrice * item.quantity}
                  currency={item.currency}
                  layout="stack"
                />
              </span>
            </li>
          ))}
        </ul>

        <FormField label="Code de réduction" htmlFor="couponCode">
          <TextInput id="couponCode" name="couponCode" placeholder="Optionnel" />
        </FormField>

        <div className="flex justify-between border-t border-[color:var(--color-border)] pt-3 text-sm">
          <span className="text-slate-600">Sous-total estimé</span>
          <span className="font-black text-[color:var(--color-foreground)]">
            <PriceDisplay amount={totals.subtotal} currency={totals.currency} layout="stack" />
          </span>
        </div>

        <p className="text-xs leading-relaxed text-slate-500">
          Le total définitif est calculé par le serveur à la validation.
        </p>

        <SubmitButton />

        <TextLink href="/panier" variant="muted" className="block text-center text-xs">
          ← Revenir au panier
        </TextLink>
      </Card>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Validation en cours…" : "Valider la commande"}
    </Button>
  );
}
