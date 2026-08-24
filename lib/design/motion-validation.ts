import { z } from "zod";
import type { MotionSettings } from "@/types/design";

const motionSettingsSchema = z.object({
  enabled: z.boolean(),
  intensity: z.enum(["subtle", "normal", "expressive"]),
  cardHover: z.boolean(),
  heroTransitions: z.boolean(),
  galleryHover: z.boolean(),
  familyHover: z.boolean(),
  scrollReveal: z.boolean(),
});

function readCheckbox(formData: FormData, name: string, fallback = false): boolean {
  const value = formData.get(name);
  if (value === null) return fallback;
  return value === "1" || value === "on" || value === "true";
}

export function parseMotionSettingsForm(formData: FormData) {
  const raw: MotionSettings = {
    enabled: readCheckbox(formData, "enabled", true),
    intensity: (formData.get("intensity") as MotionSettings["intensity"]) ?? "normal",
    cardHover: readCheckbox(formData, "cardHover", true),
    heroTransitions: readCheckbox(formData, "heroTransitions", true),
    galleryHover: readCheckbox(formData, "galleryHover", true),
    familyHover: readCheckbox(formData, "familyHover", true),
    scrollReveal: readCheckbox(formData, "scrollReveal", true),
  };

  return motionSettingsSchema.safeParse(raw);
}
