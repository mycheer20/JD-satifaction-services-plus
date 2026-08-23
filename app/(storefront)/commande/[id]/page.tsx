import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getOrderForConfirmation,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/features/orders/queries";
import { instructionsFromPayment } from "@/features/payments/instructions";
import { isMobileMoneyProvider } from "@/features/payments/mobile-money";
import { orderHasConfirmedPayment } from "@/features/orders/payment-rules";
import { PaymentInstructionsPanel } from "@/components/storefront/payment-instructions";
import { MobileMoneyProofPanel } from "@/components/storefront/mobile-money-proof-panel";
import { StoreContactBar } from "@/components/storefront/store-contact-actions";
import { Alert, Badge, PageTitle, SectionLabel } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { TextLink } from "@/components/ui/link";
import { PriceDisplay } from "@/components/storefront/price-display";
import { ExchangeRateBar } from "@/components/storefront/exchange-rate-bar";
import { ClearCartOnMount } from "@/components/storefront/clear-cart";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Ma commande",
  robots: { index: false },
};

export default async function OrderPage({
  params,
  searchParams,
}: PageProps<"/commande/[id]">) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const order = await getOrderForConfirmation(id);
  if (!order) notFound();

  const isNew = query.nouvelle === "1";
  const proofSent = query.preuve === "1";
  const shipping = order.shipping_address as Record<string, string>;
  const pendingPayments = order.payments.filter((p) => p.status === "pending");
  const paymentConfirmed = orderHasConfirmedPayment(order.payments);

  return (
    <div className="page-container max-w-3xl py-10">
      <ExchangeRateBar className="mb-6 rounded-xl border" />
      {isNew ? <ClearCartOnMount /> : null}

      {!paymentConfirmed &&
      !["cancelled", "refunded", "delivered"].includes(order.status) ? (
        <Alert tone="warning" className="mb-8">
          <p className="font-semibold">Paiement requis avant livraison</p>
          <p className="mt-1 text-sm opacity-90">
            Votre commande sera préparée et livrée (ou remise en boutique) uniquement après
            confirmation de votre paiement par notre équipe.
          </p>
        </Alert>
      ) : null}

      {proofSent ? (
        <Alert tone="success" className="mb-8">
          <p className="font-semibold">Preuve de paiement enregistrée</p>
          <p className="mt-1 text-sm opacity-90">
            Merci ! Notre équipe va vérifier votre transaction et confirmer la commande.
          </p>
        </Alert>
      ) : null}

      {isNew ? (
        <Alert tone="success" className="mb-8">
          <p className="font-semibold">Merci, votre commande est enregistrée.</p>
          <p className="mt-1 text-sm opacity-90">
            {pendingPayments.length > 0
              ? "Consultez ci-dessous les instructions de paiement ou de retrait. Elles sont aussi disponibles dans votre espace Notifications."
              : "Nous vous contactons rapidement au sujet du paiement et de la livraison."}
          </p>
        </Alert>
      ) : null}

      {pendingPayments.length > 0 ? (
        <div className="mb-8 space-y-4">
          <h2 className="text-lg font-bold text-[color:var(--color-foreground)]">
            Instructions de paiement / retrait
          </h2>
          {pendingPayments.map((payment) => {
            const instructions = instructionsFromPayment(payment);
            const isMobile = isMobileMoneyProvider(payment.provider);

            return (
              <div key={payment.id} className="space-y-4">
                {instructions ? (
                  <PaymentInstructionsPanel
                    instructions={instructions}
                    showContact={!isMobile}
                  />
                ) : null}
                {isMobile ? (
                  <MobileMoneyProofPanel
                    payment={payment}
                    orderId={order.id}
                    orderReference={order.reference}
                    amountLabel={instructions!.amountLabel}
                    proofFiles={payment.proof_files ?? []}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      <StoreContactBar subject={`la commande ${order.reference}`} className="mb-8" />

      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <SectionLabel>Commande</SectionLabel>
          <PageTitle
            title={order.reference}
            description={`Passée le ${formatDate(order.placed_at)}`}
            className="mb-0"
          />
        </div>
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
      </header>

      <Card padding="none" className="mb-6 overflow-hidden">
        <CardHeader title="Articles" className="border-b border-[color:var(--color-border)] px-5 py-4" />
        <ul className="divide-y divide-[color:var(--color-border)]">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[color:var(--color-foreground)]">
                  {item.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {item.quantity} ×{" "}
                  <PriceDisplay
                    amount={item.unit_price}
                    currency={order.currency}
                    showUsd={false}
                  />
                  {item.sku ? ` · Réf. ${item.sku}` : ""}
                </p>
              </div>
              <div className="shrink-0 text-sm">
                <PriceDisplay amount={item.line_total} currency={order.currency} layout="stack" />
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <div className="mb-6 grid gap-6 sm:grid-cols-2">
        <Card padding="md">
          <CardHeader title="Livraison" className="mb-3" />
          <address className="text-sm not-italic leading-relaxed text-slate-600">
            {order.customer_name}
            <br />
            {shipping?.line1}
            <br />
            {[shipping?.postal_code, shipping?.city].filter(Boolean).join(" ")}
            <br />
            {order.customer_phone}
          </address>
        </Card>

        <Card padding="md">
          <CardHeader title="Récapitulatif" className="mb-3" />
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Sous-total</dt>
              <dd>
                <PriceDisplay amount={order.subtotal} currency={order.currency} layout="stack" />
              </dd>
            </div>
            {order.discount_total > 0 ? (
              <div className="flex justify-between">
                <dt className="text-slate-600">
                  Remise{order.coupon_code ? ` (${order.coupon_code})` : ""}
                </dt>
                <dd className="font-medium text-emerald-700">
                  −<PriceDisplay amount={order.discount_total} currency={order.currency} showUsd={false} />
                </dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-slate-600">Livraison</dt>
              <dd className="font-medium text-[color:var(--color-foreground)]">
                {order.shipping_total > 0 ? (
                  <PriceDisplay amount={order.shipping_total} currency={order.currency} layout="stack" />
                ) : (
                  "À confirmer"
                )}
              </dd>
            </div>
            <div className="flex justify-between border-t border-[color:var(--color-border)] pt-3 text-base font-bold">
              <dt>Total</dt>
              <dd className="text-[color:var(--accent)]">
                <PriceDisplay
                  amount={order.total}
                  currency={order.currency}
                  layout="stack"
                  primaryClassName="text-base font-bold"
                />
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      {order.payments.length > 0 ? (
        <Card padding="md" className="mb-8">
          <CardHeader title="Paiement" className="mb-4" />
          <ul className="space-y-2">
            {order.payments.map((payment) => (
              <li
                key={payment.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 text-sm"
              >
                <span className="font-medium text-slate-700">{payment.payment_method}</span>
                <Badge tone={payment.status === "paid" ? "success" : "warning"}>
                  {PAYMENT_STATUS_LABELS[payment.status]}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 border-t border-[color:var(--color-border)] pt-8">
        <ButtonLink href="/catalogue" variant="primary">
          Continuer mes achats
        </ButtonLink>
        <TextLink href="/compte/commandes" variant="muted">
          Toutes mes commandes →
        </TextLink>
      </div>
    </div>
  );
}
