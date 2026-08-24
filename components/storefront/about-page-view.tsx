import Image from "next/image";
import Link from "next/link";
import { getPublishedAboutPageData } from "@/features/design/queries";
import { storeContact, storePhoneHref, storeWhatsAppHref } from "@/lib/store/contact";
import { familyVisuals } from "@/lib/theme/families";
import { PlacementImage } from "@/components/storefront/placement-image";
import { BreadcrumbsWithCurrent } from "@/components/ui/breadcrumbs";
import { SectionLabel } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import type { AboutHighlightItem, ResolvedAboutSection, ResolvedGalleryItem } from "@/types/design";

function sectionMap(sections: ResolvedAboutSection[]) {
  return new Map(sections.map((section) => [section.id, section]));
}

function BodyText({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
      {text.split("\n\n").map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}

function HighlightGrid({ items }: { items?: AboutHighlightItem[] }) {
  if (!items?.length) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <Card key={item.title} padding="md" tone="elevated" className="h-full">
          {item.icon ? (
            <span className="text-2xl" aria-hidden>
              {item.icon}
            </span>
          ) : null}
          <h3 className="mt-3 text-sm font-bold text-[color:var(--color-foreground)]">
            {item.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
        </Card>
      ))}
    </div>
  );
}

function AboutGallery({ items }: { items: ResolvedGalleryItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-6">
      <CardHeader
        title="Galerie"
        description="Quelques images de notre entreprise, de la boutique et de nos activités."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <figure
            key={item.id}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]"
          >
            <Image
              src={item.publicUrl}
              alt={item.altText}
              fill
              sizes="(max-width:640px) 100vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
              unoptimized={item.publicUrl.endsWith(".gif")}
            />
            {item.title ? (
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-sm font-semibold text-white">
                {item.title}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  );
}

export async function AboutPageView() {
  const { sections, gallery } = await getPublishedAboutPageData();
  const map = sectionMap(sections);
  const hero = map.get("hero")!;
  const presentation = map.get("presentation")!;
  const history = map.get("history")!;
  const mission = map.get("mission")!;
  const values = map.get("values")!;
  const activities = map.get("activities")!;
  const whyUs = map.get("why-us")!;
  const presence = map.get("presence")!;
  const cta = map.get("cta")!;

  return (
    <div className="page-container pb-16">
      <BreadcrumbsWithCurrent items={[]} current="À propos" className="mb-0 py-6" />

      <section className="relative overflow-hidden rounded-3xl hero-brand px-6 py-16 text-white shadow-xl sm:px-12 sm:py-24">
        {hero.imageUrl ? (
          <PlacementImage
            imageUrl={hero.imageUrl}
            altText={hero.altText}
            overlayOpacity={hero.overlayOpacity}
            imagePosition={hero.imagePosition}
            className="absolute inset-0"
            priority
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_50%)]" />
            <div className="absolute -right-20 -top-20 size-80 rounded-full bg-[color:var(--accent)]/20 blur-3xl" />
          </>
        )}
        <div className="relative max-w-3xl">
          <SectionLabel>
            <span className="text-white/70">Institutionnel</span>
          </SectionLabel>
          <h1 className="mt-4 text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
          {hero.subtitle ? (
            <p className="mt-4 text-lg font-semibold text-white/85 sm:text-xl">{hero.subtitle}</p>
          ) : null}
          {hero.body ? <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80">{hero.body}</p> : null}
        </div>
      </section>

      <div className="section-stack mt-16">
        <SplitSection section={presentation} imagePosition="right" />
        <SplitSection section={history} imagePosition="left" />
        <SplitSection section={mission} imagePosition="right" />

        <section className="space-y-6">
          <CardHeader title={values.title} />
          <HighlightGrid items={values.items} />
        </section>

        <SplitSection section={activities} imagePosition="left">
          <div className="mt-6 flex flex-wrap gap-2">
            {Object.values(familyVisuals).map((family) => (
              <span
                key={family.slug}
                className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-surface-muted)] px-3 py-1.5 text-xs font-semibold text-[color:var(--color-foreground)]"
              >
                <span aria-hidden>{family.icon}</span>
                {family.tagline}
              </span>
            ))}
          </div>
        </SplitSection>

        <section className="space-y-6">
          <CardHeader title={whyUs.title} />
          <HighlightGrid items={whyUs.items} />
        </section>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-start">
          <div className="space-y-4">
            <CardHeader title={presence.title} />
            <BodyText text={presence.body} />
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-5 text-sm">
              <p className="font-bold text-[color:var(--color-foreground)]">{storeContact.pickup.label}</p>
              <p className="mt-2 text-slate-600">{storeContact.pickup.addressLine1}</p>
              {storeContact.pickup.city ? (
                <p className="text-slate-600">{storeContact.pickup.city}</p>
              ) : null}
              <p className="mt-3 font-semibold text-[color:var(--color-foreground)]">{storeContact.phone}</p>
              <p className="mt-1 text-slate-600">{storeContact.pickup.hours}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={storePhoneHref()} className="text-sm font-semibold text-[color:var(--accent)] hover:underline">
                  Appeler
                </Link>
                <Link
                  href={storeWhatsAppHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[color:var(--accent)] hover:underline"
                >
                  WhatsApp
                </Link>
                <Link
                  href={storeContact.pickup.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[color:var(--accent)] hover:underline"
                >
                  Voir sur la carte
                </Link>
              </div>
            </div>
          </div>
          {presence.imageUrl ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[color:var(--color-border)]">
              <PlacementImage
                imageUrl={presence.imageUrl}
                altText={presence.altText}
                overlayOpacity={presence.overlayOpacity}
                imagePosition={presence.imagePosition}
                className="absolute inset-0"
                sizes="(max-width:1024px) 100vw, 360px"
              />
            </div>
          ) : null}
        </section>

        <AboutGallery items={gallery} />

        <section className="relative overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-6 py-12 shadow-md sm:px-10">
          {cta.imageUrl ? (
            <PlacementImage
              imageUrl={cta.imageUrl}
              altText={cta.altText}
              overlayOpacity={cta.overlayOpacity}
              imagePosition={cta.imagePosition}
              className="absolute inset-0"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 hero-brand opacity-95" aria-hidden />
          )}
          <div className="relative max-w-2xl text-white">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{cta.title}</h2>
            {cta.subtitle ? <p className="mt-3 text-lg text-white/85">{cta.subtitle}</p> : null}
            {cta.body ? <p className="mt-3 text-sm text-white/75 sm:text-base">{cta.body}</p> : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/catalogue" size="lg" variant="primary" className="bg-white text-slate-900 hover:bg-slate-100">
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
      </div>
    </div>
  );
}

function SplitSection({
  section,
  imagePosition,
  children,
}: {
  section: ResolvedAboutSection;
  imagePosition: "left" | "right";
  children?: React.ReactNode;
}) {
  const content = (
    <div className="space-y-4">
      <CardHeader title={section.title} />
      <BodyText text={section.body} />
      {children}
    </div>
  );

  if (!section.imageUrl) {
    return <section className="space-y-4">{content}</section>;
  }

  const imageBlock = (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[color:var(--color-border)]">
      <PlacementImage
        imageUrl={section.imageUrl}
        altText={section.altText}
        overlayOpacity={section.overlayOpacity}
        imagePosition={section.imagePosition}
        className="absolute inset-0"
        sizes="(max-width:1024px) 100vw, 480px"
      />
    </div>
  );

  return (
    <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
      {imagePosition === "left" ? imageBlock : content}
      {imagePosition === "left" ? content : imageBlock}
    </section>
  );
}
