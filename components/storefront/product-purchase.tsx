"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart/cart-context";
import type { ProductDetail } from "@/features/catalog/types";
import { Button } from "@/components/ui/button";
import { Badge, QuantityStepper } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PriceDisplay } from "@/components/storefront/price-display";
import { cn } from "@/lib/utils";
import { StoreContactActions } from "@/components/storefront/store-contact-actions";
import type { StoreContactSnapshot } from "@/lib/store/contact";

export function ProductPurchase({
  product,
  contact,
}: {
  product: ProductDetail;
  contact: StoreContactSnapshot;
}) {
  const router = useRouter();
  const { addItem } = useCart();

  const [activeImage, setActiveImage] = useState(0);
  const [variantId, setVariantId] = useState<string | null>(
    product.variants[0]?.id ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = useMemo(
    () => product.variants.find((v) => v.id === variantId) ?? null,
    [product.variants, variantId],
  );

  const price = variant?.price ?? product.price;
  const salePrice = variant?.salePrice ?? product.salePrice;
  const effectivePrice = salePrice ?? price;
  const stock = variant ? variant.stock : product.stock;
  const soldOut = product.trackInventory && stock <= 0;
  const lowStock =
    product.trackInventory && stock > 0 && stock <= product.lowStockThreshold;

  const images = product.images;
  const current = images[activeImage] ?? images[0] ?? null;

  function onAdd() {
    addItem({
      kind: "product",
      productId: product.id,
      variantId: variant?.id,
      slug: product.slug,
      name: product.name,
      variantLabel: variant?.name,
      image: current?.url ?? null,
      unitPrice: effectivePrice,
      currency: product.currency,
      quantity,
      maxQuantity: product.trackInventory ? stock : null,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-4">
        <Card padding="none" tone="elevated" className="overflow-hidden">
          <div className="relative aspect-square bg-gradient-to-b from-[color:var(--color-surface-muted)] to-white">
            {current ? (
              <Image
                src={current.url}
                alt={current.alt ?? product.name}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-contain p-8"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                <span className="text-4xl opacity-40">📦</span>
                <span className="text-sm font-medium">Image à venir</span>
              </div>
            )}
          </div>
        </Card>

        {images.length > 1 ? (
          <div className="grid grid-cols-5 gap-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveImage(index)}
                aria-label={`Image ${index + 1}`}
                aria-current={index === activeImage}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-xl border-2 bg-[color:var(--color-surface-muted)] transition",
                  index === activeImage
                    ? "border-[color:var(--accent)] shadow-md ring-2 ring-[color:var(--ring-color)]"
                    : "border-[color:var(--color-border)] hover:border-[color:var(--accent)]/50",
                )}
              >
                <Image
                  src={image.url}
                  alt={image.alt ?? ""}
                  fill
                  sizes="10vw"
                  className="object-contain p-1.5"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="space-y-6">
        <div>
          {product.brand ? (
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--accent)]">
              {product.brand.name}
            </p>
          ) : null}
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[color:var(--color-foreground)] sm:text-4xl">
            {product.name}
          </h1>
          {product.shortDescription ? (
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              {product.shortDescription}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          {product.ratingCount > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-900 ring-1 ring-amber-200/80">
              <span aria-hidden className="text-amber-500">
                ★
              </span>
              {product.ratingAverage.toFixed(1)}
              <span className="font-normal text-amber-700/70">({product.ratingCount})</span>
            </span>
          ) : null}
          {product.model ? (
            <span className="rounded-full bg-[color:var(--color-surface-muted)] px-3 py-1 text-xs font-medium text-slate-600">
              Modèle : {product.model}
            </span>
          ) : null}
          {product.sku ? (
            <span className="rounded-full bg-[color:var(--color-surface-muted)] px-3 py-1 text-xs font-medium text-slate-600">
              Réf. {product.sku}
            </span>
          ) : null}
        </div>

        <div className="space-y-2 border-y border-[color:var(--color-border)] py-5">
          <PriceDisplay
            amount={effectivePrice}
            currency={product.currency}
            layout="stack"
            primaryClassName="text-4xl font-black"
            secondaryClassName="text-sm"
          />
          {salePrice !== null && salePrice < price ? (
            <span className="text-lg font-medium text-slate-400 line-through">
              <PriceDisplay amount={price} currency={product.currency} showUsd={false} />
            </span>
          ) : null}
        </div>

        <div>
          {soldOut ? (
            <Badge tone="danger">Rupture de stock</Badge>
          ) : lowStock ? (
            <Badge tone="warning">Plus que {stock} en stock</Badge>
          ) : (
            <Badge tone="success">Disponible</Badge>
          )}
        </div>

        {product.variants.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm font-bold text-[color:var(--color-foreground)]">
              Choisissez une version
            </p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((option) => {
                const optionSoldOut = product.trackInventory && option.stock <= 0;
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={optionSoldOut}
                    onClick={() => {
                      setVariantId(option.id);
                      setQuantity(1);
                    }}
                    className={cn(
                      "rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition",
                      option.id === variantId
                        ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-[color:var(--accent-foreground)] shadow-md"
                        : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-slate-700 hover:border-[color:var(--accent)]/50",
                      optionSoldOut && "cursor-not-allowed opacity-40",
                    )}
                  >
                    {option.name}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-4">
          <QuantityStepper
            value={quantity}
            onDecrease={() => setQuantity((n) => Math.max(1, n - 1))}
            onIncrease={() =>
              setQuantity((n) => (product.trackInventory ? Math.min(stock, n + 1) : n + 1))
            }
            disabledDecrease={quantity <= 1}
            disabledIncrease={product.trackInventory && quantity >= stock}
          />

          <Button size="lg" onClick={onAdd} disabled={soldOut} className="flex-1 sm:flex-none">
            {added ? "Ajouté ✓" : "Ajouter au panier"}
          </Button>

          <Button
            size="lg"
            variant="outline"
            disabled={soldOut}
            onClick={() => {
              onAdd();
              router.push("/panier");
            }}
          >
            Commander
          </Button>
        </div>

        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]/50 p-4">
          <p className="text-sm font-bold text-[color:var(--color-foreground)]">
            Une question sur ce produit ?
          </p>
          <p className="mt-1 text-sm text-muted">{contact.phone}</p>
          <StoreContactActions className="mt-3" subject={product.name} contact={contact} compact />
        </div>

        {product.specs.some((spec) => spec.isKeySpec) ? (
          <Card tone="muted" padding="md">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--accent)]">
              Points clés
            </p>
            <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {product.specs
                .filter((spec) => spec.isKeySpec)
                .map((spec) => (
                  <div key={spec.key} className="flex justify-between gap-3 text-sm">
                    <dt className="text-slate-500">{spec.label}</dt>
                    <dd className="text-right font-bold text-[color:var(--color-foreground)]">
                      {spec.value}
                    </dd>
                  </div>
                ))}
            </dl>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
