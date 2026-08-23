import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  tone?: "default" | "warning" | "success" | "danger";
  href?: string;
}) {
  const tones = {
    default: "border-[color:var(--color-border)] bg-[color:var(--color-surface)]",
    warning: "border-amber-200 bg-amber-50",
    success: "border-emerald-200 bg-emerald-50",
    danger: "border-rose-200 bg-rose-50",
  };

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
        {icon ? (
          <span className="flex size-9 items-center justify-center rounded-xl bg-[color:var(--accent-soft)] text-lg">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-3xl font-black tabular-nums text-[color:var(--color-foreground)]">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </>
  );

  const className = cn(
    "block rounded-2xl border p-5 shadow-sm transition hover:shadow-md",
    tones[tone],
    href && "hover:border-[color:var(--accent)]",
  );

  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}
