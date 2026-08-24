import type { Metadata } from "next";
import Link from "next/link";
import { DesignPageHeader, DesignSection } from "@/components/design/design-page-header";
import { FamilyCoversEditor } from "@/components/design/family-covers-editor";
import { HomeHeroEditor } from "@/components/design/home-hero-editor";
import {
  getDesignMediaLibrary,
  getFamilyPlacementEditorStates,
  getHeroSectionEditorState,
} from "@/features/design/queries";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Page d'accueil",
  robots: { index: false },
};

export default async function DesignHomePage() {
  const [heroState, familyEntries, mediaLibrary] = await Promise.all([
    getHeroSectionEditorState(),
    getFamilyPlacementEditorStates(),
    getDesignMediaLibrary(),
  ]);

  return (
    <div className="space-y-10">
      <DesignPageHeader
        eyebrow="Design du site"
        title="Page d'accueil"
        description="Configurez le hero principal et les couvertures des cartes familles. Sans publication, la boutique conserve le design codé par défaut (gradients et textes actuels)."
        actions={
          <ButtonLink href="/" variant="outline" size="sm" target="_blank">
            Voir la boutique ↗
          </ButtonLink>
        }
      />

      {mediaLibrary.length === 0 ? (
        <Card padding="md" tone="muted">
          <p className="text-sm text-muted">
            La bibliothèque média est vide.{" "}
            <Link href="/design/mediatheque" className="font-semibold text-[color:var(--accent)]">
              Importez des visuels
            </Link>{" "}
            avant de personnaliser le hero et les familles.
          </p>
        </Card>
      ) : null}

      <DesignSection
        title="Hero principal"
        description="Bannière en haut de la page d'accueil. Le texte et les boutons restent codés ; seul l'arrière-plan visuel est configurable."
      >
        <HomeHeroEditor
          draft={heroState.draft}
          published={heroState.published}
          hasPublishedOverride={heroState.hasPublishedOverride}
          mediaLibrary={mediaLibrary}
        />
      </DesignSection>

      <DesignSection
        title="Couvertures des familles"
        description="Une image optionnelle par carte dans la grille « Parcourir par famille ». Les icônes, badges et gradients restent visibles par-dessus."
      >
        <FamilyCoversEditor entries={familyEntries} mediaLibrary={mediaLibrary} />
      </DesignSection>
    </div>
  );
}
