import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedGalleryItemsByCategory, getDesignPreviewOptions } from "@/features/design/queries";
import { DESIGN_GALLERY_CATEGORIES } from "@/lib/design/placements";
import { galleryCategoryLabel, isGalleryCategory } from "@/lib/design/gallery-utils";
import { GalleryGrid } from "@/components/storefront/gallery-grid";
import { BreadcrumbsWithCurrent } from "@/components/ui/breadcrumbs";
import { EmptyState } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { publicEnv } from "@/lib/public-env";

export const metadata: Metadata = {
  title: "Galerie",
  description: `Photos de ${publicEnv.storeName} : entreprise, boutique, produits, équipe et activités.`,
};

function parseCategory(value: string | undefined) {
  if (!value || value === "all") return "all";
  return isGalleryCategory(value) ? value : "all";
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const category = parseCategory(typeof params.categorie === "string" ? params.categorie : undefined);
  const { previewDraft } = await getDesignPreviewOptions();
  const items = await getPublishedGalleryItemsByCategory(
    category === "all" ? undefined : category,
    { previewDraft },
  );

  return (
    <div className="page-container pb-16">
      <BreadcrumbsWithCurrent
        items={[{ href: "/a-propos", label: "À propos" }]}
        current="Galerie"
        className="mb-0 py-6"
      />

      <section className="space-y-4">
        <CardHeader
          title="Galerie entreprise"
          description="Découvrez en images notre boutique, nos produits, notre équipe et notre quotidien."
        />

        <div className="flex flex-wrap gap-2">
          <FilterLink href="/galerie" active={category === "all"} label="Toutes" />
          {DESIGN_GALLERY_CATEGORIES.map((entry) => (
            <FilterLink
              key={entry.id}
              href={`/galerie?categorie=${entry.id}`}
              active={category === entry.id}
              label={entry.label}
            />
          ))}
        </div>
      </section>

      <section className="mt-10">
        {items.length === 0 ? (
          <EmptyState
            title="Galerie en cours de constitution"
            description="Les photos de l'entreprise seront bientôt disponibles ici. En attendant, explorez notre catalogue ou contactez-nous."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <ButtonLink href="/catalogue" variant="primary">
                  Voir le catalogue
                </ButtonLink>
                <ButtonLink href="/a-propos" variant="outline">
                  À propos
                </ButtonLink>
              </div>
            }
          />
        ) : (
          <>
            {category !== "all" ? (
              <p className="mb-6 text-sm text-muted">
                Catégorie : <span className="font-semibold">{galleryCategoryLabel(category)}</span>{" "}
                — {items.length} photo{items.length > 1 ? "s" : ""}
              </p>
            ) : null}
            <GalleryGrid items={items} />
          </>
        )}
      </section>
    </div>
  );
}

function FilterLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]"
          : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-foreground)] hover:bg-slate-200"
      }`}
    >
      {label}
    </Link>
  );
}
