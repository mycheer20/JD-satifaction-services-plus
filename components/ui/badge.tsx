import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "accent" | "promo";

const tones: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-700 ring-1 ring-slate-200/80",
  success: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80",
  warning: "bg-amber-100 text-amber-900 ring-1 ring-amber-200/80",
  danger: "bg-rose-100 text-rose-800 ring-1 ring-rose-200/80",
  info: "bg-sky-100 text-sky-800 ring-1 ring-sky-200/80",
  accent: "bg-[color:var(--accent-soft)] text-[color:var(--color-foreground)] ring-1 ring-[color:var(--accent)]/20",
  promo: "bg-rose-600 text-white shadow-sm",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]/60 px-8 py-16 text-center">
      {icon ? (
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-2xl">
          {icon}
        </div>
      ) : null}
      <p className="text-base font-bold text-[color:var(--color-foreground)]">{title}</p>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function Alert({
  tone = "info",
  children,
  className,
}: {
  tone?: "success" | "error" | "info" | "warning";
  children: ReactNode;
  className?: string;
}) {
  const styles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    error: "border-rose-200 bg-rose-50 text-rose-900",
    info: "border-[color:var(--accent)]/20 bg-[color:var(--accent-soft)] text-[color:var(--color-foreground)]",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
  };
  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl border px-4 py-3 text-sm font-medium",
        styles[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageTitle({
  title,
  description,
  className,
}: {
  title: string;
  description?: string | null;
  className?: string;
}) {
  return (
    <header className={cn("mb-8", className)}>
      <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-foreground)] sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-base text-muted">{description}</p>
      ) : null}
    </header>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="block text-xs font-bold uppercase tracking-[0.15em] text-[color:var(--accent)]">
      {children}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100",
        className,
      )}
    />
  );
}

export function QuantityStepper({
  value,
  onDecrease,
  onIncrease,
  disabledDecrease,
  disabledIncrease,
  size = "md",
}: {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  disabledDecrease?: boolean;
  disabledIncrease?: boolean;
  size?: "sm" | "md";
}) {
  const btn = size === "sm" ? "size-8 text-sm" : "size-10 text-base";
  return (
    <div className="inline-flex items-center overflow-hidden rounded-xl border-2 border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-sm">
      <button
        type="button"
        onClick={onDecrease}
        disabled={disabledDecrease}
        aria-label="Diminuer la quantité"
        className={cn(
          btn,
          "font-bold text-slate-600 transition hover:bg-[color:var(--accent-soft)] disabled:opacity-40",
        )}
      >
        −
      </button>
      <span
        className={cn(
          "min-w-10 border-x border-[color:var(--color-border)] text-center font-bold tabular-nums text-[color:var(--color-foreground)]",
          size === "sm" ? "px-2 text-sm" : "px-3 text-base",
        )}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={disabledIncrease}
        aria-label="Augmenter la quantité"
        className={cn(
          btn,
          "font-bold text-slate-600 transition hover:bg-[color:var(--accent-soft)] disabled:opacity-40",
        )}
      >
        +
      </button>
    </div>
  );
}
