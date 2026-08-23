"use client";

import Link from "next/link";
import { useState } from "react";
import type { AdminNavSection } from "@/lib/admin/nav";
import type { SessionUser } from "@/features/auth/session";
import { AdminSidebar } from "./admin-sidebar";
import { ButtonLink } from "@/components/ui/button";
import { publicEnv, storeLogoInitial } from "@/lib/public-env";
import { cn } from "@/lib/utils";

const ROLE_LABELS = {
  admin: "Administrateur",
  staff: "Équipe",
  customer: "Client",
} as const;

export function AdminShell({
  user,
  sections,
  children,
}: {
  user: SessionUser;
  sections: AdminNavSection[];
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-shell min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="admin-sidebar hidden flex-col border-r border-white/10 lg:flex">
        <AdminBrand />
        <div className="flex-1 overflow-y-auto px-3 py-6">
          <AdminSidebar sections={sections} />
        </div>
        <AdminUserFooter user={user} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <>
          <button
            type="button"
            aria-label="Fermer le menu"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="admin-sidebar fixed inset-y-0 left-0 z-50 flex w-[17rem] flex-col shadow-2xl lg:hidden">
            <AdminBrand onClose={() => setMobileOpen(false)} />
            <div className="flex-1 overflow-y-auto px-3 py-6">
              <AdminSidebar sections={sections} onNavigate={() => setMobileOpen(false)} />
            </div>
            <AdminUserFooter user={user} />
          </aside>
        </>
      ) : null}

      <div className="flex min-w-0 flex-col">
        <header className="admin-topbar sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[color:var(--color-border)] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-lg lg:hidden"
              aria-label="Ouvrir le menu"
              onClick={() => setMobileOpen(true)}
            >
              ☰
            </button>
            <p className="text-sm font-bold text-[color:var(--color-foreground)] lg:hidden">
              Administration
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ButtonLink href="/" variant="outline" size="sm">
              Voir la boutique
            </ButtonLink>
          </div>
        </header>

        <main className="flex-1 bg-[color:var(--color-background)] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminBrand({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 px-4 py-5">
      <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--accent)] text-lg font-black text-white shadow-lg">
          {storeLogoInitial()}
        </span>
        <div className="min-w-0">
          <p className="line-clamp-2 text-xs font-black leading-tight text-white">
            {publicEnv.storeName}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
            Administration
          </p>
        </div>
      </Link>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="size-9 rounded-lg text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Fermer"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}

function AdminUserFooter({ user }: { user: SessionUser }) {
  return (
    <div className="border-t border-white/10 p-4">
      <div className="rounded-xl bg-white/6 p-3">
        <p className="truncate text-sm font-bold text-white">
          {user.fullName ?? user.email}
        </p>
        <p className="truncate text-xs text-white/50">{user.email}</p>
        <p
          className={cn(
            "mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
            user.role === "admin"
              ? "bg-amber-400/20 text-amber-200"
              : "bg-sky-400/20 text-sky-200",
          )}
        >
          {ROLE_LABELS[user.role]}
        </p>
      </div>
    </div>
  );
}
