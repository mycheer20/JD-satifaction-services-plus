import type { Metadata } from "next";
import Link from "next/link";
import { requireDesignEditor } from "@/features/design/guards";
import { DESIGN_PLACEMENTS } from "@/lib/design/placements";
import { PageTitle, SectionLabel } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Design du site",
  robots: { index: false },
};

export default async function DesignDashboardPage() {
  const user = await requireDesignEditor();

  return (
    <div className="space-y-8">
      <div>
        <SectionLabel>Personnalisation visuelle</SectionLabel>
        <PageTitle
          title="Design du site"
          description="Gérez l'apparence du site sans modifier le code. Le design par défaut reste actif tant qu'aucune configuration n'est publiée."
          className="mb-0"
        />
      </div>

      <Card padding="md" className="text-sm text-slate-600">
        Connecté en tant que <strong>{user.email}</strong> ({user.role}).
        L&apos;apparence globale est configurable dans{" "}
        <Link href="/design/apparence" className="font-medium text-[color:var(--accent)] hover:underline">
          Apparence
        </Link>
        . Les modules Accueil, Familles et Bibliothèque média arrivent en Phase 5.
      </Card>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-[color:var(--color-foreground)]">
          Emplacements configurables ({DESIGN_PLACEMENTS.length})
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {DESIGN_PLACEMENTS.map((placement) => (
            <li key={placement.id}>
              <Card padding="md" className="h-full">
                <p className="text-xs font-mono text-muted">{placement.id}</p>
                <p className="mt-1 text-sm font-semibold">{placement.label}</p>
                <p className="mt-1 text-xs text-slate-500">{placement.description}</p>
                {placement.capabilities.length > 0 ? (
                  <p className="mt-2 text-[11px] text-muted">
                    {placement.capabilities.join(" · ")}
                  </p>
                ) : null}
              </Card>
            </li>
          ))}
        </ul>
      </section>

      {user.role === "admin" ? (
        <p className="text-sm text-muted">
          <Link href="/admin" className="font-medium text-[color:var(--accent)] hover:underline">
            ← Retour à l&apos;administration métier
          </Link>
        </p>
      ) : null}
    </div>
  );
}
