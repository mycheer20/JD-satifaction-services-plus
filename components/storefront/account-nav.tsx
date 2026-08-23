"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const links = [
  { href: "/compte", label: "Mon profil", exact: true },
  { href: "/compte/notifications", label: "Notifications" },
  { href: "/compte/commandes", label: "Mes commandes" },
  { href: "/compte/demandes", label: "Mes demandes de design" },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Sections du compte">
      <Card padding="sm" tone="muted">
        <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
          {links.map((link) => {
            const active = link.exact
              ? pathname === link.href
              : pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                    active
                      ? "bg-[color:var(--accent)] text-[color:var(--accent-foreground)] shadow-md"
                      : "text-slate-600 hover:bg-[color:var(--color-surface)] hover:text-[color:var(--accent)] hover:shadow-sm",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </Card>
    </nav>
  );
}
