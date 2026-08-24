import { buildThemeStylesheet } from "@/lib/design/theme-css";
import type { DesignThemeTokens } from "@/types/design";

type DesignThemeStylesProps = {
  tokens: DesignThemeTokens;
  /** Cible CSS (:root pour le site entier, ou un sélecteur de preview). */
  scope?: ":root" | string;
  id?: string;
};

/**
 * Injecte les tokens publiés comme variables CSS.
 * Placé en tête du body pour surcharger globals.css sans modifier le fichier.
 */
export function DesignThemeStyles({
  tokens,
  scope = ":root",
  id = "design-theme-tokens",
}: DesignThemeStylesProps) {
  const css = buildThemeStylesheet(tokens, scope);

  return <style id={id} data-design-theme="true" dangerouslySetInnerHTML={{ __html: css }} />;
}
