import type { Metadata } from "next";
import { ThemeTokensForm } from "@/components/design/theme-tokens-form";
import { DesignPageHeader } from "@/components/design/design-page-header";
import {
  getDraftThemeTokens,
  getPublishedThemeTokensState,
} from "@/features/design/queries";

export const metadata: Metadata = {
  title: "Apparence",
  robots: { index: false },
};

export default async function DesignAppearancePage() {
  const [draftTokens, publishedState] = await Promise.all([
    getDraftThemeTokens(),
    getPublishedThemeTokensState(),
  ]);

  return (
    <div className="space-y-8">
      <DesignPageHeader
        eyebrow="Design du site"
        title="Apparence & couleurs"
        description="Définissez la palette globale : marque, surfaces, textes et statuts. Enregistrez un brouillon pour tester, puis publiez pour l'appliquer à toute la boutique. Sans publication, le design codé par défaut reste visible."
      />

      <ThemeTokensForm
        draftTokens={draftTokens}
        publishedTokens={publishedState.tokens}
        hasPublishedOverride={publishedState.hasPublishedOverride}
      />
    </div>
  );
}
