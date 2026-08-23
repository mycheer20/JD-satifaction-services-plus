import Link from "next/link";
import { cn } from "@/lib/utils";
import { TextLink } from "@/components/ui/link";

export interface Crumb {
  href: string;
  label: string;
}

export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Fil d'Ariane" className={cn("mb-5", className)}>
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <TextLink href="/" variant="breadcrumb">
            Accueil
          </TextLink>
        </li>
        {items.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1">
            <span aria-hidden className="px-0.5 text-slate-300">
              /
            </span>
            <TextLink href={crumb.href} variant="breadcrumb">
              {crumb.label}
            </TextLink>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Compact variant for product pages — last item is current page (not a link). */
export function BreadcrumbsWithCurrent({
  items,
  current,
  className,
}: {
  items: Crumb[];
  current: string;
  className?: string;
}) {
  return (
    <nav aria-label="Fil d'Ariane" className={cn("mb-5", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-xs">
        <li>
          <Link href="/" className="font-medium text-slate-500 transition hover:text-[color:var(--accent)]">
            Accueil
          </Link>
        </li>
        {items.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1">
            <span aria-hidden className="text-slate-300">/</span>
            <Link
              href={crumb.href}
              className="font-medium text-slate-500 transition hover:text-[color:var(--accent)]"
            >
              {crumb.label}
            </Link>
          </li>
        ))}
        <li className="flex items-center gap-1">
          <span aria-hidden className="text-slate-300">/</span>
          <span aria-current="page" className="font-semibold text-[color:var(--color-foreground)]">
            {current}
          </span>
        </li>
      </ol>
    </nav>
  );
}
