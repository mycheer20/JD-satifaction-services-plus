import type { AdminDetailPageProps } from "@/lib/admin/page-types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminFlash } from "@/components/admin/admin-flash";
import { StatusBadge } from "@/components/admin/admin-table";
import { getOrderForAdmin } from "@/features/admin/queries";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONE,
} from "@/lib/admin/labels";
import { updateOrderStatus } from "@/features/admin/actions/orders";
import { AdminPaymentsCard } from "@/components/admin/admin-payments-card";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { orderHasConfirmedPayment } from "@/features/orders/payment-rules";
import {
  formatOrderDeliveryLines,
  parseOrderDeliverySnapshot,
} from "@/lib/orders/delivery-display";
import { formatDate, formatPrice } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { OrderStatus } from "@/types/database";

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: AdminDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const order = await getOrderForAdmin(id);
  if (!order) notFound();

  const paymentConfirmed = orderHasConfirmedPayment(order.payments ?? []);
  const delivery = parseOrderDeliverySnapshot(order.shipping_address);
  const deliveryLines = formatOrderDeliveryLines(delivery);

  return (
    <>
      <AdminFlash searchParams={query} />
      <AdminPageHeader
        title={`Commande ${order.reference}`}
        description={order.customer_name}
        actions={
          <StatusBadge
            label={ORDER_STATUS_LABELS[order.status as OrderStatus]}
            tone={ORDER_STATUS_TONE[order.status as OrderStatus]}
          />
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Card padding="md" className="space-y-4">
            <h2 className="font-bold">Articles</h2>
            <ul className="divide-y divide-[color:var(--color-border)]">
              {(order.items ?? []).map((item) => (
                <li key={item.id} className="flex justify-between gap-4 py-3 text-sm">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-muted">Qté {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{formatPrice(Number(item.line_total))}</p>
                </li>
              ))}
            </ul>
            <dl className="border-t pt-4 text-sm">
              <Row label="Sous-total" value={formatPrice(Number(order.subtotal))} />
              <Row label="Réduction" value={formatPrice(Number(order.discount_total))} />
              <Row label="Livraison" value={formatPrice(Number(order.shipping_total))} />
              <Row label="Total" value={formatPrice(Number(order.total))} strong />
            </dl>
          </Card>

          {order.customer_note ? (
            <Card padding="md">
              <h2 className="mb-2 font-bold">Instructions de livraison</h2>
              <p className="text-sm text-muted">{order.customer_note}</p>
            </Card>
          ) : null}
        </div>

        <aside className="space-y-6">
          <Card padding="md" className="space-y-3">
            <h2 className="font-bold">Client & livraison</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-muted">Nom</dt>
                <dd className="font-semibold">{order.customer_name}</dd>
              </div>
              <div>
                <dt className="text-muted">E-mail</dt>
                <dd>
                  <a
                    href={`mailto:${order.customer_email}`}
                    className="font-medium text-[color:var(--accent)] hover:underline"
                  >
                    {order.customer_email}
                  </a>
                </dd>
              </div>
              {order.customer_phone ? (
                <div>
                  <dt className="text-muted">Téléphone</dt>
                  <dd>
                    <a
                      href={`tel:${order.customer_phone.replace(/\s/g, "")}`}
                      className="font-medium text-[color:var(--accent)] hover:underline"
                    >
                      {order.customer_phone}
                    </a>
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="text-muted">Mode</dt>
                <dd className="font-semibold">
                  {order.fulfillment_mode === "pickup" ? "Retrait en boutique" : "Livraison"}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Adresse / zone</dt>
                <dd className="whitespace-pre-line font-medium">
                  {deliveryLines.length > 0 ? (
                    deliveryLines.join("\n")
                  ) : (
                    <span className="text-muted">Non renseignée</span>
                  )}
                </dd>
              </div>
              {order.shipping_total > 0 ? (
                <div>
                  <dt className="text-muted">Frais appliqués</dt>
                  <dd className="font-semibold">
                    {formatPrice(Number(order.shipping_total), order.currency)}
                  </dd>
                </div>
              ) : null}
            </dl>
          </Card>

          <Card padding="md" className="space-y-4">
            <h2 className="font-bold">Statut commande</h2>
            <OrderStatusForm
              orderId={order.id}
              currentStatus={order.status as OrderStatus}
              adminNote={order.admin_note}
              payments={order.payments ?? []}
              updateAction={updateOrderStatus}
            />
            {!paymentConfirmed ? (
              <p className="text-xs text-amber-800">
                Préparation et livraison bloquées jusqu&apos;à confirmation du paiement.
              </p>
            ) : null}
            <p className="text-xs text-muted">Passée le {formatDate(order.placed_at)}</p>
          </Card>

          <Card padding="md">
            <AdminPaymentsCard orderId={order.id} payments={order.payments ?? []} />
          </Card>

          <Link
            href="/admin/commandes"
            className="block text-center text-sm font-semibold text-[color:var(--accent)] hover:underline"
          >
            ← Retour aux commandes
          </Link>
        </aside>
      </div>
    </>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex justify-between py-1">
      <dt className="text-muted">{label}</dt>
      <dd className={strong ? "font-bold" : ""}>{value}</dd>
    </div>
  );
}
