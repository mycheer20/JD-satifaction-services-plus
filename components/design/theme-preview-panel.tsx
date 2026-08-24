"use client";

import { useMemo } from "react";
import { buildThemeStylesheet } from "@/lib/design/theme-css";
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
    <div className="space-y-3">
      <style dangerouslySetInnerHTML={{ __html: scopedCss }} />
      <div className="design-theme-preview overflow-hidden rounded-2xl border border-white/10 bg-[color:var(--color-background)] shadow-lg ring-1 ring-white/5">
        <div className="hero-brand px-5 py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--hero-muted)]">
            Aperçu hero
          </p>
          <h3 className="mt-2 text-xl font-bold">JDSATISFACTION SERVICES PLUS</h3>
          <p className="mt-2 max-w-sm text-sm text-[color:var(--hero-muted)]">
            Informatique, fournitures, gaming et services sur mesure.
          </p>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-xl bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-foreground)]"
            >
              Bouton principal
            </button>
            <button
              type="button"
              className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-2 text-sm font-semibold text-[color:var(--color-foreground)]"
            >
              Contour
            </button>
            <span className="inline-flex items-center rounded-full bg-[color:var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--color-foreground)]">
              Badge
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(
              [
                ["Primaire", "var(--accent)"],
                ["Fond", "var(--color-background)"],
                ["Surface", "var(--color-surface)"],
                ["Texte", "var(--color-foreground)"],
              ] as const
            ).map(([label, cssVar]) => (
              <div key={label} className="space-y-1">
                <div
                  className="h-10 rounded-lg border border-[color:var(--color-border)]"
                  style={{ background: `color-mix(in srgb, ${cssVar} 100%, transparent)` }}
                />
                <p className="text-[11px] text-slate-400">{label}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-[color:var(--color-muted)]">
            Texte secondaire · bordures · surfaces
          </p>
        </div>
      </div>
    </div>
  );
}
