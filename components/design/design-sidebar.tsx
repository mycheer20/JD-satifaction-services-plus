"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DesignNavItem, DesignNavSection } from "@/lib/design/nav";
import { cn } from "@/lib/utils";

export function DesignSidebar({
  sections,
  onNavigate,
}: {
  sections: DesignNavSection[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Design du site" className="flex flex-col gap-6">
      {sections.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <DesignNavLink
                key={item.href}
                item={item}
                active={isActive(pathname, item.href)}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/design") return pathname === "/design";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function DesignNavLink({
  item,
  active,
  onNavigate,
}: {
  item: DesignNavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const content = (
    <>
      <span className="text-base" aria-hidden>
        {item.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate">{item.label}</span>
        {item.description ? (
          <span className="mt-0.5 block truncate text-[11px] font-normal text-white/45">
            {item.description}
          </span>
        ) : null}
      </span>
      {item.badge ? (
        <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70">
          {item.badge}
        </span>
      ) : null}
    </>
  );

  const className = cn(
    "flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
    item.disabled
      ? "cursor-not-allowed text-white/35"
      : active
        ? "bg-white/12 text-white shadow-inner"
        : "text-white/75 hover:bg-white/8 hover:text-white",
  );

  if (item.disabled) {
    return (
      <li>
        <span className={className} aria-disabled="true">
          {content}
        </span>
      </li>
    );
  }

  return (
    <li>
      <Link href={item.href} onClick={onNavigate} className={className}>
        {content}
      </Link>
    </li>
  );
}
