"use client";

import { useMemo } from "react";
import { buildThemeStylesheet } from "@/lib/design/theme-css";
import { publicEnv } from "@/lib/public-env";
import type { DesignThemeTokens } from "@/types/design";

type ThemePreviewPanelProps = {
  tokens: DesignThemeTokens;
};

export function ThemePreviewPanel({ tokens }: ThemePreviewPanelProps) {
  const scopedCss = useMemo(
    () => buildThemeStylesheet(tokens, ".design-theme-preview"),
    [tokens],
  );

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: scopedCss }} />
      <div className="design-theme-preview overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-background)] shadow-md">
        <div className="hero-brand px-5 py-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--hero-muted)]">
            Bannière hero
          </p>
          <h3 className="mt-2 text-lg font-black leading-tight">{publicEnv.storeName}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--hero-muted)]">
            Informatique, fournitures, gaming et services sur mesure.
          </p>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex rounded-xl bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-foreground)]">
              Commander
            </span>
            <span className="inline-flex rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-2 text-sm font-semibold text-[color:var(--color-foreground)]">
              En savoir plus
            </span>
            <span className="inline-flex items-center rounded-full bg-[color:var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--color-foreground)]">
              Nouveau
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ["Primaire", "var(--accent)"],
                ["Fond", "var(--color-background)"],
                ["Surface", "var(--color-surface)"],
                ["Texte", "var(--color-foreground)"],
              ] as const
            ).map(([label, cssVar]) => (
              <div key={label} className="space-y-1.5">
                <div
                  className="h-9 rounded-lg border border-[color:var(--color-border)] shadow-sm"
                  style={{ background: `color-mix(in srgb, ${cssVar} 100%, transparent)` }}
                />
                <p className="text-[11px] font-medium text-muted">{label}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-[color:var(--color-muted)]">
            Texte secondaire · lisibilité · bordures
          </p>
        </div>
      </div>
    </div>
  );
}
