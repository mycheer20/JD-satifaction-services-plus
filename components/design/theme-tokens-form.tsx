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

type ThemeTokensFormProps = {
  draftTokens: DesignThemeTokens;
  publishedTokens: DesignThemeTokens;
  hasPublishedOverride: boolean;
};

type TokenField = {
  name: keyof DesignThemeTokens;
  label: string;
  group: "brand" | "surfaces" | "status" | "shape";
};

const TOKEN_FIELDS: TokenField[] = [
  { name: "primary", label: "Primaire", group: "brand" },
  { name: "secondary", label: "Secondaire", group: "brand" },
  { name: "accent", label: "Accent", group: "brand" },
  { name: "background", label: "Arrière-plan", group: "surfaces" },
  { name: "surface", label: "Surface", group: "surfaces" },
  { name: "surfaceMuted", label: "Surface atténuée", group: "surfaces" },
  { name: "text", label: "Texte", group: "surfaces" },
  { name: "textMuted", label: "Texte secondaire", group: "surfaces" },
  { name: "border", label: "Bordures", group: "surfaces" },
  { name: "success", label: "Succès", group: "status" },
  { name: "warning", label: "Avertissement", group: "status" },
  { name: "danger", label: "Erreur", group: "status" },
];

const GROUP_LABELS: Record<TokenField["group"], string> = {
  brand: "Marque",
  surfaces: "Surfaces & texte",
  status: "Statuts",
  shape: "Forme",
};

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-slate-300">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="size-10 cursor-pointer rounded-lg border border-white/10 bg-transparent p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          pattern="^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$"
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 font-mono text-xs text-white outline-none focus:border-violet-400"
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

  const grouped = TOKEN_FIELDS.reduce(
    (acc, field) => {
      acc[field.group].push(field);
      return acc;
    },
    {
      brand: [] as TokenField[],
      surfaces: [] as TokenField[],
      status: [] as TokenField[],
      shape: [] as TokenField[],
    },
  );

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
      <div className="space-y-6">
        {feedback ? (
          <p
            className={`rounded-xl px-4 py-3 text-sm ${
              feedback.status === "error"
                ? "bg-rose-500/10 text-rose-200 ring-1 ring-rose-400/30"
                : "bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-400/30"
            }`}
          >
            {feedback.message}
          </p>
        ) : null}

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">
            {hasPublishedOverride
              ? "Une apparence personnalisée est publiée sur le site."
              : "Le site utilise actuellement le design par défaut codé dans globals.css."}
          </p>
        </div>

        {(Object.keys(grouped) as TokenField["group"][]).map((group) => (
          <section key={group} className="space-y-4 rounded-2xl border border-white/10 p-5">
            <h3 className="text-sm font-bold text-white">{GROUP_LABELS[group]}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {grouped[group].map(({ name, label }) => (
                <ColorField
                  key={name}
                  label={label}
                  value={String(values[name] ?? DEFAULT_THEME_TOKENS[name] ?? "")}
                  onChange={(value) => updateField(name, value)}
                />
              ))}
            </div>
          </section>
        ))}

        <section className="space-y-4 rounded-2xl border border-white/10 p-5">
          <h3 className="text-sm font-bold text-white">{GROUP_LABELS.shape}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-slate-300">Rayon des coins</span>
              <select
                name="borderRadius"
                value={values.borderRadius ?? "0.75rem"}
                onChange={(event) => updateField("borderRadius", event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-400"
              >
                <option value="0.5rem">Compact (0.5rem)</option>
                <option value="0.75rem">Standard (0.75rem)</option>
                <option value="1rem">Arrondi (1rem)</option>
                <option value="1.25rem">Très arrondi (1.25rem)</option>
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-slate-300">Ombre par défaut</span>
              <select
                name="shadow"
                value={values.shadow ?? "md"}
                onChange={(event) =>
                  updateField("shadow", event.target.value as NonNullable<DesignThemeTokens["shadow"]>)
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-400"
              >
                <option value="none">Aucune</option>
                <option value="sm">Légère</option>
                <option value="md">Standard</option>
                <option value="lg">Prononcée</option>
              </select>
            </label>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <form action={saveAction}>
            {hiddenFields()}
            <button
              type="submit"
              disabled={savePending || publishPending || resetPending}
              className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
            >
              {savePending ? "Enregistrement…" : "Enregistrer brouillon"}
            </button>
          </form>

          <form action={publishAction}>
            {hiddenFields()}
            <input type="hidden" name="use_current_form" value="1" />
            <button
              type="submit"
              disabled={savePending || publishPending || resetPending}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
            >
              {publishPending ? "Publication…" : "Publier sur le site"}
            </button>
          </form>

          <form action={resetAction}>
            <button
              type="submit"
              disabled={savePending || publishPending || resetPending}
              className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/5 disabled:opacity-50"
            >
              {resetPending ? "Réinitialisation…" : "Réinitialiser brouillon"}
            </button>
          </form>
        </div>

        <details className="rounded-xl border border-white/10 p-4 text-sm text-slate-400">
          <summary className="cursor-pointer font-medium text-slate-200">
            Tokens publiés actuellement
          </summary>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-black/30 p-3 text-xs text-slate-300">
            {JSON.stringify(publishedTokens, null, 2)}
          </pre>
        </details>
      </div>

      <aside className="space-y-3 xl:sticky xl:top-6 xl:self-start">
        <h3 className="text-sm font-bold text-white">Aperçu live</h3>
        <ThemePreviewPanel tokens={previewTokens} />
      </aside>
    </div>
  );
}
