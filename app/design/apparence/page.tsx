import type { Metadata } from "next";
import { ThemeTokensForm } from "@/components/design/theme-tokens-form";
import { PageTitle, SectionLabel } from "@/components/ui/badge";
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
      <div>
        <SectionLabel>Design du site</SectionLabel>
        <PageTitle
          title="Apparence & couleurs"
          description="Personnalisez les couleurs globales, les surfaces et les accents. Le site conserve le design par défaut tant qu'aucune configuration n'est publiée."
          className="mb-0"
        />
      </div>

      <ThemeTokensForm
        draftTokens={draftTokens}
        publishedTokens={publishedState.tokens}
        hasPublishedOverride={publishedState.hasPublishedOverride}
      />
    </div>
  );
}
