import { z } from "zod";

const hexColor = z
  .string()
  .trim()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Couleur hexadécimale invalide (#RGB ou #RRGGBB).");

const radius = z
  .string()
  .trim()
  .regex(/^\d+(\.\d+)?(rem|px|em)$/, "Rayon invalide (ex. 0.75rem).");

export const themeTokensSchema = z.object({
  primary: hexColor,
  secondary: hexColor,
  accent: hexColor,
  background: hexColor,
  surface: hexColor,
  surfaceMuted: hexColor,
  text: hexColor,
  textMuted: hexColor,
  border: hexColor,
  success: hexColor,
  warning: hexColor,
  danger: hexColor,
  borderRadius: radius.optional(),
  shadow: z.enum(["sm", "md", "lg", "none"]).optional(),
});

export type ThemeTokensInput = z.infer<typeof themeTokensSchema>;

const TOKEN_FIELDS = [
  "primary",
  "secondary",
  "accent",
  "background",
  "surface",
  "surfaceMuted",
  "text",
  "textMuted",
  "border",
  "success",
  "warning",
  "danger",
  "borderRadius",
  "shadow",
] as const;

export function parseThemeTokensForm(formData: FormData) {
  const raw = Object.fromEntries(
    TOKEN_FIELDS.map((field) => [field, String(formData.get(field) ?? "").trim() || undefined]),
  );

  return themeTokensSchema.safeParse(raw);
}
