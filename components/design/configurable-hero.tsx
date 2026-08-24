"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { HeroSectionConfig, ResolvedPlacementMedia } from "@/types/design";
import { cn } from "@/lib/utils";

type ConfigurableHeroProps = {
  media: ResolvedPlacementMedia;
  children: React.ReactNode;
  className?: string;
};

export function ConfigurableHero({ media, children, className }: ConfigurableHeroProps) {
  if (media.mode === "slider" && media.slides && media.slides.length > 1) {
    return (
      <HeroSlider media={{ ...media, slides: media.slides }} className={className}>
        {children}
      </HeroSlider>
    );
  }

  const imageUrl = media.imageUrl ?? media.slides?.[0]?.publicUrl;
  const altText = media.altText ?? media.slides?.[0]?.altText ?? "Hero";
  const overlay = media.overlayOpacity;
  const position = media.imagePosition ?? "center";

  if (!imageUrl) return null;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl px-6 py-16 text-white shadow-xl sm:px-12 sm:py-24",
        className,
      )}
    >
      <Image
        src={imageUrl}
        alt={altText}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: position }}
        unoptimized={imageUrl.endsWith(".gif")}
      />
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlay }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_50%)]" />
      <div className="relative">{children}</div>
    </section>
  );
}

function HeroSlider({
  media,
  children,
  className,
}: ConfigurableHeroProps & { media: ResolvedPlacementMedia & { slides: NonNullable<ResolvedPlacementMedia["slides"]> } }) {
  const config = media.config as HeroSectionConfig;
  const slides = media.slides;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const goNext = useCallback(() => {
    setIndex((current) => {
      const next = current + 1;
      if (next >= slides.length) return config.loop === false ? current : 0;
      return next;
    });
  }, [config.loop, slides.length]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion || !config.autoplay || paused || slides.length <= 1) return;
    const duration = slides[index]?.durationMs ?? config.defaultDurationMs ?? 6000;
    const timer = window.setTimeout(goNext, duration);
    return () => window.clearTimeout(timer);
  }, [index, paused, config.autoplay, config.defaultDurationMs, slides, goNext, reducedMotion]);

  const active = slides[index]!;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl px-6 py-16 text-white shadow-xl sm:px-12 sm:py-24",
        className,
      )}
      onMouseEnter={config.pauseOnHover ? () => setPaused(true) : undefined}
      onMouseLeave={config.pauseOnHover ? () => setPaused(false) : undefined}
    >
      {slides.map((slide, slideIndex) => (
        <div
          key={slide.id}
          className={cn(
            "motion-hero-slide absolute inset-0 transition-all",
            slideIndex === index ? "opacity-100" : "pointer-events-none opacity-0",
            active.transition === "slide" &&
              (slideIndex === index ? "translate-x-0" : slideIndex < index ? "-translate-x-8" : "translate-x-8"),
            active.transition === "zoom" &&
              (slideIndex === index ? "scale-100" : "scale-105"),
          )}
          aria-hidden={slideIndex !== index}
        >
          <Image
            src={slide.publicUrl}
            alt={slide.altText}
            fill
            priority={slideIndex === 0}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: slide.imagePosition }}
            unoptimized={slide.publicUrl.endsWith(".gif")}
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: slide.overlayOpacity }}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_50%)]" />

      <div className="relative">{children}</div>

      {slides.length > 1 ? (
        <div className="absolute bottom-4 right-4 flex gap-1.5">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Slide ${slideIndex + 1}`}
              onClick={() => setIndex(slideIndex)}
              className={cn(
                "size-2.5 rounded-full transition",
                slideIndex === index ? "bg-white" : "bg-white/40 hover:bg-white/70",
              )}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
