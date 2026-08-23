"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { DynamicField } from "@/features/fields/dynamic-field";
import { groupFields } from "@/features/fields/types";
import type { FieldDefinition } from "@/features/fields/types";
import { submitServiceBrief, type ServiceBriefState } from "@/features/services/actions";
import { FormField, TextInput } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TextLink } from "@/components/ui/link";

const initial: ServiceBriefState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Envoi du brief…" : "Envoyer ma demande"}
    </Button>
  );
}

export function ServiceBriefForm({
  serviceId,
  formId,
  serviceName,
  formName,
  formDescription,
  fields,
  defaults,
}: {
  serviceId: string;
  formId: string;
  serviceName: string;
  formName: string;
  formDescription: string | null;
  fields: FieldDefinition[];
  defaults: { name: string; email: string; phone: string };
}) {
  const [state, action] = useActionState(submitServiceBrief, initial);
  const groups = groupFields(fields);

  return (
    <Card tone="family" padding="lg" id="brief" className="scroll-mt-24">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[color:var(--color-foreground)]">{formName}</h2>
        {formDescription ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{formDescription}</p>
        ) : null}
      </div>

      <form action={action} className="space-y-8">
        <input type="hidden" name="serviceId" value={serviceId} />
        <input type="hidden" name="formId" value={formId} />
        <input type="hidden" name="serviceName" value={serviceName} />

        {state.status === "error" && state.message ? (
          <Alert tone="error">{state.message}</Alert>
        ) : null}

        <fieldset className="space-y-4">
          <legend className="mb-1 text-sm font-bold text-[color:var(--color-foreground)]">
            Comment vous joindre
          </legend>
          <p className="mb-3 text-xs text-slate-500">
            Ces coordonnées ne figurent pas dans le brief partagé avec l&apos;équipe créative
            sous le même format — elles servent uniquement à vous recontacter.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Nom complet"
              htmlFor="contact_name"
              required
              error={state.fieldErrors?.contact_name}
            >
              <TextInput
                id="contact_name"
                name="contact_name"
                required
                autoComplete="name"
                defaultValue={defaults.name}
              />
            </FormField>
            <FormField
              label="Téléphone"
              htmlFor="contact_phone"
              error={state.fieldErrors?.contact_phone}
            >
              <TextInput
                id="contact_phone"
                name="contact_phone"
                type="tel"
                autoComplete="tel"
                defaultValue={defaults.phone}
              />
            </FormField>
          </div>
          <FormField
            label="Adresse e-mail"
            htmlFor="contact_email"
            required
            error={state.fieldErrors?.contact_email}
          >
            <TextInput
              id="contact_email"
              name="contact_email"
              type="email"
              required
              autoComplete="email"
              defaultValue={defaults.email}
            />
          </FormField>
        </fieldset>

        {groups.map((group) => (
          <fieldset key={group.label} className="space-y-4">
            <legend className="mb-1 border-b border-[color:var(--color-border)] pb-2 text-sm font-bold text-[color:var(--color-foreground)]">
              {group.label}
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {group.fields.map((field) => (
                <DynamicField
                  key={field.key}
                  field={field}
                  prefix="attr"
                  error={state.fieldErrors?.[field.key]}
                />
              ))}
            </div>
          </fieldset>
        ))}

        <div className="space-y-4 border-t border-[color:var(--color-border)] pt-6">
          <SubmitButton />
          <p className="text-center text-xs text-slate-500">
            En envoyant ce brief, vous acceptez d&apos;être recontacté au sujet de votre projet.
            {!defaults.email ? (
              <>
                {" "}
                <TextLink href="/connexion?next=/services">Connectez-vous</TextLink> pour suivre
                vos demandes dans votre compte.
              </>
            ) : null}
          </p>
        </div>
      </form>
    </Card>
  );
}
