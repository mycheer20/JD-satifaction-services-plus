import type { AdminListPageProps } from "@/lib/admin/page-types";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatCard } from "@/components/admin/stat-card";
import { AdminFlash } from "@/components/admin/admin-flash";
import { getDashboardMetrics, listAdminNotifications } from "@/features/admin/queries";
import { publicEnv } from "@/lib/public-env";
import { formatDate, formatPrice } from "@/lib/utils";
import { Alert } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";

export default async function AdminDashboardPage({
  searchParams,
}: AdminListPageProps) {
  const metrics = await getDashboardMetrics();
  const params = await searchParams;
  const notifications = await listAdminNotifications(8);
  const unreadNotifications = notifications.filter((n) => !n.read_at);

  return (
    <>
      <AdminFlash searchParams={params} />

      <AdminPageHeader
        title="Tableau de bord"
        description={`Vue d'ensemble de ${publicEnv.storeName} — ventes, stock, commandes et demandes en attente.`}
        actions={
          <ButtonLink href="/admin/produits/nouveau" size="sm">
            + Nouveau produit
          </ButtonLink>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Chiffre d'affaires (30 j)"
          value={formatPrice(metrics.revenue30d)}
          hint={`Total : ${formatPrice(metrics.revenueTotal)}`}
          icon="💰"
          href="/admin/commandes"
        />
        <StatCard
          label="Commandes en attente"
          value={metrics.ordersPending}
          hint={`${metrics.ordersTotal} commandes au total`}
          icon="🛒"
          tone={metrics.ordersPending > 0 ? "warning" : "default"}
          href="/admin/commandes?statut=pending"
        />
        <StatCard
          label="Produits actifs"
          value={metrics.productsActive}
          hint={`${metrics.productsTotal} produits au catalogue`}
          icon="📦"
          href="/admin/produits"
        />
        <StatCard
          label="Stock faible / rupture"
          value={metrics.productsLowStock + metrics.productsOutOfStock}
          hint={`${metrics.productsOutOfStock} en rupture`}
          icon="⚠️"
          tone={
            metrics.productsLowStock + metrics.productsOutOfStock > 0
              ? "danger"
              : "success"
          }
          href="/admin/produits?stock=faible"
        />
      </div>

      {unreadNotifications.length > 0 ? (
        <Card padding="md" className="mb-8 space-y-4 border-2 border-amber-200 bg-amber-50/80">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-bold text-amber-950">
              Notifications récentes ({unreadNotifications.length})
            </h2>
            <ButtonLink href="/admin/notifications" size="sm" variant="outline">
              Voir tout →
            </ButtonLink>
          </div>
          <ul className="space-y-3">
            {unreadNotifications.slice(0, 5).map((notification) => (
              <li key={notification.id}>
                <Alert tone="warning" className="text-sm">
                  <p className="font-semibold">{notification.title}</p>
                  <p className="mt-1 opacity-90">{notification.message}</p>
                  <p className="mt-2 text-xs opacity-75">{formatDate(notification.created_at)}</p>
                  <ButtonLink
                    href={notification.link_href}
                    size="sm"
                    variant="soft"
                    className="mt-3"
                  >
                    Ouvrir la commande
                  </ButtonLink>
                </Alert>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding="md" className="space-y-4">
          <h2 className="text-base font-bold">Actions rapides</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {[
              { href: "/admin/produits/nouveau", label: "Ajouter un produit", icon: "📦" },
              { href: "/admin/commandes", label: "Gérer les commandes", icon: "🛒" },
              { href: "/admin/demandes", label: "Demandes design", icon: "📋" },
              { href: "/admin/avis?statut=pending", label: "Modérer les avis", icon: "⭐" },
              { href: "/admin/coupons/nouveau", label: "Créer un coupon", icon: "🎟️" },
              { href: "/admin/marques", label: "Gérer les marques", icon: "🏷️" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]/40 px-4 py-3 text-sm font-semibold transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)]"
                >
                  <span aria-hidden>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card padding="md" className="space-y-4">
          <h2 className="text-base font-bold">À traiter</h2>
          <dl className="space-y-3 text-sm">
            <Row
              label="Avis en attente de modération"
              value={metrics.reviewsPending}
              href="/admin/avis?statut=pending"
            />
            <Row
              label="Demandes de services en cours"
              value={metrics.serviceRequestsPending}
              href="/admin/demandes"
            />
            <Row label="Clients inscrits" value={metrics.customersTotal} href="/admin/utilisateurs" />
          </dl>
        </Card>
      </div>
    </>
  );
}

function Row({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-[color:var(--color-surface-muted)]/50 px-4 py-3">
      <dt className="text-muted">{label}</dt>
      <dd>
        <Link
          href={href}
          className="inline-flex min-w-8 items-center justify-center rounded-full bg-[color:var(--accent-soft)] px-2.5 py-1 text-sm font-bold text-[color:var(--accent)]"
        >
          {value}
        </Link>
      </dd>
    </div>
  );
}
