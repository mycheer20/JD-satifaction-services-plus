import type { Metadata } from "next";
import Link from "next/link";
import { AboutSectionsEditor } from "@/components/design/about-sections-editor";
import { DesignPageHeader, DesignSection } from "@/components/design/design-page-header";
import { getAboutSectionEditorStates, getDesignMediaLibrary } from "@/features/design/queries";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Page À propos",
  robots: { index: false },
};

export default async function DesignAboutPage() {
  const [entries, mediaLibrary] = await Promise.all([
    getAboutSectionEditorStates(),
    getDesignMediaLibrary(),
  ]);

  const publishedCount = entries.filter((entry) => entry.hasPublishedOverride).length;

  return (
    <div className="space-y-10">
      <DesignPageHeader
        eyebrow="Design du site"
        title="Page À propos"
        description="Personnalisez le contenu institutionnel et les visuels de la page publique. Sans publication, les textes et la mise en page par défaut restent visibles."
        actions={
          <ButtonLink href="/a-propos" variant="outline" size="sm" target="_blank">
            Voir la page ↗
          </ButtonLink>
        }
      />

      <Card padding="md" tone="muted">
        <p className="text-sm text-muted">
          {publishedCount > 0
            ? `${publishedCount} section${publishedCount > 1 ? "s" : ""} personnalisée${publishedCount > 1 ? "s" : ""} publiée${publishedCount > 1 ? "s" : ""}.`
            : "Aucune section publiée : la page utilise le contenu codé par défaut."}{" "}
          La galerie photo publique se gère dans le module{" "}
          <Link href="/design/galerie" className="font-semibold text-[color:var(--accent)]">
            Galerie entreprise
          </Link>
          .
        </p>
      </Card>

      {mediaLibrary.length === 0 ? (
        <Card padding="md" tone="muted">
          <p className="text-sm text-muted">
            Importez des visuels dans{" "}
            <Link href="/design/mediatheque" className="font-semibold text-[color:var(--accent)]">
              la bibliothèque média
            </Link>{" "}
            pour enrichir les sections avec de vraies photos.
          </p>
        </Card>
      ) : null}

      <DesignSection
        title="Sections institutionnelles"
        description="Hero, présentation, mission, valeurs, activités, présence et appel à l'action."
      >
        <AboutSectionsEditor entries={entries} mediaLibrary={mediaLibrary} />
      </DesignSection>
    </div>
  );
}
