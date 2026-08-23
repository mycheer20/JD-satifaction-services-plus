"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { SearchSuggestion } from "@/features/catalog/types";
import { suggestionHref } from "@/features/catalog/suggestion-utils";
import { cn } from "@/lib/utils";

const KIND_ICONS: Record<SearchSuggestion["kind"], string> = {
  product: "📦",
  brand: "🏷️",
  category: "📁",
  subcategory: "📂",
  family: "🛍️",
  model: "🔧",
  correction: "✨",
};

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [value, setValue] = useState(params.get("q") ?? "");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/search/suggestions?q=${encodeURIComponent(query.trim())}`,
      );
      const data = (await response.json()) as SearchSuggestion[];
      setSuggestions(data);
      setActiveIndex(data.length > 0 ? 0 : -1);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void fetchSuggestions(value);
    }, 220);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, fetchSuggestions]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function navigate(query: string) {
    const trimmed = query.trim();
    router.push(trimmed ? `/catalogue?q=${encodeURIComponent(trimmed)}` : "/catalogue");
    setOpen(false);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      router.push(suggestionHref(suggestions[activeIndex]));
      setOpen(false);
      return;
    }
    navigate(value);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const showPanel = open && value.trim().length >= 2;

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <form onSubmit={onSubmit} role="search">
        <label htmlFor="site-search" className="sr-only">
          Rechercher un produit, une marque, une catégorie…
        </label>
        <input
          id="site-search"
          type="search"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Produit, marque, catégorie, modèle…"
          autoComplete="off"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          className="input-base h-11 rounded-full bg-[color:var(--color-surface-muted)] pl-12 pr-4 focus:bg-[color:var(--color-surface)]"
        />
        <span className="pointer-events-none absolute left-4 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
          {loading ? (
            <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <svg aria-hidden viewBox="0 0 20 20" fill="none" className="size-3.5">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="m13.5 13.5 3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
        </span>
      </form>

      {showPanel ? (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-xl"
        >
          {suggestions.length === 0 && !loading ? (
            <p className="px-4 py-3 text-sm text-muted">
              Aucune suggestion — essayez une autre orthographe ou un mot-clé plus court.
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {suggestions.map((item, index) => (
                <li key={`${item.kind}-${item.label}-${index}`} role="option" aria-selected={index === activeIndex}>
                  <Link
                    href={suggestionHref(item)}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 text-sm transition",
                      index === activeIndex
                        ? "bg-[color:var(--accent-soft)] text-[color:var(--color-foreground)]"
                        : "hover:bg-[color:var(--color-surface-muted)]",
                    )}
                  >
                    <span className="text-base" aria-hidden>
                      {KIND_ICONS[item.kind]}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{item.label}</span>
                      <span className="block truncate text-xs text-muted">{item.meta}</span>
                    </span>
                    {item.kind === "correction" ? (
                      <span className="shrink-0 rounded-full bg-[color:var(--accent-soft)] px-2 py-0.5 text-[10px] font-bold uppercase text-[color:var(--accent)]">
                        Corrigé
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-[color:var(--color-border)] px-4 py-2 text-xs text-muted">
            Entrée pour rechercher « {value.trim()} » dans tout le catalogue
          </div>
        </div>
      ) : null}
    </div>
  );
}
