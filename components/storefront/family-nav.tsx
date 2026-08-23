"use client";

import Link from "next/link";
import { useState } from "react";
import type { FamilyNode } from "@/features/catalog/types";
import { getFamilyVisual, isFamilySlug } from "@/lib/theme/families";
import { cn } from "@/lib/utils";
import { TextLink } from "@/components/ui/link";
import { ButtonLink } from "@/components/ui/button";

export function FamilyNav({ families }: { families: FamilyNode[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <nav
      aria-label="Familles de produits"
      className="relative hidden lg:block"
      onMouseLeave={() => setOpenSlug(null)}
    >
      <ul className="flex items-center gap-0.5 py-1">
        {families.map((family) => {
          const visual = isFamilySlug(family.slug) ? getFamilyVisual(family.slug) : null;
          return (
            <li key={family.id}>
              <Link
                href={`/famille/${family.slug}`}
                onMouseEnter={() => setOpenSlug(family.slug)}
                onFocus={() => setOpenSlug(family.slug)}
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold text-slate-700 transition",
                  "hover:bg-[color:var(--color-surface)] hover:text-[color:var(--color-foreground)] hover:shadow-sm",
                  openSlug === family.slug &&
                    "bg-[color:var(--color-surface)] text-[color:var(--color-foreground)] shadow-sm ring-1 ring-[color:var(--color-border)]",
                )}
              >
                {visual ? (
                  <span
                    className={cn("size-2 rounded-full", visual.accent)}
                    aria-hidden
                  />
                ) : null}
                {family.name}
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            href="/services"
            onMouseEnter={() => setOpenSlug(null)}
            className="inline-flex h-11 items-center rounded-xl px-3.5 text-sm font-semibold text-[color:var(--accent)] transition hover:bg-[color:var(--accent-soft)]"
          >
            Services design
          </Link>
        </li>
      </ul>

      {families.map((family) =>
        openSlug === family.slug && family.categories.length > 0 ? (
          <div
            key={`panel-${family.id}`}
            className="absolute left-0 top-full z-40 mt-1 w-[min(64rem,90vw)] overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-xl"
          >
            <div
              className={cn(
                "h-1.5 w-full",
                isFamilySlug(family.slug)
                  ? getFamilyVisual(family.slug)?.accent
                  : "bg-[color:var(--accent)]",
              )}
            />
            <div className="p-6">
              <div className="mb-5 flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-base font-bold text-[color:var(--color-foreground)]">
                    {family.name}
                  </p>
                  {family.description ? (
                    <p className="mt-0.5 text-xs text-slate-500">{family.description}</p>
                  ) : null}
                </div>
                <ButtonLink href={`/famille/${family.slug}`} variant="soft" size="sm">
                  Voir toute la famille
                </ButtonLink>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-5 xl:grid-cols-3">
                {family.categories.map((category) => (
                  <div key={category.id}>
                    <TextLink
                      href={`/categorie/${category.slug}`}
                      variant="default"
                      className="text-sm font-bold no-underline hover:underline"
                    >
                      {category.name}
                    </TextLink>
                    <ul className="mt-2 space-y-1">
                      {category.subcategories.slice(0, 6).map((sub) => (
                        <li key={sub.id}>
                          <Link
                            href={`/sous-categorie/${sub.slug}`}
                            className="text-xs text-slate-600 transition hover:text-[color:var(--accent)]"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                      {category.subcategories.length > 6 ? (
                        <li>
                          <Link
                            href={`/categorie/${category.slug}`}
                            className="text-xs font-semibold text-[color:var(--accent)]"
                          >
                            + {category.subcategories.length - 6} autres
                          </Link>
                        </li>
                      ) : null}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null,
      )}
    </nav>
  );
}

export function MobileFamilyNav({ families }: { families: FamilyNode[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        className="inline-flex size-11 items-center justify-center rounded-xl text-slate-700 transition hover:bg-[color:var(--accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring-color)]"
      >
        <svg aria-hidden viewBox="0 0 24 24" fill="none" className="size-5">
          <path
            d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Fermer le menu"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-x-0 top-full z-50 max-h-[75vh] overflow-y-auto border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-5 shadow-2xl">
            <ul className="space-y-5">
              {families.map((family) => {
                const visual = isFamilySlug(family.slug) ? getFamilyVisual(family.slug) : null;
                return (
                  <li key={family.id}>
                    <Link
                      href={`/famille/${family.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 text-sm font-bold text-[color:var(--color-foreground)]"
                    >
                      {visual ? <span aria-hidden>{visual.icon}</span> : null}
                      {family.name}
                    </Link>
                    <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 pl-7">
                      {family.categories.map((category) => (
                        <li key={category.id}>
                          <Link
                            href={`/categorie/${category.slug}`}
                            onClick={() => setOpen(false)}
                            className="text-xs text-slate-600 hover:text-[color:var(--accent)]"
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
              <li className="border-t border-[color:var(--color-border)] pt-4">
                <Link
                  href="/services"
                  onClick={() => setOpen(false)}
                  className="text-sm font-bold text-[color:var(--accent)]"
                >
                  Services de design
                </Link>
              </li>
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}
