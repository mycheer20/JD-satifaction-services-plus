import { Suspense } from "react";
import {
  getFamilyHighlights,
  getFamilyTree,
  getFeaturedProducts,
  getNewArrivals,
  getPromotions,
} from "@/features/catalog/queries";
import { listServices } from "@/features/services/queries";
import { homeSections, type HomeSection } from "@/features/home/sections";
import { ProductRail } from "@/components/storefront/product-card";
import { ServiceCard } from "@/components/storefront/service-card";
import { FamilyCard } from "@/components/theme/family-card";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/badge";
import { StorefrontHomeHero } from "@/components/storefront/home-hero";
import { MotionReveal } from "@/components/storefront/motion-reveal";
import { getPublishedFamilyCovers } from "@/features/design/queries";

export default function HomePage() {
  return (
    <div className="section-stack page-container">
      {homeSections.map((section, index) => (
        <Suspense key={`${section.kind}-${index}`} fallback={<SectionSkeleton />}>
          {section.kind === "hero" ? (
            <HomeSectionBlock section={section} />
          ) : (
            <MotionReveal delayMs={Math.min(index * 60, 240)}>
              <HomeSectionBlock section={section} />
            </MotionReveal>
          )}
        </Suspense>
      ))}
    </div>
  );
}

async function HomeSectionBlock({ section }: { section: HomeSection }) {
  switch (section.kind) {
    case "hero":
      return <StorefrontHomeHero />;

    case "families":
      return <FamiliesGrid />;

    case "featured":
      return (
        <ProductRail
          title={section.title}
          description={section.description}
          href="/catalogue?vedette=1"
          products={await getFeaturedProducts()}
        />
      );

    case "promotions":
      return (
        <ProductRail
          title={section.title}
          description={section.description}
          href="/catalogue?promo=1"
          products={await getPromotions()}
        />
      );

    case "new":
      return (
        <ProductRail
          title={section.title}
          description={section.description}
          href="/catalogue?tri=newest"
          products={await getNewArrivals()}
        />
      );

    case "family":
      return (
        <ProductRail
          title={section.title}
          description={section.description}
          href={`/famille/${section.family}`}
          products={await getFamilyHighlights(section.family)}
        />
      );

    case "services":
      return <ServicesBlock title={section.title} description={section.description} />;
  }
}

async function FamiliesGrid() {
  const [families, covers] = await Promise.all([
    getFamilyTree(),
    getPublishedFamilyCovers(),
  ]);

  return (
    <section className="space-y-6">
      <CardHeader
        title="Parcourir par famille"
        description={`${families.length} univers, ${families.reduce((n, f) => n + f.categories.length, 0)} catégories — chacun avec son ambiance visuelle.`}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {families.map((family) => (
          <FamilyCard key={family.id} family={family} cover={covers.get(family.slug) ?? null} />
        ))}
      </div>
    </section>
  );
}

async function ServicesBlock({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  const services = await listServices();
  if (services.length === 0) return null;

  return (
    <Card tone="muted" padding="lg" className="space-y-6">
      <CardHeader
        title={title}
        description={description}
        action={
          <ButtonLink href="/services" variant="primary" size="sm">
            Tous les services
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.slice(0, 6).map((service) => (
          <ServiceCard
            key={service.id}
            slug={service.slug}
            name={service.name}
            tagline={service.tagline}
            deliveryTime={service.delivery_time}
            basePrice={service.base_price}
            priceNote={service.price_note}
            currency={service.currency}
            featured={service.is_featured}
            variant="compact"
          />
        ))}
      </div>
    </Card>
  );
}

function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-7 w-56" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-72" />
        ))}
      </div>
    </div>
  );
}
