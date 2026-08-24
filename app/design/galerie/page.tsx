import type { Metadata } from "next";
import Link from "next/link";
import { GalleryManager } from "@/components/design/gallery-manager";
import { DesignPageHeader } from "@/components/design/design-page-header";
import { getDesignMediaLibrary, getGalleryEditorItems } from "@/features/design/queries";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Galerie entreprise",
  robots: { index: false },
};

export default async function DesignGalleryPage() {
  const [items, mediaLibrary] = await Promise.all([
    getGalleryEditorItems(),
    getDesignMediaLibrary(),
  ]);

  const publishedCount = items.filter((item) => item.status === "published" && item.isActive).length;

  return (
    <div className="space-y-8">
      <DesignPageHeader
        eyebrow="Design du site"
        title="Galerie entreprise"
        description="Gérez les photos publiques affichées sur /galerie et dans la section galerie de la page À propos. Chaque photo passe par un brouillon avant publication."
        actions={
          <ButtonLink href="/galerie" variant="outline" size="sm" target="_blank">
            Voir la galerie ↗
          </ButtonLink>
        }
      />

      <Card padding="md" tone="muted">
        <p className="text-sm text-muted">
          {publishedCount > 0
            ? `${publishedCount} photo${publishedCount > 1 ? "s" : ""} visible${publishedCount > 1 ? "s" : ""} sur le site public.`
            : "Aucune photo publiée : la galerie publique reste vide (fallback propre, sans zone cassée)."}{" "}
          Les visuels proviennent de la{" "}
          <Link href="/design/mediatheque" className="font-semibold text-[color:var(--accent)]">
            bibliothèque média
          </Link>
          .
        </p>
      </Card>

      {mediaLibrary.length === 0 ? (
        <Card padding="md" tone="muted">
          <p className="text-sm text-muted">
            Importez d&apos;abord des images dans la bibliothèque média avant d&apos;alimenter la galerie.
          </p>
        </Card>
      ) : (
        <GalleryManager items={items} mediaLibrary={mediaLibrary} />
      )}
    </div>
  );
}
