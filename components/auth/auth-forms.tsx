"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  requestPasswordReset,
  signIn,
  signUp,
  updateProfile,
  type AuthState,
} from "@/features/auth/actions";
import { FormField, TextInput } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TextLink } from "@/components/ui/link";

const initial: AuthState = { status: "idle" };

function Feedback({ state }: { state: AuthState }) {
  if (state.status === "idle" || !state.message) return null;
  return (
    <Alert tone={state.status === "error" ? "error" : "success"}>{state.message}</Alert>
  );
}

function Submit({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  );
}

export function SignInForm({ next }: { next?: string }) {
  const [state, action] = useActionState(signIn, initial);

  return (
    <Card padding="lg" className="space-y-5">
      <form action={action} className="space-y-4">
        <input type="hidden" name="next" value={next ?? ""} />
        <Feedback state={state} />

        <FormField label="Adresse e-mail" htmlFor="email" required>
          <TextInput id="email" name="email" type="email" required autoComplete="email" />
        </FormField>

        <FormField label="Mot de passe" htmlFor="password" required>
          <TextInput
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </FormField>

        <Submit label="Se connecter" pendingLabel="Connexion…" />

        <div className="flex justify-between pt-1 text-xs">
          <TextLink href="/mot-de-passe-oublie" variant="muted">
            Mot de passe oublié
          </TextLink>
          <TextLink href="/inscription" variant="default">
            Créer un compte
          </TextLink>
        </div>
      </form>
    </Card>
  );
}

export function SignUpForm() {
  const [state, action] = useActionState(signUp, initial);

  return (
    <Card padding="lg" className="space-y-5">
      <form action={action} className="space-y-4">
        <Feedback state={state} />

        <FormField label="Nom complet" htmlFor="fullName" required>
          <TextInput id="fullName" name="fullName" required autoComplete="name" />
        </FormField>

        <FormField label="Adresse e-mail" htmlFor="email" required>
          <TextInput id="email" name="email" type="email" required autoComplete="email" />
        </FormField>

        <FormField label="Téléphone" htmlFor="phone">
          <TextInput id="phone" name="phone" type="tel" autoComplete="tel" />
        </FormField>

        <FormField label="Mot de passe" htmlFor="password" required hint="8 caractères minimum">
          <TextInput
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </FormField>

        <Submit label="Créer mon compte" pendingLabel="Création…" />

        <p className="text-center text-xs text-slate-500">
          Déjà inscrit ?{" "}
          <TextLink href="/connexion" variant="default">
            Se connecter
          </TextLink>
        </p>
      </form>
    </Card>
  );
}

export function PasswordResetForm() {
  const [state, action] = useActionState(requestPasswordReset, initial);

  return (
    <Card padding="lg" className="space-y-5">
      <form action={action} className="space-y-4">
        <Feedback state={state} />

        <FormField
          label="Adresse e-mail"
          htmlFor="email"
          required
          hint="Nous vous enverrons un lien de réinitialisation."
        >
          <TextInput id="email" name="email" type="email" required autoComplete="email" />
        </FormField>

        <Submit label="Envoyer le lien" pendingLabel="Envoi…" />

        <TextLink href="/connexion" variant="muted" className="text-xs">
          ← Retour à la connexion
        </TextLink>
      </form>
    </Card>
  );
}

export function ProfileForm({
  defaults,
}: {
  defaults: {
    fullName: string;
    phone: string;
    addressLine1?: string;
    city?: string;
    region?: string;
    postalCode?: string;
  };
}) {
  const [state, action] = useActionState(updateProfile, initial);

  return (
    <Card padding="lg" className="space-y-5">
      <form action={action} className="space-y-4">
        <Feedback state={state} />

        <FormField label="Nom complet" htmlFor="fullName">
          <TextInput
            id="fullName"
            name="fullName"
            defaultValue={defaults.fullName}
            autoComplete="name"
          />
        </FormField>

        <FormField label="Téléphone" htmlFor="phone">
          <TextInput
            id="phone"
            name="phone"
            type="tel"
            defaultValue={defaults.phone}
            autoComplete="tel"
          />
        </FormField>

        <FormField label="Adresse" htmlFor="addressLine1">
          <TextInput
            id="addressLine1"
            name="addressLine1"
            defaultValue={defaults.addressLine1 ?? ""}
            autoComplete="street-address"
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Ville" htmlFor="city">
            <TextInput
              id="city"
              name="city"
              defaultValue={defaults.city ?? ""}
              autoComplete="address-level2"
            />
          </FormField>
          <FormField label="Code postal" htmlFor="postalCode">
            <TextInput
              id="postalCode"
              name="postalCode"
              defaultValue={defaults.postalCode ?? ""}
              autoComplete="postal-code"
            />
          </FormField>
        </div>

        <FormField label="Région / province" htmlFor="region">
          <TextInput
            id="region"
            name="region"
            defaultValue={defaults.region ?? ""}
            autoComplete="address-level1"
          />
        </FormField>

        <Submit label="Enregistrer" pendingLabel="Enregistrement…" />
      </form>
    </Card>
  );
}
