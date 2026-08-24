"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import {
  deleteDesignMedia,
  setDesignMediaActive,
  updateDesignMediaMetadata,
  type DesignMediaMetadataState,
} from "@/features/design/actions/media";
import {
  formatMediaBytes,
  formatMediaDimensions,
  MEDIA_KIND_LABELS,
} from "@/lib/design/media-utils";
import type { DesignMediaKindFilter } from "@/types/design";
import type { DesignMediaRow } from "@/types/database";
import { MediaThumbnail } from "@/components/design/media-thumbnail";
import { Alert, Badge, EmptyState } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField, Select, TextArea, TextInput } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const metadataInitial: DesignMediaMetadataState = { status: "idle" };

type MediaLibraryViewProps = {
  items: DesignMediaRow[];
};

export function MediaLibraryView({ items }: MediaLibraryViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const kind = (searchParams.get("type") as DesignMediaKindFilter | null) ?? "all";
  const query = searchParams.get("q") ?? "";
  const includeInactive = searchParams.get("inactifs") === "1";
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );

  function updateFilters(next: { type?: string; q?: string; inactifs?: boolean }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.type !== undefined) {
      if (next.type === "all") params.delete("type");
      else params.set("type", next.type);
    }
    if (next.q !== undefined) {
      if (!next.q.trim()) params.delete("q");
      else params.set("q", next.q.trim());
    }
    if (next.inactifs !== undefined) {
      if (next.inactifs) params.set("inactifs", "1");
      else params.delete("inactifs");
    }
    startTransition(() => router.push(`/design/mediatheque?${params.toString()}`));
  }

  async function handleToggleActive(media: DesignMediaRow) {
    setActionError(null);
    const result = await setDesignMediaActive(media.id, !media.is_active);
    if (!result.ok) {
      setActionError(result.message);
      return;
    }
    startTransition(() => router.refresh());
  }

  async function handleDelete(mediaId: string) {
    if (
      !window.confirm(
        "Supprimer définitivement ce média ? Cette action est irréversible si le fichier n'est utilisé nulle part.",
      )
    ) {
      return;
    }
    setActionError(null);
    const result = await deleteDesignMedia(mediaId);
    if (!result.ok) {
      setActionError(result.message);
      return;
    }
    setSelectedId(null);
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-6">
      <Card padding="md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField label="Rechercher" htmlFor="media-search">
              <TextInput
                id="media-search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Nom, alt text, description…"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    updateFilters({ q: event.currentTarget.value });
                  }
                }}
              />
            </FormField>
            <FormField label="Type de média" htmlFor="media-kind">
              <Select
                id="media-kind"
                value={kind}
                onChange={(event) => updateFilters({ type: event.target.value })}
              >
                <option value="all">Tous</option>
                <option value="image">Images</option>
                <option value="svg">SVG</option>
                <option value="animated">Animés (GIF)</option>
              </Select>
            </FormField>
            <label className="flex items-center gap-2 pt-7 text-sm text-[color:var(--color-foreground)]">
              <input
                type="checkbox"
                checked={includeInactive}
                onChange={(event) => updateFilters({ inactifs: event.target.checked })}
                className="size-4 rounded border-[color:var(--color-border)]"
              />
              Afficher les médias désactivés
            </label>
          </div>
          <Button
            type="button"
            variant="secondary"
            disabled={isPending}
            onClick={() => updateFilters({ q: searchInput })}
          >
            Appliquer la recherche
          </Button>
        </div>
      </Card>

      {actionError ? <Alert tone="error">{actionError}</Alert> : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
        <section className="space-y-4">
          <p className="text-sm text-muted">
            <strong className="text-[color:var(--color-foreground)]">{items.length}</strong> média
            {items.length !== 1 ? "s" : ""}
          </p>

          {items.length === 0 ? (
            <EmptyState
              icon="🖼️"
              title="Bibliothèque vide"
              description="Importez votre première image via le panneau ci-dessus. Les fichiers seront disponibles pour le hero, les familles et la galerie."
            />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((media) => (
                <li key={media.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(media.id)}
                    className={cn(
                      "group w-full overflow-hidden rounded-2xl border bg-[color:var(--color-surface)] text-left shadow-sm transition hover:shadow-md",
                      selectedId === media.id
                        ? "border-[color:var(--accent)] ring-2 ring-[color:var(--ring-color)]"
                        : "border-[color:var(--color-border)]",
                      !media.is_active && "opacity-70",
                    )}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--color-surface-muted)]">
                      <MediaThumbnail media={media} className="transition group-hover:scale-[1.02]" />
                      {!media.is_active ? (
                        <span className="absolute left-2 top-2">
                          <Badge tone="warning">Désactivé</Badge>
                        </span>
                      ) : null}
                      <span className="absolute bottom-2 right-2">
                        <Badge tone="neutral">{MEDIA_KIND_LABELS[media.media_kind]}</Badge>
                      </span>
                    </div>
                    <div className="space-y-1 p-4">
                      <p className="line-clamp-1 text-sm font-bold text-[color:var(--color-foreground)]">
                        {media.display_name}
                      </p>
                      <p className="text-xs text-muted">
                        {formatMediaDimensions(media.width, media.height)} ·{" "}
                        {formatMediaBytes(Number(media.size_bytes))}
                      </p>
                      {!media.alt_text ? (
                        <p className="text-xs font-medium text-amber-700">Alt text manquant</p>
                      ) : null}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          {selected ? (
            <MediaDetailPanel
              key={selected.id}
              media={selected}
              onClose={() => setSelectedId(null)}
              onToggleActive={() => void handleToggleActive(selected)}
              onDelete={() => void handleDelete(selected.id)}
              isBusy={isPending}
            />
          ) : (
            <Card padding="lg" tone="muted" className="text-center">
              <p className="text-sm font-semibold text-[color:var(--color-foreground)]">
                Sélectionnez un média
              </p>
              <p className="mt-2 text-sm text-muted">
                Cliquez sur une vignette pour modifier les métadonnées, copier l&apos;URL ou gérer
                le statut.
              </p>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

function MediaDetailPanel({
  media,
  onClose,
  onToggleActive,
  onDelete,
  isBusy,
}: {
  media: DesignMediaRow;
  onClose: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
  isBusy: boolean;
}) {
  const router = useRouter();
  const [metaState, metaAction, metaPending] = useActionState(
    updateDesignMediaMetadata,
    metadataInitial,
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (metaState.status === "success") {
      router.refresh();
    }
  }, [metaState.status, router]);

  async function copyUrl() {
    await navigator.clipboard.writeText(media.public_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card padding="none" tone="elevated" className="overflow-hidden">
      <div className="relative aspect-video bg-[color:var(--color-surface-muted)]">
        <MediaThumbnail media={media} sizes="380px" priority />
      </div>

      <div className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-bold text-[color:var(--color-foreground)]">
              {media.display_name}
            </p>
            <p className="mt-1 text-xs text-muted">
              {media.extension.toUpperCase()} · {formatMediaBytes(Number(media.size_bytes))} ·{" "}
              {formatMediaDimensions(media.width, media.height)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-muted hover:bg-[color:var(--color-surface-muted)]"
          >
            ✕
          </button>
        </div>

        {metaState.status === "error" ? <Alert tone="error">{metaState.message}</Alert> : null}
        {metaState.status === "success" ? (
          <Alert tone="success">{metaState.message}</Alert>
        ) : null}

        <form action={metaAction} className="space-y-4">
          <input type="hidden" name="media_id" value={media.id} />
          <FormField label="Nom d'affichage" htmlFor={`name-${media.id}`} required>
            <TextInput
              id={`name-${media.id}`}
              name="display_name"
              defaultValue={media.display_name}
              required
            />
          </FormField>
          <FormField
            label="Texte alternatif (alt)"
            htmlFor={`alt-${media.id}`}
            hint="Requis lorsque l'image est publiée dans le contenu du site"
          >
            <TextInput
              id={`alt-${media.id}`}
              name="alt_text"
              defaultValue={media.alt_text ?? ""}
              placeholder="Description accessible de l'image"
            />
          </FormField>
          <FormField label="Description interne" htmlFor={`desc-${media.id}`}>
            <TextArea
              id={`desc-${media.id}`}
              name="description"
              defaultValue={media.description ?? ""}
              rows={3}
            />
          </FormField>
          <Button type="submit" variant="primary" disabled={metaPending || isBusy}>
            {metaPending ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </form>

        <div className="space-y-2 rounded-xl bg-[color:var(--color-surface-muted)] p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">URL publique</p>
          <p className="break-all font-mono text-xs text-[color:var(--color-foreground)]">
            {media.public_url}
          </p>
          <Button type="button" variant="outline" size="sm" onClick={() => void copyUrl()}>
            {copied ? "Copié !" : "Copier l'URL"}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-[color:var(--color-border)] pt-4">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isBusy}
            onClick={onToggleActive}
          >
            {media.is_active ? "Désactiver" : "Réactiver"}
          </Button>
          <Button type="button" variant="danger" size="sm" disabled={isBusy} onClick={onDelete}>
            Supprimer
          </Button>
        </div>
      </div>
    </Card>
  );
}
