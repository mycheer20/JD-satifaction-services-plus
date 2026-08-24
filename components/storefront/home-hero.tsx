import { ConfigurableHero } from "@/components/design/configurable-hero";
import { resolvePlacementMedia } from "@/features/design/queries";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/badge";
import { publicEnv } from "@/lib/public-env";

export async function StorefrontHomeHero() {
  const media = await resolvePlacementMedia("home.hero");

  const content = <HomeHeroContent />;

  if (!media) {
    return (
      <section className="relative overflow-hidden rounded-3xl hero-brand px-6 py-16 text-white shadow-xl sm:px-12 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_50%)]" />
        <div className="absolute -right-20 -top-20 size-80 rounded-full bg-[color:var(--accent)]/20 blur-3xl" />
        {content}
      </section>
    );
  }

  return <ConfigurableHero media={media}>{content}</ConfigurableHero>;
}

function HomeHeroContent() {
  return (
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
        Informatique, fournitures scolaires, gaming, bureau, maison, cosmétiques et sport. Et
        lorsque vous avez besoin d&apos;un visuel, notre studio de design prend le relais.
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
  );
}
