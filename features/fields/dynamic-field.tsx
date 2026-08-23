"use client";

import { FieldShell, Select, TextArea, TextInput, CheckboxField, inputClass } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { FieldDefinition, FieldValue } from "./types";

/**
 * Renders one database-defined field. The same component serves the admin
 * product form and the customer service brief, which is what keeps the two
 * dynamic form systems from drifting apart.
 */
export function DynamicField({
  field,
  prefix = "attr",
  defaultValue,
  error,
  disabled,
}: {
  field: FieldDefinition;
  prefix?: string;
  defaultValue?: FieldValue;
  error?: string | null;
  disabled?: boolean;
}) {
  const name = `${prefix}.${field.key}`;
  const id = `field-${prefix}-${field.key}`;
  const hint = [field.helpText, field.unit ? `Unité : ${field.unit}` : null]
    .filter(Boolean)
    .join(" · ");

  const shell = (children: React.ReactNode, className?: string) => (
    <FieldShell
      htmlFor={id}
      label={field.label}
      required={field.required}
      hint={hint || null}
      error={error}
      className={className}
    >
      {children}
    </FieldShell>
  );

  switch (field.type) {
    case "textarea":
    case "richtext":
      return shell(
        <TextArea
          id={id}
          name={name}
          required={field.required}
          disabled={disabled}
          placeholder={field.placeholder ?? undefined}
          defaultValue={(defaultValue as string) ?? ""}
        />,
        "sm:col-span-2",
      );

    case "select":
      return shell(
        <Select
          id={id}
          name={name}
          required={field.required}
          disabled={disabled}
          defaultValue={(defaultValue as string) ?? ""}
        >
          <option value="">Sélectionner…</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>,
      );

    case "multiselect": {
      const selected = new Set(
        Array.isArray(defaultValue) ? (defaultValue as string[]) : [],
      );
      return shell(
        <div className="flex flex-wrap gap-2 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-3">
          {field.options.map((option) => (
            <label
              key={option}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[color:var(--accent)]/40 has-checked:border-[color:var(--accent)] has-checked:bg-[color:var(--accent)] has-checked:text-[color:var(--accent-foreground)] has-checked:shadow-sm"
            >
              <input
                type="checkbox"
                name={name}
                value={option}
                disabled={disabled}
                defaultChecked={selected.has(option)}
                className="sr-only"
              />
              {option}
            </label>
          ))}
        </div>,
        "sm:col-span-2",
      );
    }

    case "boolean":
      return (
        <div className="sm:col-span-2">
          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
            <CheckboxField
              id={id}
              name={name}
              disabled={disabled}
              defaultChecked={Boolean(defaultValue)}
              label={field.label}
              description={hint || undefined}
            />
          </div>
          {error ? (
            <p className="mt-1 text-xs font-semibold text-rose-600">{error}</p>
          ) : null}
        </div>
      );

    case "number":
    case "integer":
      return shell(
        <TextInput
          id={id}
          name={name}
          type="number"
          step={field.type === "integer" ? "1" : "any"}
          required={field.required}
          disabled={disabled}
          placeholder={field.placeholder ?? undefined}
          defaultValue={
            defaultValue === null || defaultValue === undefined
              ? ""
              : String(defaultValue)
          }
        />,
      );

    case "date":
      return shell(
        <TextInput
          id={id}
          name={name}
          type="date"
          required={field.required}
          disabled={disabled}
          defaultValue={(defaultValue as string) ?? ""}
        />,
      );

    case "email":
    case "url":
    case "color":
      return shell(
        <TextInput
          id={id}
          name={name}
          type={field.type}
          required={field.required}
          disabled={disabled}
          placeholder={field.placeholder ?? undefined}
          defaultValue={(defaultValue as string) ?? ""}
          className={field.type === "color" ? "h-10 w-20 p-1" : undefined}
        />,
      );

    case "file":
    case "files":
      // File inputs are handled by the brief upload component, which needs the
      // request folder before it can store anything.
      return shell(
        <input
          id={id}
          name={`${name}.files`}
          type="file"
          multiple={field.type === "files"}
          disabled={disabled}
          accept={field.acceptedFileTypes?.join(",")}
          className={cn(
            inputClass,
            "file:mr-3 file:rounded-lg file:border-0 file:bg-[color:var(--accent)] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[color:var(--accent-foreground)]",
          )}
        />,
        "sm:col-span-2",
      );

    default:
      return shell(
        <TextInput
          id={id}
          name={name}
          required={field.required}
          disabled={disabled}
          placeholder={field.placeholder ?? undefined}
          defaultValue={(defaultValue as string) ?? ""}
        />,
      );
  }
}
