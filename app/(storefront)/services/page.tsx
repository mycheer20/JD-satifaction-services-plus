import type { Metadata } from "next";
import { listServices } from "@/features/services/queries";
import { StudioTheme } from "@/components/theme/studio-theme";
import { ServiceCard } from "@/components/storefront/service-card";
import { BreadcrumbsWithCurrent } from "@/components/ui/breadcrumbs";
import { SectionLabel } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { publicEnv } from "@/lib/public-env";
import { studioSteps } from "@/lib/theme/services";

export const metadata: Metadata = {
  title: "Services de design",
  description:
    "Logo, flyer, affiche, carte de visite, menu, packaging et retouche photo — brief en ligne, création sur mesure.",
};

export default async function ServicesPage() {
  const services = await listServices();
  const featured = services.filter((s) => s.is_featured);
  const others = services.filter((s) => !s.is_featured);

  return (
    <>
      <StudioTheme />
      <div className="page-container pb-16">
        <BreadcrumbsWithCurrent
          items={[]}
          current="Services de design"
          className="mb-0 py-6"
        />

        <section className="relative overflow-hidden rounded-3xl hero-brand hero-grid-design px-6 py-14 text-white shadow-xl sm:px-12 sm:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.1),transparent_55%)]" />
          <div className="relative max-w-2xl">
            <SectionLabel>
              <span className="text-white/70">Studio {publicEnv.storeName}</span>
            </SectionLabel>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Design sur mesure,
              <br />
              <span className="text-indigo-300">brief en ligne.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              Logo, print, packaging ou retouche photo — décrivez votre projet via un
              questionnaire adapté à chaque prestation. Notre équipe créative vous
              recontacte avec un devis personnalisé.
            </p>
            <div className="mt-8">
              <ButtonLink
                href="#catalogue-services"
                size="lg"
                variant="primary"
                className="bg-white text-indigo-900 hover:bg-indigo-50"
              >
                Choisir un service
              </ButtonLink>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          {studioSteps.map((step) => (
            <Card key={step.step} padding="md" tone="elevated">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-[color:var(--accent-soft)] text-sm font-black text-[color:var(--accent)]">
                {step.step}
              </span>
              <h2 className="mt-3 text-sm font-bold text-[color:var(--color-foreground)]">
                {step.title}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{step.description}</p>
            </Card>
          ))}
        </section>

        <section id="catalogue-services" className="mt-16 scroll-mt-24 space-y-10">
          {featured.length > 0 ? (
            <div className="space-y-6">
              <CardHeader
                title="Services phares"
                description="Les prestations les plus demandées pour lancer ou renforcer votre image."
              />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((service) => (
                  <ServiceCard
                    key={service.id}
                    slug={service.slug}
                    name={service.name}
                    tagline={service.tagline}
                    description={service.description}
                    deliveryTime={service.delivery_time}
                    basePrice={service.base_price}
                    priceNote={service.price_note}
                    currency={service.currency}
                    featured
                  />
                ))}
              </div>
            </div>
          ) : null}

          {others.length > 0 ? (
            <div className="space-y-6">
              <CardHeader
                title={featured.length > 0 ? "Toutes nos prestations" : "Nos prestations"}
                description={`${services.length} services créatifs disponibles.`}
              />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {others.map((service) => (
                  <ServiceCard
                    key={service.id}
                    slug={service.slug}
                    name={service.name}
                    tagline={service.tagline}
                    description={service.description}
                    deliveryTime={service.delivery_time}
                    basePrice={service.base_price}
                    priceNote={service.price_note}
                    currency={service.currency}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </>
  );
}
