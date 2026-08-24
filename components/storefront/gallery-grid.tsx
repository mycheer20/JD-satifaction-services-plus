"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { DesignGalleryCategoryId } from "@/lib/design/placements";
import { galleryCategoryLabel } from "@/lib/design/gallery-utils";
import type { ResolvedGalleryItem } from "@/types/design";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type GalleryGridProps = {
  items: ResolvedGalleryItem[];
  /** Limite d'affichage (aperçu sur À propos). */
  limit?: number;
  className?: string;
};

export function GalleryGrid({ items, limit, className }: GalleryGridProps) {
  const visibleItems = useMemo(
    () => (limit ? items.slice(0, limit) : items),
    [items, limit],
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setActiveIndex(null), []);
  const showPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || visibleItems.length === 0) return current;
      return current === 0 ? visibleItems.length - 1 : current - 1;
    });
  }, [visibleItems.length]);
  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || visibleItems.length === 0) return current;
      return current === visibleItems.length - 1 ? 0 : current + 1;
    });
  }, [visibleItems.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, closeLightbox, showNext, showPrevious]);

  if (visibleItems.length === 0) return null;

  const activeItem = activeIndex !== null ? visibleItems[activeIndex] : null;

  return (
    <>
      <div
        className={cn(
          "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
          className,
        )}
      >
        {visibleItems.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] text-left transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring-color)]"
          >
            <Image
              src={item.publicUrl}
              alt={item.altText}
              fill
              sizes="(max-width:640px) 100vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              unoptimized={item.publicUrl.endsWith(".gif")}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral" className="bg-white/90 text-slate-800">
                  {galleryCategoryLabel(item.category)}
                </Badge>
              </div>
              {item.title ? (
                <p className="mt-2 text-sm font-semibold text-white">{item.title}</p>
              ) : null}
            </div>
          </button>
        ))}
      </div>

      {activeItem ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title ?? activeItem.altText}
          onClick={closeLightbox}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[16/10] max-h-[75vh] w-full">
              <Image
                src={activeItem.publicUrl}
                alt={activeItem.altText}
                fill
                sizes="100vw"
                className="object-contain"
                unoptimized={activeItem.publicUrl.endsWith(".gif")}
                priority
              />
            </div>
            <div className="space-y-2 border-t border-white/10 bg-[color:var(--color-brand-900)] p-5 text-white">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral" className="bg-white/10 text-white">
                  {galleryCategoryLabel(activeItem.category as DesignGalleryCategoryId)}
                </Badge>
              </div>
              {activeItem.title ? <p className="text-lg font-bold">{activeItem.title}</p> : null}
              {activeItem.description ? (
                <p className="text-sm leading-relaxed text-white/80">{activeItem.description}</p>
              ) : null}
            </div>

            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
              <Button type="button" variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={closeLightbox}>
                Fermer
              </Button>
              {visibleItems.length > 1 ? (
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={showPrevious}>
                    ←
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={showNext}>
                    →
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
