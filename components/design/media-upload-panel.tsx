"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState, useTransition } from "react";
import { uploadDesignMedia } from "@/features/design/actions/media";
import { MEDIA_UPLOAD_HINT } from "@/lib/design/media-utils";
import { Alert } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { FormField, TextInput } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type UploadQueueItem = {
  id: string;
  name: string;
  status: "pending" | "uploading" | "done" | "error";
  message?: string;
};

export function MediaUploadPanel() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [altText, setAltText] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const [isPending, startTransition] = useTransition();

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (list.length === 0) return;

      const items: UploadQueueItem[] = list.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        status: "pending" as const,
      }));
      setQueue(items);
      setFeedback(null);

      let successCount = 0;
      let lastError: string | null = null;

      for (let i = 0; i < list.length; i++) {
        const file = list[i]!;
        setQueue((current) =>
          current.map((item, idx) =>
            idx === i ? { ...item, status: "uploading" } : item,
          ),
        );

        const formData = new FormData();
        formData.append("file", file);
        if (altText.trim()) formData.append("alt_text", altText.trim());
        if (displayName.trim()) formData.append("display_name", displayName.trim());
        if (description.trim()) formData.append("description", description.trim());

        const result = await uploadDesignMedia({ status: "idle" }, formData);

        if (result.status === "success") {
          successCount += 1;
          setQueue((current) =>
            current.map((item, idx) =>
              idx === i ? { ...item, status: "done" } : item,
            ),
          );
        } else if (result.status === "error") {
          lastError = result.message;
          setQueue((current) =>
            current.map((item, idx) =>
              idx === i ? { ...item, status: "error", message: result.message } : item,
            ),
          );
        }
      }

      if (lastError && successCount === 0) {
        setFeedback(lastError);
      } else if (lastError) {
        setFeedback(`${successCount} fichier(s) importé(s). Dernière erreur : ${lastError}`);
      } else if (successCount > 0) {
        setFeedback(`${successCount} fichier(s) importé(s) avec succès.`);
        setAltText("");
        setDisplayName("");
        setDescription("");
        if (inputRef.current) inputRef.current.value = "";
        setTimeout(() => setQueue([]), 2500);
        startTransition(() => router.refresh());
      }
    },
    [altText, description, displayName, router],
  );

  function onDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragOver(false);
    void uploadFiles(event.dataTransfer.files);
  }

  return (
    <Card padding="lg" tone="elevated">
      <CardHeader
        title="Importer des médias"
        description={`Glissez-déposez ou sélectionnez des fichiers. Formats : ${MEDIA_UPLOAD_HINT.formats}. Max ${MEDIA_UPLOAD_HINT.maxSize} par fichier, ${MEDIA_UPLOAD_HINT.maxDimensions}.`}
      />

      <div className="mt-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            label="Nom d'affichage (optionnel)"
            htmlFor="media-display-name"
            hint="Appliqué à tous les fichiers de cet envoi si renseigné"
          >
            <TextInput
              id="media-display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ex. Hero boutique été"
              disabled={isPending || queue.some((q) => q.status === "uploading")}
            />
          </FormField>
          <FormField
            label="Texte alternatif (optionnel)"
            htmlFor="media-alt-text"
            hint="Obligatoire quand l'image est utilisée dans le contenu public"
          >
            <TextInput
              id="media-alt-text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Décrivez l'image pour l'accessibilité"
              disabled={isPending || queue.some((q) => q.status === "uploading")}
            />
          </FormField>
          <FormField label="Description (optionnelle)" htmlFor="media-description">
            <TextInput
              id="media-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Note interne pour l'équipe design"
              disabled={isPending || queue.some((q) => q.status === "uploading")}
            />
          </FormField>
        </div>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "relative rounded-2xl border-2 border-dashed px-6 py-10 text-center transition",
            dragOver
              ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)]/60"
              : "border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]/40",
          )}
        >
          <p className="text-sm font-semibold text-[color:var(--color-foreground)]">
            Déposez vos images ici
          </p>
          <p className="mt-1 text-sm text-muted">ou</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              variant="primary"
              disabled={isPending || queue.some((q) => q.status === "uploading")}
              onClick={() => inputRef.current?.click()}
            >
              Choisir des fichiers
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept={MEDIA_UPLOAD_HINT.accept}
              multiple
              className="sr-only"
              onChange={(event) => {
                if (event.target.files) void uploadFiles(event.target.files);
              }}
            />
          </div>
          <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-muted">
            Les fichiers sont renommés automatiquement (UUID). Les extensions et signatures sont
            vérifiées côté serveur — ne faites jamais confiance au nom fourni par l&apos;utilisateur.
          </p>
        </div>

        {feedback ? (
          <Alert
            tone={
              feedback.includes("avec succès") ||
              (feedback.includes("importé(s)") && !feedback.toLowerCase().includes("erreur"))
                ? "success"
                : "error"
            }
          >
            {feedback}
          </Alert>
        ) : null}

        {queue.length > 0 ? (
          <ul className="space-y-2 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
            {queue.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="truncate font-medium text-[color:var(--color-foreground)]">
                  {item.name}
                </span>
                <span
                  className={cn(
                    "shrink-0 text-xs font-semibold",
                    item.status === "done" && "text-emerald-700",
                    item.status === "error" && "text-rose-700",
                    item.status === "uploading" && "text-[color:var(--accent)]",
                    item.status === "pending" && "text-muted",
                  )}
                >
                  {item.status === "done"
                    ? "Importé"
                    : item.status === "error"
                      ? item.message ?? "Erreur"
                      : item.status === "uploading"
                        ? "Envoi…"
                        : "En attente"}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Card>
  );
}
