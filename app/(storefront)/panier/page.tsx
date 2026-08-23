import type { Metadata } from "next";
import { CartView } from "@/components/storefront/cart-view";
import { PageTitle } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Mon panier",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="page-container py-10">
      <PageTitle title="Mon panier" description="Vérifiez vos articles avant de passer commande." />
      <CartView />
    </div>
  );
}
