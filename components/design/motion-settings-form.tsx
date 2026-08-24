"use client";

import { useActionState, useMemo, useState } from "react";
import {
  publishMotionSettings,
  resetMotionDraft,
  saveMotionDraft,
} from "@/features/design/actions/motion";
import { motionActionInitial } from "@/features/design/actions/states";
import { DEFAULT_MOTION_SETTINGS } from "@/lib/design/motion-defaults";
import { normalizeMotionSettings } from "@/lib/design/motion-css";
import type { MotionSettings } from "@/types/design";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";

type MotionSettingsFormProps = {
  draftSettings: MotionSettings;
  publishedSettings: MotionSettings;
  hasPublishedOverride: boolean;
};

type ToggleField = {
  name: keyof MotionSettings;
  label: string;
  hint: string;
  dependsOnEnabled?: boolean;
};

const INTENSITY_OPTIONS: { value: MotionSettings["intensity"]; label: string; hint: string }[] = [
  { value: "subtle", label: "Subtile", hint: "Transitions courtes, mouvements discrets." },
  { value: "normal", label: "Équilibrée", hint: "Recommandée — vivante sans excès." },
  { value: "expressive", label: "Expressive", hint: "Animations plus marquées pour les mises en avant." },
];

const TOGGLE_FIELDS: ToggleField[] = [
  {
    name: "cardHover",
    label: "Survol des cartes produits",
    hint: "Léger soulèvement et zoom sur les fiches catalogue.",
    dependsOnEnabled: true,
  },
  {
    name: "familyHover",
    label: "Survol des cartes familles",
    hint: "Zoom et translation sur les univers de l'accueil.",
    dependsOnEnabled: true,
  },
  {
    name: "galleryHover",
    label: "Survol galerie",
    hint: "Effet sur les vignettes de /galerie et lightbox.",
    dependsOnEnabled: true,
  },
  {
    name: "heroTransitions",
    label: "Transitions hero / slider",
    hint: "Durée des fondus et glissements du hero configurable.",
    dependsOnEnabled: true,
  },
  {
    name: "scrollReveal",
    label: "Apparition au défilement",
    hint: "Sections qui entrent progressivement à l'écran.",
    dependsOnEnabled: true,
  },
];

export function MotionSettingsForm({
  draftSettings,
  publishedSettings,
  hasPublishedOverride,
}: MotionSettingsFormProps) {
  const [saveState, saveAction, savePending] = useActionState(saveMotionDraft, motionActionInitial);
  const [publishState, publishAction, publishPending] = useActionState(
    publishMotionSettings,
    motionActionInitial,
  );
  const [resetState, resetAction, resetPending] = useActionState(
    resetMotionDraft,
    motionActionInitial,
  );

  const [form, setForm] = useState(() => normalizeMotionSettings(draftSettings));

  const normalizedDraft = useMemo(() => normalizeMotionSettings(form), [form]);
  const differsFromPublished = useMemo(
    () => JSON.stringify(normalizedDraft) !== JSON.stringify(normalizeMotionSettings(publishedSettings)),
    [normalizedDraft, publishedSettings],
  );
  const differsFromDefault = useMemo(
    () => JSON.stringify(normalizedDraft) !== JSON.stringify(DEFAULT_MOTION_SETTINGS),
    [normalizedDraft],
  );

  const feedback = [saveState, publishState, resetState].find(
    (state) => state.status === "error" || state.status === "success",
  );

  function updateField<K extends keyof MotionSettings>(key: K, value: MotionSettings[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function renderHiddenFields() {
    return (
      <>
        <input type="hidden" name="enabled" value={form.enabled ? "1" : "0"} />
        <input type="hidden" name="intensity" value={form.intensity} />
        {TOGGLE_FIELDS.map((field) => (
          <input
            key={field.name}
            type="hidden"
            name={field.name}
            value={form[field.name] ? "1" : "0"}
          />
        ))}
      </>
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <Card padding="lg" className="space-y-6">
          <CardHeader
            title="Animations globales"
            description="Contrôlez l'intensité et les interactions du site. Les préférences système « réduire les animations » sont toujours respectées."
          />

          {feedback ? (
            <p
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                feedback.status === "success"
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-rose-50 text-rose-800"
              }`}
              role="status"
            >
              {feedback.message}
            </p>
          ) : null}

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
            <span className="control-check mt-0.5">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(event) => updateField("enabled", event.target.checked)}
              />
            </span>
            <span>
              <span className="block text-sm font-bold text-[color:var(--color-foreground)]">
                Activer les animations
              </span>
              <span className="mt-1 block text-sm text-muted">
                Désactivé = le site reste statique (hors sliders déjà configurés).
              </span>
            </span>
          </label>

          <fieldset className="space-y-3" disabled={!form.enabled}>
            <legend className="text-sm font-bold text-[color:var(--color-foreground)]">
              Intensité
            </legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {INTENSITY_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    form.intensity === option.value
                      ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)]"
                      : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:border-[color:var(--accent)]/40"
                  }`}
                >
                  <span className="control-radio">
                    <input
                      type="radio"
                      name="intensity-ui"
                      value={option.value}
                      checked={form.intensity === option.value}
                      onChange={() => updateField("intensity", option.value)}
                    />
                  </span>
                  <span className="mt-3 block text-sm font-bold">{option.label}</span>
                  <span className="mt-1 block text-xs text-muted">{option.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="space-y-3">
            <p className="text-sm font-bold text-[color:var(--color-foreground)]">
              Interactions
            </p>
            {TOGGLE_FIELDS.map((field) => (
              <label
                key={field.name}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 ${
                  !form.enabled ? "opacity-50" : ""
                }`}
              >
                <span className="control-check mt-0.5">
                  <input
                    type="checkbox"
                    checked={Boolean(form[field.name])}
                    disabled={!form.enabled}
                    onChange={(event) => updateField(field.name, event.target.checked)}
                  />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{field.label}</span>
                  <span className="mt-1 block text-sm text-muted">{field.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </Card>

        <div className="flex flex-wrap gap-3">
          <form action={saveAction}>
            {renderHiddenFields()}
            <Button type="submit" variant="secondary" disabled={savePending}>
              {savePending ? "Enregistrement…" : "Enregistrer le brouillon"}
            </Button>
          </form>

          <form action={publishAction}>
            {renderHiddenFields()}
            <input type="hidden" name="use_current_form" value="1" />
            <Button type="submit" variant="primary" disabled={publishPending}>
              {publishPending ? "Publication…" : "Publier sur le site"}
            </Button>
          </form>

          <form action={resetAction}>
            <Button type="submit" variant="ghost" disabled={resetPending}>
              Réinitialiser le brouillon
            </Button>
          </form>
        </div>
      </div>

      <aside className="space-y-4">
        <Card padding="md" tone="muted">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Statut public</p>
          <p className="mt-2 text-lg font-black text-[color:var(--color-foreground)]">
            {hasPublishedOverride ? "Personnalisé" : "Par défaut (code)"}
          </p>
          <p className="mt-2 text-sm text-muted">
            {hasPublishedOverride
              ? "Des paramètres publiés remplacent le comportement codé."
              : "Aucune publication — le site utilise les animations intégrées dans globals.css."}
          </p>
        </Card>

        <Card padding="md">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Brouillon</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              Animations :{" "}
              <strong className="text-[color:var(--color-foreground)]">
                {normalizedDraft.enabled ? "activées" : "désactivées"}
              </strong>
            </li>
            <li>
              Intensité :{" "}
              <strong className="text-[color:var(--color-foreground)]">
                {normalizedDraft.intensity}
              </strong>
            </li>
            {differsFromPublished ? (
              <li className="text-amber-700">Modifications non publiées.</li>
            ) : (
              <li className="text-emerald-700">Aligné avec la version publiée.</li>
            )}
            {differsFromDefault ? null : (
              <li>Valeurs identiques au défaut codé.</li>
            )}
          </ul>
        </Card>

        <Card padding="md" tone="muted">
          <p className="text-sm font-semibold text-[color:var(--color-foreground)]">
            Accessibilité
          </p>
          <p className="mt-2 text-sm text-muted">
            Le paramètre système <code className="text-xs">prefers-reduced-motion</code> désactive
            automatiquement les animations, quelle que soit la configuration publiée.
          </p>
        </Card>
      </aside>
    </div>
  );
}
