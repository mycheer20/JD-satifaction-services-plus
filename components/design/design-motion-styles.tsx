import { buildMotionStylesheet } from "@/lib/design/motion-css";
import type { MotionSettings } from "@/types/design";

type DesignMotionStylesProps = {
  settings: MotionSettings;
  scope?: ":root" | string;
  id?: string;
};

/**
 * Injecte les paramètres d'animation publiés comme variables CSS.
 * Les utilitaires motion-* de globals.css les consomment.
 */
export function DesignMotionStyles({
  settings,
  scope = ":root",
  id = "design-motion-settings",
}: DesignMotionStylesProps) {
  const css = buildMotionStylesheet(settings, scope);

  return <style id={id} data-design-motion="true" dangerouslySetInnerHTML={{ __html: css }} />;
}
