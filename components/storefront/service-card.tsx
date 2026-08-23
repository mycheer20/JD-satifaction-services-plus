import Link from "next/link";
import { getServiceVisual } from "@/lib/theme/services";
import { PriceDisplay } from "@/components/storefront/price-display";
import { publicEnv } from "@/lib/public-env";
import { cn } from "@/lib/utils";

type ServiceCardProps = {
  slug: string;
  name: string;
  tagline: string | null;
  description?: string | null;
  deliveryTime?: string | null;
  basePrice?: number | null;
  priceNote?: string | null;
  currency?: string;
  featured?: boolean;
  className?: string;
  variant?: "grid" | "compact";
};

export function ServiceCard({
  slug,
  name,
  tagline,
  description,
  deliveryTime,
  basePrice,
  priceNote,
  currency = publicEnv.currency,
  featured,
  className,
  variant = "grid",
}: ServiceCardProps) {
  const visual = getServiceVisual(slug);

  return (
    <Link
      href={`/service/${slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-sm transition",
        "hover:-translate-y-0.5 hover:border-[color:var(--accent)]/40 hover:shadow-lg",
        variant === "compact" ? "p-4" : "p-6",
        className,
      )}
    >
      {featured ? (
        <span className="absolute right-4 top-4 rounded-full bg-[color:var(--accent)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[color:var(--accent-foreground)]">
          Populaire
        </span>
      ) : null}

      <span
        className={cn(
          "inline-flex size-12 items-center justify-center rounded-2xl text-2xl shadow-sm transition group-hover:scale-105",
          visual.chip,
        )}
        aria-hidden
      >
        {visual.icon}
      </span>

      <div className="mt-4 flex-1">
        <p className="text-xs font-bold uppercase tracking-wider text-[color:var(--accent)]">
          {visual.keyword}
        </p>
        <h3 className="mt-1 text-base font-bold text-[color:var(--color-foreground)] group-hover:text-[color:var(--accent)]">
          {name}
        </h3>
        {tagline ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{tagline}</p>
        ) : null}
        {variant === "grid" && description ? (
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-500">
            {description}
          </p>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[color:var(--color-border)] pt-4 text-xs">
        {deliveryTime ? (
          <span className="font-medium text-slate-500">⏱ {deliveryTime}</span>
        ) : (
          <span />
        )}
        <span className="font-bold text-[color:var(--color-foreground)]">
          {basePrice != null ? (
            <PriceDisplay amount={basePrice} currency={currency} layout="stack" />
          ) : (
            (priceNote ?? "Sur devis")
          )}
        </span>
      </div>
    </Link>
  );
}
