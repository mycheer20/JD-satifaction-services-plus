import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Padding = "none" | "sm" | "md" | "lg";
type Tone = "default" | "muted" | "elevated" | "family";

const paddings: Record<Padding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8 sm:p-10",
};

const tones: Record<Tone, string> = {
  default:
    "rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-sm",
  muted:
    "rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]",
  elevated:
    "rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-md",
  family:
    "rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-md ring-1 ring-[color:var(--accent)]/10",
};

export function Card({
  tone = "default",
  padding = "md",
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  tone?: Tone;
  padding?: Padding;
  children: ReactNode;
}) {
  return (
    <div className={cn(tones[tone], paddings[padding], className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string | null;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[color:var(--color-foreground)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 max-w-xl text-sm text-slate-600">{description}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}
