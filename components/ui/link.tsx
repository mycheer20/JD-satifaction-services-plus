import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "muted" | "nav" | "footer" | "breadcrumb";

const variants: Record<Variant, string> = {
  default:
    "font-medium text-[color:var(--accent)] underline decoration-[color:var(--accent)]/30 underline-offset-4 transition hover:decoration-[color:var(--accent)]",
  muted:
    "text-slate-600 transition hover:text-[color:var(--color-foreground)]",
  nav: "rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--color-foreground)]",
  footer: "text-sm text-slate-600 transition hover:text-[color:var(--accent)]",
  breadcrumb:
    "rounded-md px-1.5 py-0.5 text-xs font-medium text-slate-500 transition hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-foreground)]",
};

export function TextLink({
  variant = "default",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cn(variants[variant], className)} {...props} />;
}

export function TextButton({
  variant = "default",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      type="button"
      className={cn(variants[variant], "cursor-pointer bg-transparent", className)}
      {...props}
    />
  );
}
