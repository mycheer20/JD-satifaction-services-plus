import type { FieldType } from "@/types/database";

/**
 * The shape both product field definitions and service brief fields are
 * normalised to, so a single renderer and a single validator serve both.
 */
export type FieldDefinition = {
  key: string;
  label: string;
  type: FieldType;
  unit: string | null;
  options: string[];
  placeholder: string | null;
  helpText: string | null;
  group: string | null;
  required: boolean;
  filterable?: boolean;
  keySpec?: boolean;
  maxFiles?: number | null;
  acceptedFileTypes?: string[] | null;
};

export type FieldValue = string | number | boolean | string[] | null;

export type FieldGroup = {
  label: string;
  fields: FieldDefinition[];
};

/** Fields keep their declared order; groups appear in first-seen order. */
export function groupFields(fields: FieldDefinition[]): FieldGroup[] {
  const groups: FieldGroup[] = [];
  const index = new Map<string, FieldGroup>();

  for (const field of fields) {
    const label = field.group ?? "Caractéristiques";
    let group = index.get(label);
    if (!group) {
      group = { label, fields: [] };
      index.set(label, group);
      groups.push(group);
    }
    group.fields.push(field);
  }

  return groups;
}

export const FILE_FIELD_TYPES: FieldType[] = ["file", "files"];

export function isFileField(field: FieldDefinition | FieldType): boolean {
  return FILE_FIELD_TYPES.includes(typeof field === "string" ? field : field.type);
}

/**
 * A validated answer, shaped like a `product_attributes` row so it can be
 * inserted directly. The typed columns keep numeric and boolean filters usable
 * in SQL instead of forcing every comparison through text.
 */
export type AttributeValue = {
  field_key: string;
  value_text: string | null;
  value_number: number | null;
  value_boolean: boolean | null;
  value_json: FieldValue;
};
