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
import { SectionLabel, Skeleton } from "@/components/ui/badge";
import { publicEnv } from "@/lib/public-env";

export default function HomePage() {
  return (
    <div className="section-stack page-container">
      {homeSections.map((section, index) => (
        <Suspense key={`${section.kind}-${index}`} fallback={<SectionSkeleton />}>
          <HomeSectionBlock section={section} />
        </Suspense>
      ))}
    </div>
  );
}

async function HomeSectionBlock({ section }: { section: HomeSection }) {
  switch (section.kind) {
    case "hero":
      return <Hero />;

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

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl hero-brand px-6 py-16 text-white shadow-xl sm:px-12 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_50%)]" />
      <div className="absolute -right-20 -top-20 size-80 rounded-full bg-[color:var(--accent)]/20 blur-3xl" />
      <div className="relative max-w-2xl">
        <SectionLabel>
          <span className="text-white/70">{publicEnv.storeName}</span>
        </SectionLabel>
        <h1 className="mt-4 text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          Sept univers.
          <br />
          <span className="text-[color:var(--accent)]">Un seul magasin.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
          Informatique, fournitures scolaires, gaming, bureau, maison, cosmétiques et
          sport. Et lorsque vous avez besoin d&apos;un visuel, notre studio de design
          prend le relais.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/catalogue" size="lg" variant="primary">
            Explorer le catalogue
          </ButtonLink>
          <ButtonLink
            href="/services"
            size="lg"
            variant="outline"
            className="border-white/30 bg-white/10 text-white hover:border-white/50 hover:bg-white/20"
          >
            Services de design
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

async function FamiliesGrid() {
  const families = await getFamilyTree();

  return (
    <section className="space-y-6">
      <CardHeader
        title="Parcourir par famille"
        description={`${families.length} univers, ${families.reduce((n, f) => n + f.categories.length, 0)} catégories — chacun avec son ambiance visuelle.`}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {families.map((family) => (
          <FamilyCard key={family.id} family={family} />
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
