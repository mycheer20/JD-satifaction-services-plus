import type { ReactNode } from "react";
import type { StatusTone } from "@/lib/admin/labels";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function StatusBadge({
  label,
  tone = "neutral",
  className,
}: {
  label: string;
  tone?: StatusTone;
  className?: string;
}) {
  return (
    <Badge tone={tone} className={cn("whitespace-nowrap", className)}>
      {label}
    </Badge>
  );
}

export function AdminTable({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-sm",
        className,
      )}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function AdminTableElement({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <table className={cn("w-full min-w-[640px] border-collapse text-sm", className)}>
      {children}
    </table>
  );
}

export function AdminTh({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-muted",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function AdminTd({
  children,
  className,
  colSpan,
}: {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      className={cn("border-b border-[color:var(--color-border)] px-4 py-3 align-middle", className)}
    >
      {children}
    </td>
  );
}

export function AdminTr({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <tr className={cn("transition hover:bg-[color:var(--color-surface-muted)]/60", className)}>
      {children}
    </tr>
  );
}

export function AdminToolbar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]/50 px-4 py-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
