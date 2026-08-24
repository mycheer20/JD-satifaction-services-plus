"use client";

import { useActionState, useMemo, useState } from "react";
import {
  publishThemeTokens,
  resetThemeTokensDraft,
  saveThemeTokensDraft,
  themeTokensInitialState,
} from "@/features/design/actions/theme";
import { DEFAULT_THEME_TOKENS } from "@/lib/design/defaults";
import { normalizeThemeTokens } from "@/lib/design/theme-css";
import type { DesignThemeTokens } from "@/types/design";
import { ThemePreviewPanel } from "@/components/design/theme-preview-panel";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";

type ThemeTokensFormProps = {
  draftTokens: DesignThemeTokens;
  publishedTokens: DesignThemeTokens;
  hasPublishedOverride: boolean;
};

type TokenField = {
  name: keyof DesignThemeTokens;
  label: string;
  hint: string;
  group: "brand" | "surfaces" | "status" | "shape";
};

const TOKEN_GROUPS: {
  id: TokenField["group"];
  title: string;
  description: string;
}[] = [
  {
    id: "brand",
    title: "Identité de marque",
    description:
      "Couleurs principales utilisées pour les boutons, liens actifs, badges et dégradés hero par défaut.",
  },
  {
    id: "surfaces",
    title: "Surfaces & typographie",
    description:
      "Fonds de page, cartes, bordures et hiérarchie de texte sur l'ensemble de la boutique.",
  },
  {
    id: "status",
    title: "Couleurs de statut",
    description: "Retours visuels pour succès, avertissements et erreurs dans les formulaires.",
  },
  {
    id: "shape",
    title: "Forme & profondeur",
    description: "Rayon des coins et intensité des ombres sur les cartes et boutons.",
  },
];

const TOKEN_FIELDS: TokenField[] = [
  {
    name: "primary",
    label: "Couleur primaire",
    hint: "Boutons principaux, liens, accents forts",
    group: "brand",
  },
  {
    name: "secondary",
    label: "Couleur secondaire",
    hint: "Fonds hero, titres, zones sombres",
    group: "brand",
  },
  {
    name: "accent",
    label: "Accent interactif",
    hint: "Survols, focus, éléments mis en avant",
    group: "brand",
  },
  {
    name: "background",
    label: "Arrière-plan global",
    hint: "Fond général des pages",
    group: "surfaces",
  },
  {
    name: "surface",
    label: "Surface des cartes",
    hint: "Cartes, panneaux, champs sur fond blanc",
    group: "surfaces",
  },
  {
    name: "surfaceMuted",
    label: "Surface atténuée",
    hint: "Zones secondaires, bandeaux, fonds alternés",
    group: "surfaces",
  },
  {
    name: "text",
    label: "Texte principal",
    hint: "Titres et paragraphes",
    group: "surfaces",
  },
  {
    name: "textMuted",
    label: "Texte secondaire",
    hint: "Descriptions, métadonnées, labels discrets",
    group: "surfaces",
  },
  {
    name: "border",
    label: "Bordures",
    hint: "Séparateurs, contours de champs",
    group: "surfaces",
  },
  {
    name: "success",
    label: "Succès",
    hint: "Confirmations, validations",
    group: "status",
  },
  {
    name: "warning",
    label: "Avertissement",
    hint: "Alertes modérées",
    group: "status",
  },
  {
    name: "danger",
    label: "Erreur",
    hint: "Échecs, suppressions, champs invalides",
    group: "status",
  },
];

function ColorField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <div>
        <span className="label-base">{label}</span>
        <p className="mt-0.5 text-xs text-muted">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="size-11 shrink-0 cursor-pointer rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-1 shadow-sm"
          aria-label={`Couleur : ${label}`}
        />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          pattern="^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$"
          className="input-base font-mono text-sm"
          spellCheck={false}
        />
      </div>
    </label>
  );
}

export function ThemeTokensForm({
  draftTokens,
  publishedTokens,
  hasPublishedOverride,
}: ThemeTokensFormProps) {
  const [values, setValues] = useState<DesignThemeTokens>(() =>
    normalizeThemeTokens(draftTokens),
  );
  const [saveState, saveAction, savePending] = useActionState(
    saveThemeTokensDraft,
    themeTokensInitialState,
  );
  const [publishState, publishAction, publishPending] = useActionState(
    publishThemeTokens,
    themeTokensInitialState,
  );
  const [resetState, resetAction, resetPending] = useActionState(
    resetThemeTokensDraft,
    themeTokensInitialState,
  );

  const previewTokens = useMemo(() => normalizeThemeTokens(values), [values]);
  const isBusy = savePending || publishPending || resetPending;

  const feedback = [saveState, publishState, resetState].find(
    (state) => state.status === "error" || state.status === "success",
  );

  function updateField<K extends keyof DesignThemeTokens>(name: K, value: DesignThemeTokens[K]) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function hiddenFields() {
    return (
      <>
        {TOKEN_FIELDS.map(({ name }) => (
          <input key={name} type="hidden" name={name} value={String(values[name] ?? "")} />
        ))}
        <input type="hidden" name="borderRadius" value={values.borderRadius ?? "0.75rem"} />
        <input type="hidden" name="shadow" value={values.shadow ?? "md"} />
      </>
    );
  }

  const fieldsByGroup = TOKEN_GROUPS.map((group) => ({
    ...group,
    fields: TOKEN_FIELDS.filter((field) => field.group === group.id),
  }));

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
      <div className="space-y-6">
        {feedback ? (
          <div
            role="status"
            className={`rounded-2xl border px-4 py-3 text-sm ${
              feedback.status === "error"
                ? "border-rose-200 bg-rose-50 text-rose-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            {feedback.message}
          </div>
        ) : null}

        <Card padding="md" tone="muted">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[color:var(--color-foreground)]">
                État de publication
              </p>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
                {hasPublishedOverride
                  ? "Une apparence personnalisée est actuellement visible sur la boutique publique."
                  : "Aucune apparence publiée : les visiteurs voient le design par défaut du code (globals.css)."}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                hasPublishedOverride
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-[color:var(--color-surface)] text-muted ring-1 ring-[color:var(--color-border)]"
              }`}
            >
              {hasPublishedOverride ? "Publié" : "Défaut actif"}
            </span>
          </div>
        </Card>

        {fieldsByGroup.map((group) => (
          <Card key={group.id} padding="lg">
            <CardHeader title={group.title} description={group.description} className="mb-6" />
            {group.id === "shape" ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="label-base">Rayon des coins</span>
                  <p className="text-xs text-muted">Arrondi des cartes, boutons et champs</p>
                  <select
                    value={values.borderRadius ?? "0.75rem"}
                    onChange={(event) => updateField("borderRadius", event.target.value)}
                    className="input-base"
                  >
                    <option value="0.5rem">Compact — 0.5rem</option>
                    <option value="0.75rem">Standard — 0.75rem</option>
                    <option value="1rem">Arrondi — 1rem</option>
                    <option value="1.25rem">Très arrondi — 1.25rem</option>
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="label-base">Ombre par défaut</span>
                  <p className="text-xs text-muted">Profondeur visuelle des composants</p>
                  <select
                    value={values.shadow ?? "md"}
                    onChange={(event) =>
                      updateField(
                        "shadow",
                        event.target.value as NonNullable<DesignThemeTokens["shadow"]>,
                      )
                    }
                    className="input-base"
                  >
                    <option value="none">Aucune</option>
                    <option value="sm">Légère</option>
                    <option value="md">Standard</option>
                    <option value="lg">Prononcée</option>
                  </select>
                </label>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {group.fields.map(({ name, label, hint }) => (
                  <ColorField
                    key={name}
                    label={label}
                    hint={hint}
                    value={String(values[name] ?? DEFAULT_THEME_TOKENS[name] ?? "")}
                    onChange={(value) => updateField(name, value)}
                  />
                ))}
              </div>
            )}
          </Card>
        ))}

        <Card padding="md" tone="elevated">
          <CardHeader
            title="Actions"
            description="Le brouillon n'est visible que dans ce panneau. Seule la publication modifie la boutique."
            className="mb-4"
          />
          <div className="flex flex-wrap gap-3">
            <form action={saveAction}>
              {hiddenFields()}
              <Button type="submit" variant="secondary" disabled={isBusy}>
                {savePending ? "Enregistrement…" : "Enregistrer brouillon"}
              </Button>
            </form>

            <form action={publishAction}>
              {hiddenFields()}
              <input type="hidden" name="use_current_form" value="1" />
              <Button type="submit" variant="primary" disabled={isBusy}>
                {publishPending ? "Publication…" : "Publier sur le site"}
              </Button>
            </form>

            <form action={resetAction}>
              <Button type="submit" variant="outline" disabled={isBusy}>
                {resetPending ? "Réinitialisation…" : "Réinitialiser au défaut"}
              </Button>
            </form>
          </div>
        </Card>

        <details className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
          <summary className="cursor-pointer text-sm font-semibold text-[color:var(--color-foreground)]">
            Voir les tokens publiés (JSON)
          </summary>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-[color:var(--color-surface-muted)] p-4 text-xs text-[color:var(--color-foreground)]">
            {JSON.stringify(publishedTokens, null, 2)}
          </pre>
        </details>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
        <Card padding="md" tone="elevated">
          <CardHeader
            title="Aperçu live"
            description="Simule hero, boutons et palette avec vos réglages actuels (non publiés tant que vous n'avez pas cliqué Publier)."
          />
          <div className="mt-4">
            <ThemePreviewPanel tokens={previewTokens} />
          </div>
        </Card>
      </aside>
    </div>
  );
}
