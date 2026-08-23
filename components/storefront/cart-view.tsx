"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/features/cart/cart-context";
import { PriceDisplay } from "@/components/storefront/price-display";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, QuantityStepper, Skeleton } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TextLink } from "@/components/ui/link";

export function CartView() {
  const { items, totals, ready, setQuantity, removeItem, clear } = useCart();

  if (!ready) {
    return <Skeleton className="h-72" />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Votre panier est vide"
        description="Parcourez le catalogue et ajoutez les produits qui vous intéressent."
        icon="🛒"
        action={<ButtonLink href="/catalogue">Voir le catalogue</ButtonLink>}
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <Card padding="none" tone="elevated" className="overflow-hidden">
        <ul className="divide-y divide-[color:var(--color-border)]">
          {items.map((item) => (
            <li key={item.lineId} className="flex gap-4 p-5">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl opacity-30">
                    📦
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <Link
                  href={
                    item.kind === "service"
                      ? `/service/${item.slug}`
                      : `/produit/${item.slug}`
                  }
                  className="text-base font-bold text-[color:var(--color-foreground)] transition hover:text-[color:var(--accent)]"
                >
                  {item.name}
                </Link>
                {item.variantLabel ? (
                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    {item.variantLabel}
                  </p>
                ) : null}
                <p className="mt-1 text-sm">
                  <PriceDisplay amount={item.unitPrice} currency={item.currency} />
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <QuantityStepper
                    size="sm"
                    value={item.quantity}
                    onDecrease={() => setQuantity(item.lineId, item.quantity - 1)}
                    onIncrease={() => setQuantity(item.lineId, item.quantity + 1)}
                    disabledIncrease={
                      item.maxQuantity !== null && item.quantity >= item.maxQuantity
                    }
                  />

                  <button
                    type="button"
                    onClick={() => removeItem(item.lineId)}
                    className="text-xs font-semibold text-rose-600 transition hover:text-rose-700"
                  >
                    Retirer
                  </button>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <PriceDisplay
                  amount={item.unitPrice * item.quantity}
                  currency={item.currency}
                  layout="stack"
                />
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card tone="muted" padding="md" className="h-fit space-y-5">
        <p className="text-base font-bold text-[color:var(--color-foreground)]">
          Récapitulatif
        </p>

        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-600">
              Sous-total ({totals.itemCount} article{totals.itemCount > 1 ? "s" : ""})
            </dt>
            <dd>
              <PriceDisplay amount={totals.subtotal} currency={totals.currency} layout="stack" />
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">Livraison</dt>
            <dd className="font-medium text-slate-500">À la commande</dd>
          </div>
        </dl>

        <p className="rounded-xl bg-[color:var(--color-surface)] px-3 py-2 text-xs leading-relaxed text-slate-500 ring-1 ring-[color:var(--color-border)]">
          Le montant final est recalculé côté serveur, promotions et codes inclus.
        </p>

        <ButtonLink href="/checkout" size="lg" className="w-full">
          Passer la commande
        </ButtonLink>

        <button
          type="button"
          onClick={clear}
          className="w-full text-xs font-semibold text-slate-500 transition hover:text-rose-600"
        >
          Vider le panier
        </button>
      </Card>
    </div>
  );
}
