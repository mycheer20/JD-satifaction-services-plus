import {
  formatDualPrice,
  formatStorePrice,
  isHaitiStoreCurrency,
} from "@/lib/store/currency";
import { cn } from "@/lib/utils";

export function PriceDisplay({
  amount,
  currency,
  className,
  primaryClassName,
  secondaryClassName,
  layout = "inline",
  showUsd = true,
}: {
  amount: number | null | undefined;
  currency?: string;
  className?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
  layout?: "inline" | "stack";
  showUsd?: boolean;
}) {
  if (amount === null || amount === undefined) {
    return <span className={className}>—</span>;
  }

  const showDual = showUsd && isHaitiStoreCurrency(currency);
  const dual = showDual ? formatDualPrice(amount) : null;
  const primary = dual?.htg ?? formatStorePrice(amount, currency);

  if (!dual) {
    return <span className={cn(className, primaryClassName)}>{primary}</span>;
  }

  if (layout === "stack") {
    return (
      <span className={cn("inline-flex flex-col items-start gap-0.5", className)}>
        <span className={cn("font-bold text-[color:var(--color-foreground)]", primaryClassName)}>
          {dual.htg}
        </span>
        <span className={cn("text-xs font-medium text-muted", secondaryClassName)}>
          ≈ {dual.usd}
        </span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span className={cn("font-bold text-[color:var(--color-foreground)]", primaryClassName)}>
        {dual.htg}
      </span>
      <span className={cn("text-xs font-medium text-muted", secondaryClassName)}>
        ≈ {dual.usd}
      </span>
    </span>
  );
}
