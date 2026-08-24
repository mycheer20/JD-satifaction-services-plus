import Link from "next/link";
import { isDesignPreviewActive } from "@/lib/design/preview";
import { ButtonLink } from "@/components/ui/button";

export async function DesignPreviewBanner() {
  if (!(await isDesignPreviewActive())) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-[60] border-b border-amber-300/60 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 px-4 py-2.5 text-sm text-amber-950 shadow-md"
    >
      <div className="page-container flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold">
          <span aria-hidden className="mr-2">
            👁️
          </span>
          Mode aperçu — vous voyez les <strong>brouillons</strong>, pas la version publique.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <ButtonLink href="/design/publication" size="sm" variant="primary" className="shadow-sm">
            Publier les changements
          </ButtonLink>
          <Link
            href="/?preview=live"
            className="inline-flex h-9 items-center rounded-xl border border-amber-900/20 bg-white/80 px-3 text-xs font-bold text-amber-950 transition hover:bg-white"
          >
            Quitter l&apos;aperçu
          </Link>
        </div>
      </div>
    </div>
  );
}
