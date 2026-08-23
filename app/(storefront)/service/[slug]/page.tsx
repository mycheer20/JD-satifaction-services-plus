import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getServiceBySlug,
  listServiceSlugsForBuild,
  listServices,
} from "@/features/services/queries";
import { getSessionUser } from "@/features/auth/session";
import { StudioTheme } from "@/components/theme/studio-theme";
import { ServiceBriefForm } from "@/components/storefront/service-brief-form";
import { ServiceCard } from "@/components/storefront/service-card";
import { BreadcrumbsWithCurrent } from "@/components/ui/breadcrumbs";
import { Badge, SectionLabel } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriceDisplay } from "@/components/storefront/price-display";
import { ExchangeRateBar } from "@/components/storefront/exchange-rate-bar";
import { getServiceVisual, studioSteps } from "@/lib/theme/services";

export async function generateStaticParams() {
  const slugs = await listServiceSlugsForBuild();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/service/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.seoTitle ?? service.name,
    description: service.seoDescription ?? service.tagline ?? service.description ?? undefined,
  };
}

export default async function ServicePage({ params }: PageProps<"/service/[slug]">) {
  const { slug } = await params;
  const [service, user, allServices] = await Promise.all([
    getServiceBySlug(slug),
    getSessionUser(),
    listServices(),
  ]);

  if (!service) notFound();

  const visual = getServiceVisual(service.slug);
  const related = allServices.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <StudioTheme />
      <div className="page-container pb-16">
        <BreadcrumbsWithCurrent
          items={[{ href: "/services", label: "Services de design" }]}
          current={service.name}
          className="mb-0 py-6"
        />

        <ExchangeRateBar className="mb-8 rounded-xl border" />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
          <div className="space-y-8 lg:sticky lg:top-28">
            <header>
              <div className="flex flex-wrap items-start gap-4">
                <span
                  className={`inline-flex size-16 items-center justify-center rounded-2xl text-3xl shadow-md ${visual.chip}`}
                  aria-hidden
                >
                  {visual.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <SectionLabel>{visual.keyword}</SectionLabel>
                  <h1 className="mt-1 text-3xl font-black tracking-tight text-[color:var(--color-foreground)] sm:text-4xl">
                    {service.name}
                  </h1>
                  {service.tagline ? (
                    <p className="mt-2 text-base text-slate-600">{service.tagline}</p>
                  ) : null}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {service.deliveryTime ? (
                  <Badge tone="info">Délai indicatif : {service.deliveryTime}</Badge>
                ) : null}
                <Badge tone="neutral">
                  {service.basePrice != null ? (
                    <>
                      À partir de{" "}
                      <PriceDisplay amount={service.basePrice} currency={service.currency} />
                    </>
                  ) : (
                    (service.priceNote ?? "Tarif sur devis")
                  )}
                </Badge>
              </div>
            </header>

            {service.description ? (
              <Card padding="md">
                <h2 className="text-sm font-bold text-[color:var(--color-foreground)]">
                  Ce que nous créons pour vous
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {service.description}
                </p>
              </Card>
            ) : null}

            <Card padding="md" tone="muted">
              <h2 className="text-sm font-bold text-[color:var(--color-foreground)]">
                Comment ça marche
              </h2>
              <ol className="mt-4 space-y-4">
                {studioSteps.map((step) => (
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
              <ButtonLink href="#brief" variant="soft" size="sm" className="mt-5">
                Remplir le brief →
              </ButtonLink>
            </Card>

            {related.length > 0 ? (
              <div className="hidden space-y-4 lg:block">
                <h2 className="text-sm font-bold text-[color:var(--color-foreground)]">
                  Autres services
                </h2>
                <div className="grid gap-3">
                  {related.map((item) => (
                    <ServiceCard
                      key={item.id}
                      slug={item.slug}
                      name={item.name}
                      tagline={item.tagline}
                      deliveryTime={item.delivery_time}
                      basePrice={item.base_price}
                      priceNote={item.price_note}
                      currency={item.currency}
                      variant="compact"
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div>
            {service.form && service.fields.length > 0 ? (
              <ServiceBriefForm
                serviceId={service.id}
                formId={service.form.id}
                serviceName={service.name}
                formName={service.form.name}
                formDescription={service.form.description}
                fields={service.fields}
                defaults={{
                  name: user?.fullName ?? "",
                  email: user?.email ?? "",
                  phone: user?.phone ?? "",
                }}
              />
            ) : (
              <Card padding="lg" tone="family">
                <p className="text-sm text-slate-600">
                  Le formulaire de brief pour ce service est en cours de préparation.
                  Contactez-nous directement pour votre projet.
                </p>
                <ButtonLink href="/services" variant="primary" className="mt-4">
                  Retour aux services
                </ButtonLink>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
