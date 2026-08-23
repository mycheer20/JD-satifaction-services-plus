import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceRequest } from "@/features/services/queries";
import { SERVICE_STATUS_LABELS } from "@/features/orders/queries";
import { StudioTheme } from "@/components/theme/studio-theme";
import { Alert, Badge, PageTitle, SectionLabel } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { TextLink } from "@/components/ui/link";
import { PriceDisplay } from "@/components/storefront/price-display";
import { formatDate } from "@/lib/utils";
import { getServiceVisual } from "@/lib/theme/services";

export const metadata: Metadata = {
  title: "Ma demande de design",
  robots: { index: false },
};

export default async function ServiceRequestPage({
  params,
  searchParams,
}: PageProps<"/demande/[id]">) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const request = await getServiceRequest(id);
  if (!request) notFound();

  const isNew = query.nouvelle === "1";
  const service = request.service;
  const visual = getServiceVisual(service?.slug ?? "");
  const answers = (request.answers ?? {}) as Record<string, unknown>;

  const answerEntries = Object.entries(answers).filter(
    ([, value]) => value !== null && value !== "" && !(Array.isArray(value) && value.length === 0),
  );

  return (
    <>
      <StudioTheme />
      <div className="page-container max-w-3xl py-10">
        {isNew ? (
          <Alert tone="success" className="mb-8">
            <p className="font-semibold">Votre brief a bien été reçu.</p>
            <p className="mt-1 text-sm opacity-90">
              Notre équipe créative analyse votre demande et vous recontacte sous peu.
            </p>
          </Alert>
        ) : null}

        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <SectionLabel>Demande design</SectionLabel>
            <PageTitle
              title={request.reference}
              description={
                service
                  ? `${service.name} · envoyée le ${formatDate(request.created_at)}`
                  : formatDate(request.created_at)
              }
              className="mb-0"
            />
          </div>
          <Badge tone="info">
            {SERVICE_STATUS_LABELS[request.status] ?? request.status}
          </Badge>
        </header>

        <Card padding="md" className="mb-6">
          <div className="flex items-start gap-4">
            <span
              className={`inline-flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl ${visual.chip}`}
              aria-hidden
            >
              {visual.icon}
            </span>
            <div>
              <h2 className="text-base font-bold text-[color:var(--color-foreground)]">
                {service?.name ?? "Service design"}
              </h2>
              {service?.tagline ? (
                <p className="mt-1 text-sm text-slate-600">{service.tagline}</p>
              ) : null}
              {request.quoted_amount != null ? (
                <p className="mt-3 text-sm font-bold text-[color:var(--accent)]">
                  Devis :{" "}
                  <PriceDisplay
                    amount={request.quoted_amount}
                    currency={request.currency}
                  />
                </p>
              ) : null}
            </div>
          </div>
        </Card>

        <div className="mb-6 grid gap-6 sm:grid-cols-2">
          <Card padding="md">
            <CardHeader title="Contact" className="mb-3" />
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-slate-500">Nom</dt>
                <dd className="font-medium text-[color:var(--color-foreground)]">
                  {request.contact_name}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">E-mail</dt>
                <dd className="font-medium text-[color:var(--color-foreground)]">
                  {request.contact_email}
                </dd>
              </div>
              {request.contact_phone ? (
                <div>
                  <dt className="text-slate-500">Téléphone</dt>
                  <dd className="font-medium text-[color:var(--color-foreground)]">
                    {request.contact_phone}
                  </dd>
                </div>
              ) : null}
            </dl>
          </Card>

          <Card padding="md">
            <CardHeader title="Suivi" className="mb-3" />
            <p className="text-sm leading-relaxed text-slate-600">
              Vous recevrez un e-mail dès que votre demande sera analysée. Les fichiers
              joints sont conservés de manière sécurisée et accessibles à notre équipe.
            </p>
          </Card>
        </div>

        {answerEntries.length > 0 ? (
          <Card padding="none" className="mb-8 overflow-hidden">
            <CardHeader
              title="Résumé du brief"
              className="border-b border-[color:var(--color-border)] px-5 py-4"
            />
            <dl className="divide-y divide-[color:var(--color-border)]">
              {answerEntries.map(([key, value]) => (
                <div key={key} className="grid gap-1 px-5 py-4 sm:grid-cols-[10rem_1fr]">
                  <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    {key.replace(/_/g, " ")}
                  </dt>
                  <dd className="text-sm text-[color:var(--color-foreground)]">
                    {Array.isArray(value) ? value.join(", ") : String(value)}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        ) : null}

        <div className="flex flex-wrap items-center gap-4 border-t border-[color:var(--color-border)] pt-8">
          <ButtonLink href="/services" variant="primary">
            Autres services
          </ButtonLink>
          <TextLink href="/compte/demandes" variant="muted">
            Toutes mes demandes →
          </TextLink>
        </div>
      </div>
    </>
  );
}
