import type { Metadata } from "next";
import { getSessionUser } from "@/features/auth/session";
import { listPaymentMethodsForCheckout } from "@/features/payments/provider";
import { CheckoutForm } from "@/components/storefront/checkout-form";
import { ExchangeRateBar } from "@/components/storefront/exchange-rate-bar";
import { PageTitle, SectionLabel } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Commande",
  robots: { index: false },
};

export default async function CheckoutPage() {
  const user = await getSessionUser();
  const paymentMethods = listPaymentMethodsForCheckout();

  return (
    <div className="page-container py-10">
      <SectionLabel>Paiement sécurisé</SectionLabel>
      <PageTitle
        title="Finaliser la commande"
        description={
          user
            ? "Vos informations sont pré-remplies depuis votre compte."
            : "Sans compte, finalisez votre commande sur WhatsApp avec un message prérempli — rien n'est enregistré sur le site."
        }
        className="mb-8"
      />

      <ExchangeRateBar className="mb-8 rounded-xl border" />

      <CheckoutForm
        paymentMethods={paymentMethods}
        isGuest={!user}
        defaults={{
          name: user?.fullName ?? "",
          email: user?.email ?? "",
          phone: user?.phone ?? "",
        }}
      />
    </div>
  );
}
