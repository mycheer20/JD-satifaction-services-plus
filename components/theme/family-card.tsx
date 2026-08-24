import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import type { FamilyNode } from "@/features/catalog/types";
import type { ResolvedPlacementMedia } from "@/types/design";
import { getFamilyVisual, isFamilySlug, isLightFamily } from "@/lib/theme/families";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function FamilyCard({
  family,
  cover,
}: {
  family: FamilyNode;
  cover?: ResolvedPlacementMedia | null;
}) {
  const visual = isFamilySlug(family.slug) ? getFamilyVisual(family.slug) : null;
  const isLight = isLightFamily(family.slug);
  const imageConfig = cover?.config;
  const hoverScale =
    imageConfig && "hoverScale" in imageConfig ? (imageConfig.hoverScale ?? 1.03) : 1.03;
  const enableHover =
    imageConfig && "enableHover" in imageConfig ? imageConfig.enableHover !== false : true;

  return (
    <Link
      href={`/famille/${family.slug}`}
      className="motion-family-card group relative flex min-h-[11rem] flex-col overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-sm"
    >
      <div
        className={cn(
          "relative h-28 overflow-hidden",
          !cover?.imageUrl && (visual?.gradient ?? "hero-brand"),
        )}
        style={
          enableHover
            ? ({ "--family-hover-scale": hoverScale } as CSSProperties)
            : undefined
        }
      >
        {cover?.imageUrl ? (
          <>
            <Image
              src={cover.imageUrl}
              alt={cover.altText ?? family.name}
              fill
              sizes="(max-width:640px) 50vw, 25vw"
              className={cn(
                "object-cover",
                enableHover && "motion-family-image group-hover:scale-105",
              )}
              style={{ objectPosition: cover.imagePosition ?? "center" }}
              unoptimized={cover.imageUrl.endsWith(".gif")}
            />
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: cover.overlayOpacity ?? 0.4 }}
              aria-hidden
            />
          </>
        ) : (
          <>
            {family.slug === "informatique" ? (
              <div className="absolute inset-0 hero-grid-tech opacity-80" />
            ) : null}
            {family.slug === "gaming" ? (
              <div className="absolute inset-0 hero-glow-gaming" />
            ) : null}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t to-transparent",
                isLight ? "from-black/15" : "from-black/40",
              )}
            />
          </>
        )}
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            {visual?.icon ?? "🛍️"}
          </span>
          {visual ? (
            <Badge
              tone="neutral"
              className={cn(
                "backdrop-blur-sm",
                isLight ? "bg-white/90 text-slate-800" : "bg-black/30 text-white ring-white/20",
              )}
            >
              {visual.tagline}
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-[color:var(--color-foreground)] transition group-hover:text-[color:var(--accent)]">
          {family.name}
        </h3>
        {family.description ? (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-600">
            {family.description}
          </p>
        ) : null}
        <p className="mt-auto pt-4 text-xs font-semibold text-[color:var(--accent)]">
          {family.categories.length} catégories →
        </p>
      </div>
    </Link>
  );
}
