import { formatGourdes, usdHtgRate, usdHtgRateLabel } from "@/lib/store/currency";
import { cn } from "@/lib/utils";

export function ExchangeRateBar({
  className,
  compact,
}: {
  className?: string;
  compact?: boolean;
}) {
  const rate = usdHtgRate();
  const dateLabel = usdHtgRateLabel();

  return (
    <div
      className={cn(
        "border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]/80 text-[color:var(--color-foreground)]",
        className,
      )}
    >
      <div
        className={cn(
          "page-container flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center",
          compact ? "py-1.5 text-[11px]" : "py-2 text-xs",
        )}
      >
        <span className="font-semibold">
          Taux du jour{dateLabel ? ` (${dateLabel})` : ""} :
        </span>
        <span>
          1 USD = <strong>{formatGourdes(rate, { compact: true })}</strong>
        </span>
        {!compact ? (
          <span className="text-muted">· Prix USD indicatifs sur les produits et au paiement</span>
        ) : null}
      </div>
    </div>
  );
}
