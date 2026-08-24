"use client";

import { useActionState } from "react";
import Link from "next/link";
import { publishAllDesign } from "@/features/design/actions/publication";
import { publicationActionInitial } from "@/features/design/actions/states";
import type { DesignPendingModule, DesignPublicationSummary } from "@/types/design";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";

type PublicationDashboardProps = {
  modules: DesignPendingModule[];
  history: DesignPublicationSummary[];
  pendingCount: number;
};

export function PublicationDashboard({
  modules,
  history,
  pendingCount,
}: PublicationDashboardProps) {
  const [state, publishAction, pending] = useActionState(
    publishAllDesign,
    publicationActionInitial,
  );

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        {state.status !== "idle" ? (
          <p
            role="status"
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              state.status === "success"
                ? "bg-emerald-50 text-emerald-800"
                : "bg-rose-50 text-rose-800"
            }`}
          >
            {state.message}
          </p>
        ) : null}

        <Card padding="lg" className="space-y-5">
          <CardHeader
            title="Aperçu du site"
            description="Visualisez la boutique avec tous les brouillons actifs, sans impacter les visiteurs."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <PreviewLink href="/?preview=draft" label="Accueil" emoji="🏠" />
            <PreviewLink href="/a-propos?preview=draft" label="À propos" emoji="🏢" />
            <PreviewLink href="/galerie?preview=draft" label="Galerie" emoji="📸" />
            <PreviewLink href="/?preview=live" label="Quitter l'aperçu" emoji="✅" muted />
          </div>
        </Card>

        <Card padding="lg" className="space-y-5">
          <CardHeader
            title="Modifications en attente"
            description={
              pendingCount > 0
                ? `${pendingCount} module${pendingCount > 1 ? "s" : ""} avec des brouillons non publiés.`
                : "Tout est aligné avec la version publique."
            }
          />
          <ul className="space-y-2">
            {modules.map((module) => (
              <li key={module.id}>
                <Link
                  href={module.href}
                  className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition ${
                    module.pending
                      ? "border-amber-200 bg-amber-50/80 hover:border-amber-300"
                      : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:border-[color:var(--accent)]/30"
                  }`}
                >
                  <span>
                    <span className="block text-sm font-bold text-[color:var(--color-foreground)]">
                      {module.label}
                    </span>
                    {module.detail ? (
                      <span className="mt-0.5 block text-xs text-muted">{module.detail}</span>
                    ) : (
                      <span className="mt-0.5 block text-xs text-emerald-700">À jour</span>
                    )}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                      module.pending
                        ? "bg-amber-200 text-amber-900"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {module.pending ? "Brouillon" : "Publié"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card padding="lg" className="space-y-4">
          <CardHeader
            title="Publier sur le site"
            description="Copie tous les brouillons vers la version publique et enregistre un snapshot dans l'historique."
          />
          <form action={publishAction} className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[color:var(--color-foreground)]">
                Note (optionnelle)
              </span>
              <textarea
                name="notes"
                rows={3}
                placeholder="Ex. Mise à jour hero + nouvelles photos galerie"
                className="input-base resize-y"
              />
            </label>
            <Button type="submit" variant="primary" disabled={pending}>
              {pending ? "Publication…" : "Publier tous les brouillons"}
            </Button>
          </form>
        </Card>
      </div>

      <aside className="space-y-4">
        <Card padding="md" tone={pendingCount > 0 ? "elevated" : "muted"}>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Statut global</p>
          <p className="mt-2 text-2xl font-black text-[color:var(--color-foreground)]">
            {pendingCount > 0 ? `${pendingCount} en attente` : "Synchronisé"}
          </p>
          <p className="mt-2 text-sm text-muted">
            {pendingCount > 0
              ? "Des visiteurs voient encore l'ancienne version jusqu'à publication."
              : "La boutique reflète les derniers contenus publiés."}
          </p>
        </Card>

        <Card padding="md">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Historique
          </p>
          {history.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Aucune publication enregistrée pour l&apos;instant.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {history.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2.5"
                >
                  <p className="text-sm font-semibold text-[color:var(--color-foreground)]">
                    {new Date(entry.publishedAt).toLocaleString("fr-FR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  {entry.notes ? (
                    <p className="mt-1 text-xs text-muted">{entry.notes}</p>
                  ) : null}
                  {entry.publishedByLabel ? (
                    <p className="mt-1 text-[11px] text-muted">{entry.publishedByLabel}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </aside>
    </div>
  );
}

function PreviewLink({
  href,
  label,
  emoji,
  muted,
}: {
  href: string;
  label: string;
  emoji: string;
  muted?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
        muted
          ? "border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] text-muted hover:text-[color:var(--color-foreground)]"
          : "border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50 text-violet-900 hover:border-violet-300 hover:shadow-sm"
      }`}
    >
      <span className="text-xl" aria-hidden>
        {emoji}
      </span>
      {label}
    </Link>
  );
}
