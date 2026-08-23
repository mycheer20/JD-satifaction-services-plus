import type { AttributeValue, FieldDefinition } from "./types";
import { isFileField } from "./types";

export interface FieldParseResult {
  values: AttributeValue[];
  /** Keyed by field key, ready to hand back to the form for inline display. */
  errors: Record<string, string>;
  /** The same answers as a plain object, used for service brief storage. */
  answers: Record<string, unknown>;
}

/**
 * Turns a submitted FormData into typed attribute values, validated against the
 * field definitions loaded from the database.
 *
 * This runs on the server. The browser decides what to *show*; what is accepted
 * is decided here, from the definitions, never from what the form claims.
 */
export function parseDynamicFields(
  fields: FieldDefinition[],
  formData: FormData,
  prefix = "attr_",
): FieldParseResult {
  const values: AttributeValue[] = [];
  const answers: Record<string, unknown> = {};
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const name = `${prefix}${field.key}`;

    if (isFileField(field.type)) {
      // Uploads are handled separately: the file itself never travels through
      // the attribute pipeline.
      continue;
    }

    if (field.type === "multiselect") {
      const raw = formData
        .getAll(name)
        .map((v) => String(v).trim())
        .filter(Boolean)
        .filter((v) => field.options.includes(v));

      if (field.required && raw.length === 0) {
        errors[field.key] = `${field.label} est requis.`;
        continue;
      }
      if (raw.length === 0) continue;

      values.push({
        field_key: field.key,
        value_text: raw.join(", "),
        value_number: null,
        value_boolean: null,
        value_json: raw,
      });
      answers[field.key] = raw;
      continue;
    }

    const entry = formData.get(name);
    const raw = typeof entry === "string" ? entry.trim() : "";

    if (field.type === "boolean") {
      const checked = raw === "on" || raw === "true" || raw === "1";
      // An unchecked box is a meaningful "no", so it is always recorded.
      values.push({
        field_key: field.key,
        value_text: checked ? "Oui" : "Non",
        value_number: null,
        value_boolean: checked,
        value_json: null,
      });
      answers[field.key] = checked;
      continue;
    }

    if (!raw) {
      if (field.required) errors[field.key] = `${field.label} est requis.`;
      continue;
    }

    switch (field.type) {
      case "number":
      case "integer": {
        const parsed = Number(raw.replace(",", "."));
        if (!Number.isFinite(parsed)) {
          errors[field.key] = `${field.label} doit être un nombre.`;
          continue;
        }
        if (field.type === "integer" && !Number.isInteger(parsed)) {
          errors[field.key] = `${field.label} doit être un nombre entier.`;
          continue;
        }
        values.push({
          field_key: field.key,
          value_text: raw,
          value_number: parsed,
          value_boolean: null,
          value_json: null,
        });
        answers[field.key] = parsed;
        break;
      }

      case "select": {
        if (field.options.length > 0 && !field.options.includes(raw)) {
          errors[field.key] = `${field.label} : valeur non autorisée.`;
          continue;
        }
        values.push({
          field_key: field.key,
          value_text: raw,
          value_number: null,
          value_boolean: null,
          value_json: null,
        });
        answers[field.key] = raw;
        break;
      }

      case "email": {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
          errors[field.key] = `${field.label} : adresse e-mail invalide.`;
          continue;
        }
        values.push(textValue(field.key, raw));
        answers[field.key] = raw;
        break;
      }

      case "url": {
        try {
          const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
          values.push(textValue(field.key, url.toString()));
          answers[field.key] = url.toString();
        } catch {
          errors[field.key] = `${field.label} : adresse web invalide.`;
        }
        break;
      }

      case "date": {
        if (Number.isNaN(Date.parse(raw))) {
          errors[field.key] = `${field.label} : date invalide.`;
          continue;
        }
        values.push(textValue(field.key, raw));
        answers[field.key] = raw;
        break;
      }

      default: {
        if (raw.length > 5000) {
          errors[field.key] = `${field.label} : texte trop long (5000 caractères maximum).`;
          continue;
        }
        values.push(textValue(field.key, raw));
        answers[field.key] = raw;
      }
    }
  }

  return { values, errors, answers };
}

function textValue(key: string, raw: string): AttributeValue {
  return {
    field_key: key,
    value_text: raw,
    value_number: null,
    value_boolean: null,
    value_json: null,
  };
}

/** Renders a stored attribute back into a readable string. */
export function formatAttributeValue(
  value: Pick<AttributeValue, "value_text" | "value_number" | "value_boolean">,
  unit?: string | null,
): string {
  if (value.value_boolean !== null && value.value_boolean !== undefined) {
    return value.value_boolean ? "Oui" : "Non";
  }
  const base =
    value.value_text ??
    (value.value_number !== null && value.value_number !== undefined
      ? String(value.value_number)
      : "");
  if (!base) return "—";
  return unit ? `${base} ${unit}` : base;
}
