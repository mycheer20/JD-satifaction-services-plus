"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminBadgeCounts, AdminNavItem, AdminNavSection } from "@/lib/admin/nav";
import { cn } from "@/lib/utils";

type NavItemWithBadge = AdminNavItem & { badge?: number };

export function AdminSidebar({
  sections,
  collapsed,
  onNavigate,
}: {
  sections: (Omit<AdminNavSection, "items"> & { items: NavItemWithBadge[] })[];
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Administration" className="flex flex-col gap-6">
      {sections.map((section) => (
        <div key={section.title}>
          {!collapsed ? (
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
              {section.title}
            </p>
          ) : null}
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                      active
                        ? "bg-white/12 text-white shadow-inner"
                        : "text-white/70 hover:bg-white/8 hover:text-white",
                    )}
                  >
                    <span className="text-base" aria-hidden>
                      {item.icon}
                    </span>
                    {!collapsed ? (
                      <>
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        {item.badge != null && item.badge > 0 ? (
                          <span className="rounded-full bg-[color:var(--accent)] px-2 py-0.5 text-[10px] font-bold text-white">
                            {item.badge}
                          </span>
                        ) : null}
                      </>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
