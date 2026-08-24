import Image from "next/image";
import Link from "next/link";
import type { ProductCard as ProductCardData } from "@/features/catalog/types";
import { PriceDisplay } from "@/components/storefront/price-display";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";

export function ProductCard({ product }: { product: ProductCardData }) {
  const hasPromo = product.salePrice !== null && product.salePrice < product.price;
  const effectivePrice = product.salePrice ?? product.price;
  const soldOut = product.trackInventory && product.stock <= 0;
  const discount = hasPromo
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  return (
    <article className="motion-card group relative flex flex-col overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-sm hover:border-[color:var(--accent)]/30">
      <Link
        href={`/produit/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-gradient-to-b from-[color:var(--color-surface-muted)] to-white"
      >
        {product.image ? (
          <Image
            src={product.image.url}
            alt={product.image.alt ?? product.name}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 45vw"
            className="object-contain p-5 transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
            <span className="text-3xl opacity-40">📦</span>
            <span className="text-xs font-medium">Image à venir</span>
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {hasPromo ? <Badge tone="promo">-{discount}%</Badge> : null}
          {product.isFeatured ? <Badge tone="accent">Sélection</Badge> : null}
        </div>

        {soldOut ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[2px]">
            <Badge tone="neutral">Rupture de stock</Badge>
          </div>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.brand ? (
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[color:var(--accent)]">
            {product.brand.name}
          </p>
        ) : null}

        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[color:var(--color-foreground)]">
          <Link href={`/produit/${product.slug}`} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>

        {product.ratingCount > 0 ? (
          <p className="flex items-center gap-1 text-xs text-slate-500">
            <span aria-hidden className="text-amber-500">
              ★
            </span>
            <span className="font-semibold text-slate-700">
              {product.ratingAverage.toFixed(1)}
            </span>
            <span className="text-slate-400">({product.ratingCount})</span>
          </p>
        ) : null}

        <div className="mt-auto flex flex-col gap-0.5 border-t border-[color:var(--color-border)] pt-3">
          <PriceDisplay
            amount={effectivePrice}
            currency={product.currency}
            layout="stack"
            primaryClassName="text-lg"
          />
          {hasPromo ? (
            <span className="text-xs font-medium text-slate-400 line-through">
              <PriceDisplay amount={product.price} currency={product.currency} showUsd={false} />
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function ProductRail({
  title,
  description,
  href,
  products,
}: {
  title: string;
  description?: string;
  href?: string;
  products: ProductCardData[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="space-y-6">
      <CardHeader
        title={title}
        description={description}
        action={
          href ? (
            <ButtonLink href={href} variant="soft" size="sm">
              Tout voir →
            </ButtonLink>
          ) : undefined
        }
      />

      <div className="scrollbar-none -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="w-44 shrink-0 snap-start sm:w-auto">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
