import type { Metadata } from "next";
import { StudioTheme } from "@/components/theme/studio-theme";
import { Alert, PageTitle, SectionLabel } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TextLink } from "@/components/ui/link";
import { getServiceVisual, studioSteps } from "@/lib/theme/services";

export const metadata: Metadata = {
  title: "Demande envoyée",
  robots: { index: false },
};

export default async function ServiceRequestConfirmPage({
  searchParams,
}: PageProps<"/demande/confirmee">) {
  const params = await searchParams;
  const reference = typeof params.ref === "string" ? params.ref : null;
  const serviceSlug = typeof params.service === "string" ? params.service : null;
  const visual = serviceSlug ? getServiceVisual(serviceSlug) : null;

  return (
    <>
      <StudioTheme />
      <div className="page-container flex min-h-[70vh] max-w-2xl flex-col justify-center py-16">
        <Alert tone="success" className="mb-8">
          <p className="text-lg font-bold">Brief envoyé avec succès</p>
          {reference ? (
            <p className="mt-2 text-sm">
              Votre référence :{" "}
              <strong className="font-mono text-[color:var(--color-foreground)]">
                {reference}
              </strong>
            </p>
          ) : null}
        </Alert>

        <SectionLabel>Prochaines étapes</SectionLabel>
        <PageTitle
          title="Merci pour votre confiance"
          description="Notre équipe créative a reçu votre brief et vous recontacte rapidement par e-mail."
          className="mb-8"
        />

        <Card padding="md" className="mb-8 space-y-4">
          {visual ? (
            <div className="flex items-center gap-3 border-b border-[color:var(--color-border)] pb-4">
              <span
                className={`inline-flex size-11 items-center justify-center rounded-xl text-xl ${visual.chip}`}
                aria-hidden
              >
                {visual.icon}
              </span>
              <p className="text-sm text-slate-600">
                Demande enregistrée pour le service sélectionné.
              </p>
            </div>
          ) : null}

          <ol className="space-y-4">
            {studioSteps.slice(1).map((step) => (
              <li key={step.step} className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[color:var(--accent-soft)] text-xs font-black text-[color:var(--accent)]">
                  {step.step}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[color:var(--color-foreground)]">
                    {step.title}
                  </p>
                  <p className="text-xs text-slate-500">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/services" variant="primary">
            Retour aux services
          </ButtonLink>
          <ButtonLink href="/catalogue" variant="outline">
            Voir le catalogue
          </ButtonLink>
        </div>

        <p className="mt-8 text-sm text-slate-600">
          <TextLink href="/inscription">Créez un compte</TextLink> ou{" "}
          <TextLink href="/connexion">connectez-vous</TextLink> pour retrouver vos demandes
          dans votre espace client.
        </p>
      </div>
    </>
  );
}
