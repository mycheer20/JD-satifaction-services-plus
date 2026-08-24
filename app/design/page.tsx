import type { Metadata } from "next";
import Link from "next/link";
import { requireDesignEditor } from "@/features/design/guards";
import { getPublishedThemeTokensState, getDesignMediaLibrary } from "@/features/design/queries";
import { DESIGN_PLACEMENTS } from "@/lib/design/placements";
import { DESIGN_NAV } from "@/lib/design/nav";
import { DesignPageHeader, DesignSection } from "@/components/design/design-page-header";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Design du site",
  robots: { index: false },
};

const PLACEMENT_GROUPS = [
  { title: "Accueil", prefix: "home." },
  { title: "À propos", prefix: "about." },
] as const;

export default async function DesignDashboardPage() {
  const user = await requireDesignEditor();
  const themeState = await getPublishedThemeTokensState();

  const activeModules = DESIGN_NAV.flatMap((s) => s.items).filter((i) => !i.disabled).length;
  const upcomingModules = DESIGN_NAV.flatMap((s) => s.items).filter((i) => i.disabled).length;
  const mediaCount = await getDesignMediaLibrary({ includeInactive: true }).then((m) => m.length);

  return (
    <div className="space-y-10">
      <DesignPageHeader
        eyebrow="Personnalisation visuelle"
        title="Vue d'ensemble"
        description="Configurez l'identité visuelle du site sans toucher au code. Tant qu'une section n'est pas publiée, le design par défaut reste actif pour les visiteurs."
        actions={
          <ButtonLink href="/design/apparence" variant="primary" size="sm">
            Ouvrir Apparence
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Apparence publiée"
          value={themeState.hasPublishedOverride ? "Personnalisée" : "Par défaut"}
          hint={
            themeState.hasPublishedOverride
              ? "Des couleurs custom sont visibles sur la boutique."
              : "Le site utilise globals.css — aucune surcharge active."
          }
          tone={themeState.hasPublishedOverride ? "success" : "neutral"}
        />
        <StatCard
          label="Modules disponibles"
          value={`${activeModules} / ${activeModules + upcomingModules}`}
          hint="Apparence, média, accueil et page À propos sont disponibles."
          tone="neutral"
        />
        <StatCard
          label="Médias en bibliothèque"
          value={String(mediaCount)}
          hint="Images importées via la bibliothèque sécurisée."
          tone="neutral"
        />
        <StatCard
          label="Votre accès"
          value={user.role === "admin" ? "Admin + Design" : "Designer"}
          hint={user.email}
          tone="neutral"
        />
      </div>

      <DesignSection
        title="Modules"
        description="Accédez aux sections disponibles ou consultez la feuille de route des prochaines phases."
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {DESIGN_NAV.flatMap((section) => section.items).map((item) => (
            <li key={item.href}>
              <Card
                padding="md"
                tone={item.disabled ? "muted" : "elevated"}
                className="h-full"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl" aria-hidden>
                    {item.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-[color:var(--color-foreground)]">
                        {item.label}
                      </h3>
                      {item.badge ? (
                        <span className="rounded-full bg-[color:var(--color-surface-muted)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted">
                          {item.badge}
                        </span>
                      ) : null}
                    </div>
                    {item.description ? (
                      <p className="mt-1 text-sm text-muted">{item.description}</p>
                    ) : null}
                    {!item.disabled ? (
                      <Link
                        href={item.href}
                        className="mt-3 inline-flex text-sm font-semibold text-[color:var(--accent)] hover:underline"
                      >
                        Ouvrir →
                      </Link>
                    ) : (
                      <p className="mt-3 text-xs font-medium text-muted">Bientôt disponible</p>
                    )}
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </DesignSection>

      {PLACEMENT_GROUPS.map(({ title, prefix }) => {
        const items = DESIGN_PLACEMENTS.filter((p) => p.id.startsWith(prefix));
        if (items.length === 0) return null;

        return (
          <DesignSection
            key={prefix}
            title={`Emplacements — ${title}`}
            description="Chaque emplacement correspond à une zone précise du site. La configuration se fera module par module."
          >
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((placement) => (
                <li key={placement.id}>
                  <Card padding="md" className="h-full">
                    <p className="font-mono text-[11px] text-muted">{placement.id}</p>
                    <p className="mt-1 text-sm font-bold text-[color:var(--color-foreground)]">
                      {placement.label}
                    </p>
                    {placement.description ? (
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {placement.description}
                      </p>
                    ) : null}
                    {placement.capabilities.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {placement.capabilities.map((cap) => (
                          <span
                            key={cap}
                            className="rounded-md bg-[color:var(--accent-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-foreground)]"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </Card>
                </li>
              ))}
            </ul>
          </DesignSection>
        );
      })}
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone: "neutral" | "success";
}) {
  return (
    <Card padding="md" tone="elevated">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p
        className={`mt-2 text-xl font-black tracking-tight ${
          tone === "success"
            ? "text-emerald-700"
            : "text-[color:var(--color-foreground)]"
        }`}
      >
        {value}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{hint}</p>
    </Card>
  );
}
