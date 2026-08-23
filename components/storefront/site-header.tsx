import Link from "next/link";
import { Suspense } from "react";
import { getFamilyTree } from "@/features/catalog/queries";
import { getSessionUser, isStaff } from "@/features/auth/session";
import { publicEnv, storeLogoInitial } from "@/lib/public-env";
import { FamilyNav, MobileFamilyNav } from "./family-nav";
import { ExchangeRateBar } from "./exchange-rate-bar";
import { SearchBar } from "./search-bar";
import { CartButton } from "./cart-button";
import { ButtonLink } from "@/components/ui/button";

export async function SiteHeader() {
  const [families, user] = await Promise.all([getFamilyTree(), getSessionUser()]);

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]/95 shadow-sm backdrop-blur-md">
      <ExchangeRateBar compact />
      <div className="page-container flex h-[4.25rem] items-center gap-4">
        <MobileFamilyNav families={families} />

        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-[color:var(--accent)] text-sm font-black text-[color:var(--accent-foreground)] shadow-md transition group-hover:scale-105">
            {storeLogoInitial()}
          </span>
          <span className="hidden max-w-[14rem] text-base font-bold leading-tight tracking-tight text-[color:var(--color-foreground)] sm:block lg:max-w-xs">
            {publicEnv.storeName}
          </span>
        </Link>

        <Suspense fallback={<div className="hidden h-11 flex-1 md:block" />}>
          <SearchBar className="hidden flex-1 md:block" />
        </Suspense>

        <div className="ml-auto flex items-center gap-1.5">
          {isStaff(user) ? (
            <ButtonLink
              href="/admin"
              variant="soft"
              size="sm"
              className="hidden sm:inline-flex"
            >
              Admin
            </ButtonLink>
          ) : null}

          <Link
            href={user ? "/compte" : "/connexion"}
            className="inline-flex size-11 items-center justify-center rounded-xl text-slate-700 transition hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring-color)]"
            aria-label={user ? "Mon compte" : "Se connecter"}
          >
            <svg aria-hidden viewBox="0 0 24 24" fill="none" className="size-5">
              <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M4.5 20c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </Link>

          <CartButton />
        </div>
      </div>

      <div className="page-container pb-3 md:hidden">
        <Suspense fallback={<div className="h-11" />}>
          <SearchBar />
        </Suspense>
      </div>

      <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]/50">
        <div className="page-container">
          <FamilyNav families={families} />
        </div>
      </div>
    </header>
  );
}
