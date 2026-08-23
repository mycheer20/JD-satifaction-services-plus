import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/features/auth/guards";
import { listMyOrders, ORDER_STATUS_LABELS } from "@/features/orders/queries";
import { Badge, EmptyState, PageTitle, SectionLabel } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriceDisplay } from "@/components/storefront/price-display";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Mes commandes",
  robots: { index: false },
};

export default async function OrdersPage() {
  const user = await requireUser();
  const orders = await listMyOrders(user.id);

  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>Historique</SectionLabel>
        <PageTitle
          title="Mes commandes"
          description="Retrouvez le détail et le suivi de vos achats."
          className="mb-0"
        />
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="Aucune commande pour le moment"
          description="Parcourez le catalogue et passez votre première commande."
          action={<ButtonLink href="/catalogue">Voir le catalogue</ButtonLink>}
        />
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link href={`/commande/${order.id}`} className="group block">
                <Card
                  padding="md"
                  className="transition group-hover:border-[color:var(--accent)]/40 group-hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[color:var(--color-foreground)] group-hover:text-[color:var(--accent)]">
                        {order.reference}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge
                        tone={
                          order.status === "delivered"
                            ? "success"
                            : order.status === "cancelled" || order.status === "refunded"
                              ? "danger"
                              : "info"
                        }
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                      <span className="text-sm font-bold text-[color:var(--accent)]">
                        <PriceDisplay amount={order.total} currency={order.currency} layout="stack" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
