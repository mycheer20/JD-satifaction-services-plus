"use client";

import { useMemo, useState } from "react";
import type { DesignMediaRow } from "@/types/database";
import { MediaThumbnail } from "@/components/design/media-thumbnail";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FormField, TextInput } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { formatMediaBytes, MEDIA_KIND_LABELS } from "@/lib/design/media-utils";

type MediaPickerProps = {
  items: DesignMediaRow[];
  value?: string | null;
  onSelect: (media: DesignMediaRow | null) => void;
  /** Exiger un alt text renseigné */
  requireAltText?: boolean;
  className?: string;
};

/**
 * Sélecteur réutilisable pour les phases suivantes (hero, familles, galerie).
 */
export function MediaPicker({
  items,
  value,
  onSelect,
  requireAltText = false,
  className,
}: MediaPickerProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (!item.is_active) return false;
      if (requireAltText && !item.alt_text?.trim()) return false;
      if (!q) return true;
      return (
        item.display_name.toLowerCase().includes(q) ||
        item.alt_text?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
      );
    });
  }, [items, requireAltText, search]);

  return (
    <div className={cn("space-y-4", className)}>
      <FormField label="Filtrer la bibliothèque" htmlFor="picker-search">
        <TextInput
          id="picker-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un média…"
        />
      </FormField>

      {filtered.length === 0 ? (
        <Card padding="md" tone="muted">
          <p className="text-sm text-muted">
            Aucun média disponible{requireAltText ? " avec texte alternatif" : ""}.
          </p>
        </Card>
      ) : (
        <ul className="grid max-h-80 gap-3 overflow-y-auto sm:grid-cols-2">
          {filtered.map((media) => {
            const selected = value === media.id;
            return (
              <li key={media.id}>
                <button
                  type="button"
                  onClick={() => onSelect(selected ? null : media)}
                  className={cn(
                    "w-full overflow-hidden rounded-xl border text-left transition",
                    selected
                      ? "border-[color:var(--accent)] ring-2 ring-[color:var(--ring-color)]"
                      : "border-[color:var(--color-border)] hover:border-[color:var(--accent)]/40",
                  )}
                >
                  <div className="relative aspect-[4/3] bg-[color:var(--color-surface-muted)]">
                    <MediaThumbnail media={media} sizes="160px" />
                  </div>
                  <div className="space-y-1 p-3">
                    <p className="line-clamp-1 text-xs font-bold">{media.display_name}</p>
                    <Badge tone="neutral">{MEDIA_KIND_LABELS[media.media_kind]}</Badge>
                    <p className="text-[11px] text-muted">
                      {formatMediaBytes(Number(media.size_bytes))}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
