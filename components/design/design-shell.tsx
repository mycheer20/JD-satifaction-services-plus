"use client";

import Link from "next/link";
import { useState } from "react";
import type { SessionUser } from "@/features/auth/session";
import { DESIGN_NAV } from "@/lib/design/nav";
import { publicEnv, storeLogoInitial } from "@/lib/public-env";
import type { UserRole } from "@/types/database";
import { ButtonLink } from "@/components/ui/button";
import { DesignSidebar } from "@/components/design/design-sidebar";

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrateur",
  staff: "Équipe",
  customer: "Client",
  designer: "Designer",
};

export function DesignShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      data-design-panel="true"
      className="design-shell min-h-screen lg:grid lg:grid-cols-[18rem_1fr]"
    >
      <aside className="design-sidebar hidden flex-col border-r border-white/10 lg:flex">
        <DesignBrand />
        <div className="flex-1 overflow-y-auto px-3 py-6">
          <DesignSidebar sections={DESIGN_NAV} />
        </div>
        <DesignUserFooter user={user} />
      </aside>

      {mobileOpen ? (
        <>
          <button
            type="button"
            aria-label="Fermer le menu"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="design-sidebar fixed inset-y-0 left-0 z-50 flex w-[18rem] flex-col shadow-2xl lg:hidden">
            <DesignBrand onClose={() => setMobileOpen(false)} />
            <div className="flex-1 overflow-y-auto px-3 py-6">
              <DesignSidebar sections={DESIGN_NAV} onNavigate={() => setMobileOpen(false)} />
            </div>
            <DesignUserFooter user={user} />
          </aside>
        </>
      ) : null}

      <div className="flex min-w-0 flex-col">
        <header className="design-topbar sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[color:var(--color-border)] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-lg lg:hidden"
              aria-label="Ouvrir le menu"
              onClick={() => setMobileOpen(true)}
            >
              ☰
            </button>
            <div className="lg:hidden">
              <p className="text-sm font-bold text-[color:var(--color-foreground)]">
                Design du site
              </p>
              <p className="text-xs text-muted">{publicEnv.storeName}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {user.role === "admin" ? (
              <ButtonLink href="/admin" variant="outline" size="sm">
                Administration
              </ButtonLink>
            ) : null}
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

function DesignBrand({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 px-4 py-5">
      <Link href="/design" className="flex items-center gap-3" onClick={onClose}>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-lg font-black text-white shadow-lg">
          {storeLogoInitial()}
        </span>
        <div className="min-w-0">
          <p className="line-clamp-2 text-xs font-black leading-tight text-white">
            {publicEnv.storeName}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-violet-200/70">
            Design du site
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

function DesignUserFooter({ user }: { user: SessionUser }) {
  return (
    <div className="border-t border-white/10 px-4 py-4">
      <p className="truncate text-xs font-semibold text-white">{user.email}</p>
      <p className="mt-0.5 text-[11px] text-white/50">{ROLE_LABELS[user.role]}</p>
    </div>
  );
}
