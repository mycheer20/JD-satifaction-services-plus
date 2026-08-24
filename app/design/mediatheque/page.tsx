import type { Metadata } from "next";
import { DesignPageHeader } from "@/components/design/design-page-header";
import { MediaLibraryView } from "@/components/design/media-library-view";
import { MediaUploadPanel } from "@/components/design/media-upload-panel";
import { getDesignMediaLibrary } from "@/features/design/queries";
import type { DesignMediaKindFilter } from "@/types/design";

export const metadata: Metadata = {
  title: "Bibliothèque média",
  robots: { index: false },
};

function parseKind(value: string | undefined): DesignMediaKindFilter {
  if (value === "image" || value === "svg" || value === "animated") return value;
  return "all";
}

export default async function DesignMediaLibraryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const items = await getDesignMediaLibrary({
    kind: parseKind(typeof params.type === "string" ? params.type : undefined),
    search: typeof params.q === "string" ? params.q : undefined,
    includeInactive: params.inactifs === "1",
  });

  return (
    <div className="space-y-8">
      <DesignPageHeader
        eyebrow="Design du site"
        title="Bibliothèque média"
        description="Centralisez les images du site : import sécurisé, métadonnées, texte alternatif et gestion du cycle de vie. Les fichiers sont stockés sur Supabase avec des chemins non devinables."
      />

      <MediaUploadPanel />

      <MediaLibraryView items={items} />
    </div>
  );
}
