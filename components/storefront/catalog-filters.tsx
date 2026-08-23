"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, type FormEvent } from "react";
import type { CatalogFacets } from "@/features/catalog/types";
import { ATTRIBUTE_PREFIX } from "@/features/catalog/search-params";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckboxField, RadioField, Select, TextInput } from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CatalogFilters({
  facets,
  activeCount,
  scope = {},
}: {
  facets: CatalogFacets;
  activeCount: number;
  scope?: { family?: string; category?: string; subcategory?: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);

  const commit = useCallback(
    (next: URLSearchParams) => {
      next.delete("page");
      const query = next.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const toggleMulti = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      const current = new Set(
        (next.get(key) ?? "").split(",").map((v) => v.trim()).filter(Boolean),
      );
      if (current.has(value)) current.delete(value);
      else current.add(value);

      if (current.size === 0) next.delete(key);
      else next.set(key, [...current].join(","));

      commit(next);
    },
    [commit, params],
  );

  const setSingle = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
      commit(next);
    },
    [commit, params],
  );

  function onPriceSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = new URLSearchParams(params.toString());
    const min = String(form.get("prix_min") ?? "").trim();
    const max = String(form.get("prix_max") ?? "").trim();

    if (min) next.set("prix_min", min);
    else next.delete("prix_min");
    if (max) next.set("prix_max", max);
    else next.delete("prix_max");

    commit(next);
  }

  function clearAll() {
    const next = new URLSearchParams();
    const query = params.get("q");
    const sort = params.get("tri");
    if (query) next.set("q", query);
    if (sort) next.set("tri", sort);
    commit(next);
  }

  const isChecked = (key: string, value: string) =>
    (params.get(key) ?? "").split(",").map((v) => v.trim()).includes(value);

  const panel = (
    <Card tone="default" padding="md" className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-[color:var(--color-foreground)]">Filtres</p>
          {activeCount > 0 ? (
            <Badge tone="accent">{activeCount}</Badge>
          ) : null}
        </div>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold text-[color:var(--accent)] underline-offset-2 hover:underline"
          >
            Tout effacer
          </button>
        ) : null}
      </div>

      <FilterGroup title="Disponibilité">
        <CheckboxField
          label="En stock uniquement"
          checked={params.get("stock") === "1"}
          onChange={(event) => setSingle("stock", event.target.checked ? "1" : null)}
        />
      </FilterGroup>

      <FilterGroup title="Prix">
        <form onSubmit={onPriceSubmit} className="space-y-3">
          <div className="flex items-center gap-2">
            <TextInput
              type="number"
              name="prix_min"
              min={0}
              defaultValue={params.get("prix_min") ?? ""}
              placeholder={String(Math.floor(facets.price.min))}
              aria-label="Prix minimum"
              className="text-center"
            />
            <span className="shrink-0 text-slate-400">—</span>
            <TextInput
              type="number"
              name="prix_max"
              min={0}
              defaultValue={params.get("prix_max") ?? ""}
              placeholder={String(Math.ceil(facets.price.max))}
              aria-label="Prix maximum"
              className="text-center"
            />
          </div>
          <p className="text-xs text-slate-500">
            De {formatPrice(facets.price.min)} à {formatPrice(facets.price.max)}
          </p>
          <Button type="submit" variant="soft" size="sm" className="w-full">
            Appliquer
          </Button>
        </form>
      </FilterGroup>

      <FilterGroup title="Note minimale">
        <div className="space-y-2">
          {[4, 3, 2].map((rating) => (
            <RadioField
              key={rating}
              name="note"
              label={
                <>
                  <span className="text-amber-500" aria-hidden>
                    {"★".repeat(rating)}
                  </span>{" "}
                  {rating} et plus
                </>
              }
              checked={params.get("note") === String(rating)}
              onChange={() => setSingle("note", String(rating))}
            />
          ))}
          {params.get("note") ? (
            <button
              type="button"
              onClick={() => setSingle("note", null)}
              className="text-xs font-semibold text-[color:var(--accent)] hover:underline"
            >
              Retirer
            </button>
          ) : null}
        </div>
      </FilterGroup>

      {facets.brands.length > 0 ? (
        <FilterGroup title="Marque">
          <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
            {facets.brands.map((brand) => (
              <CheckboxField
                key={brand.slug}
                label={
                  <span className="flex w-full items-center justify-between gap-2">
                    <span>{brand.name}</span>
                    <span className="text-xs font-normal text-muted">{brand.count}</span>
                  </span>
                }
                checked={isChecked("marque", brand.slug)}
                onChange={() => toggleMulti("marque", brand.slug)}
              />
            ))}
          </div>
        </FilterGroup>
      ) : null}

      {!scope.family && facets.families.length > 0 ? (
        <FilterGroup title="Famille">
          <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
            {facets.families.map((family) => (
              <CheckboxField
                key={family.slug}
                label={
                  <span className="flex w-full items-center justify-between gap-2">
                    <span>{family.name}</span>
                    <span className="text-xs font-normal text-muted">{family.count}</span>
                  </span>
                }
                checked={isChecked("famille", family.slug)}
                onChange={() => toggleMulti("famille", family.slug)}
              />
            ))}
          </div>
        </FilterGroup>
      ) : null}

      {!scope.category && facets.categories.length > 0 ? (
        <FilterGroup title="Catégorie">
          <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
            {facets.categories.map((category) => (
              <CheckboxField
                key={category.slug}
                label={
                  <span className="flex w-full items-center justify-between gap-2">
                    <span>{category.name}</span>
                    <span className="text-xs font-normal text-muted">{category.count}</span>
                  </span>
                }
                checked={isChecked("cat", category.slug)}
                onChange={() => toggleMulti("cat", category.slug)}
              />
            ))}
          </div>
        </FilterGroup>
      ) : null}

      {!scope.subcategory && facets.subcategories.length > 0 ? (
        <FilterGroup title="Sous-catégorie">
          <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
            {facets.subcategories.map((subcategory) => (
              <CheckboxField
                key={subcategory.slug}
                label={
                  <span className="flex w-full items-center justify-between gap-2">
                    <span>{subcategory.name}</span>
                    <span className="text-xs font-normal text-muted">{subcategory.count}</span>
                  </span>
                }
                checked={isChecked("scat", subcategory.slug)}
                onChange={() => toggleMulti("scat", subcategory.slug)}
              />
            ))}
          </div>
        </FilterGroup>
      ) : null}

      {facets.models.length > 0 ? (
        <FilterGroup title="Modèle">
          <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
            {facets.models.map((model) => (
              <CheckboxField
                key={model.name}
                label={
                  <span className="flex w-full items-center justify-between gap-2">
                    <span>{model.name}</span>
                    <span className="text-xs font-normal text-muted">{model.count}</span>
                  </span>
                }
                checked={isChecked("modele", model.name)}
                onChange={() => toggleMulti("modele", model.name)}
              />
            ))}
          </div>
        </FilterGroup>
      ) : null}

      {facets.attributes.map((attribute) => (
        <FilterGroup key={attribute.key} title={attribute.label}>
          <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
            {attribute.values.map((option) => {
              const key = `${ATTRIBUTE_PREFIX}${attribute.key}`;
              return (
                <CheckboxField
                  key={option.value}
                  label={
                    <span className="flex w-full items-center justify-between gap-2">
                      <span>{option.value}</span>
                      <span className="text-xs font-normal text-slate-400">{option.count}</span>
                    </span>
                  }
                  checked={isChecked(key, option.value)}
                  onChange={() => toggleMulti(key, option.value)}
                />
              );
            })}
          </div>
        </FilterGroup>
      ))}
    </Card>
  );

  return (
    <>
      <Button
        variant="outline"
        className="w-full lg:hidden"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        Filtres{activeCount > 0 ? ` (${activeCount})` : ""}
      </Button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Fermer les filtres"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed inset-x-4 top-24 z-50 max-h-[70vh] overflow-y-auto lg:hidden">
            {panel}
          </aside>
        </>
      ) : null}

      <aside aria-label="Filtres" className="hidden lg:block">
        {panel}
      </aside>
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-[color:var(--color-border)] pt-5 first:border-0 first:pt-0">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--accent)]">
        {title}
      </p>
      {children}
    </div>
  );
}

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  return (
    <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
      <span className="hidden sm:inline">Trier</span>
      <Select
        value={params.get("tri") ?? "relevance"}
        onChange={(event) => {
          const next = new URLSearchParams(params.toString());
          next.set("tri", event.target.value);
          next.delete("page");
          router.push(`${pathname}?${next.toString()}`, { scroll: false });
        }}
        className="h-10 w-auto min-w-[10rem] py-2"
      >
        <option value="relevance">Pertinence</option>
        <option value="newest">Nouveautés</option>
        <option value="price_asc">Prix croissant</option>
        <option value="price_desc">Prix décroissant</option>
        <option value="rating">Mieux notés</option>
        <option value="name">Nom (A-Z)</option>
      </Select>
    </label>
  );
}
