/**
 * Small helpers shared by the taxonomy, field set and service definitions.
 */

export function slugify(input) {
  return String(input)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, " ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Escapes a JS value into a SQL literal. `null` and `undefined` become NULL. */
export function sql(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    return `array[${value.map((v) => sql(v)).join(", ")}]::text[]`;
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

/** Escapes a JS object into a SQL jsonb literal. */
export function json(value) {
  return `'${JSON.stringify(value ?? null).replace(/'/g, "''")}'::jsonb`;
}

/**
 * Field definition shorthand.
 *
 *   field("ram", "Mémoire RAM", "select", { options: ["8 Go", "16 Go"], filterable: true })
 */
export function field(key, label, type = "text", extra = {}) {
  return {
    key,
    label,
    type,
    unit: extra.unit ?? null,
    options: extra.options ?? [],
    placeholder: extra.placeholder ?? null,
    helpText: extra.helpText ?? null,
    group: extra.group ?? null,
    required: extra.required ?? false,
    filterable: extra.filterable ?? false,
    keySpec: extra.keySpec ?? false,
  };
}
