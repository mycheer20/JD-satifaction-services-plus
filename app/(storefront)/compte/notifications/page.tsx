import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/features/auth/guards";
import { listMyOrdersWithPayments } from "@/features/orders/queries";
import { instructionsFromPayment } from "@/features/payments/instructions";
import { isMobileMoneyProvider } from "@/features/payments/mobile-money";
import { PaymentInstructionsPanel } from "@/components/storefront/payment-instructions";
import { MobileMoneyProofPanel } from "@/components/storefront/mobile-money-proof-panel";
import { StoreContactBar } from "@/components/storefront/store-contact-actions";
import { Badge, EmptyState, PageTitle, SectionLabel } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriceDisplay } from "@/components/storefront/price-display";
import { ExchangeRateBar } from "@/components/storefront/exchange-rate-bar";
import { formatDate } from "@/lib/utils";
import type { PaymentProofFileRow, PaymentRow } from "@/types/database";

export const metadata: Metadata = {
  title: "Mes notifications",
  robots: { index: false },
};

type OrderWithPayments = {
  id: string;
  reference: string;
  status: string;
  total: number;
  currency: string;
  created_at: string;
  payments: (PaymentRow & { proof_files?: PaymentProofFileRow[] })[];
};

export default async function AccountNotificationsPage() {
  const user = await requireUser();
  const orders = (await listMyOrdersWithPayments(user.id)) as OrderWithPayments[];

  const pending = orders.flatMap((order) => {
    const payments = order.payments.filter((p) => p.status === "pending");
    return payments.map((payment) => ({
      order,
      payment,
      instructions: instructionsFromPayment(payment),
    }));
  });

  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>Mon espace</SectionLabel>
        <PageTitle
          title="Notifications & paiements"
          description="Consignes de paiement, envoi de preuves MonCash/NatCash et actions en attente."
          className="mb-0"
        />
      </div>

      <StoreContactBar subject="une commande" />

      <ExchangeRateBar className="rounded-xl border" />

      {pending.length === 0 ? (
        <EmptyState
          title="Aucune action en attente"
          description="Lorsqu'une commande nécessite un paiement ou un retrait, les instructions apparaîtront ici."
          action={<ButtonLink href="/compte/commandes">Voir mes commandes</ButtonLink>}
        />
      ) : (
        <ul className="space-y-6">
          {pending.map(({ order, payment, instructions }) => {
            const isMobile = isMobileMoneyProvider(payment.provider);

            return (
              <li key={payment.id}>
                <Card padding="md" className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <Link
                        href={`/commande/${order.id}`}
                        className="text-sm font-bold text-[color:var(--accent)] hover:underline"
                      >
                        Commande {order.reference}
                      </Link>
                      <p className="text-xs text-muted">{formatDate(order.created_at)}</p>
                    </div>
                    <Badge tone={payment.proof_submitted_at ? "info" : "warning"}>
                      {payment.proof_submitted_at ? "Preuve reçue" : "Paiement en attente"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted">
                    {payment.payment_method} —{" "}
                    <PriceDisplay amount={Number(payment.amount)} currency={order.currency} />
                  </p>
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
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
