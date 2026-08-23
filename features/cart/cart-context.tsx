"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { computeTotals, lineIdFor, type CartItem, type CartTotals } from "./types";
import { publicEnv } from "@/lib/public-env";

/**
 * Cart state lives in localStorage, which is treated as the single source of
 * truth and read through `useSyncExternalStore`. Two tabs therefore stay in
 * sync for free, and there is no hydration flash to patch up in an effect.
 *
 * The prices stored here exist only to render the cart. Checkout sends
 * identifiers and quantities, and `place_order()` re-derives every amount from
 * the database, so a tampered localStorage entry cannot change what is charged.
 */

const STORAGE_KEY = "tygeestore.cart.v1";
const EMPTY: CartItem[] = [];

const listeners = new Set<() => void>();

// `getSnapshot` must return a stable reference between calls or React will
// re-render forever, so the parsed value is memoised against the raw string.
let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY;

function parse(raw: string | null): CartItem[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter(
      (item): item is CartItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as CartItem).lineId === "string" &&
        typeof (item as CartItem).quantity === "number",
    );
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): CartItem[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedItems = parse(raw);
  }
  return cachedItems;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function write(next: CartItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  // The `storage` event only fires in *other* tabs, so this tab is told directly.
  for (const listener of listeners) listener();
}

function update(mutate: (current: CartItem[]) => CartItem[]) {
  write(mutate(getSnapshot()));
}

interface CartContextValue {
  items: CartItem[];
  /** False during server render and hydration, so the UI can avoid a flash. */
  ready: boolean;
  totals: CartTotals;
  addItem: (item: Omit<CartItem, "lineId">, quantity?: number) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const noopSubscribe = () => () => {};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const addItem = useCallback((item: Omit<CartItem, "lineId">, quantity = 1) => {
    const lineId = lineIdFor(item);
    update((current) => {
      const existing = current.find((i) => i.lineId === lineId);
      if (!existing) {
        return [...current, { ...item, lineId, quantity: Math.max(quantity, 1) }];
      }
      const max = existing.maxQuantity ?? Number.POSITIVE_INFINITY;
      return current.map((i) =>
        i.lineId === lineId
          ? { ...i, quantity: Math.min(i.quantity + quantity, max) }
          : i,
      );
    });
  }, []);

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    update((current) =>
      quantity <= 0
        ? current.filter((i) => i.lineId !== lineId)
        : current.map((i) =>
            i.lineId === lineId
              ? { ...i, quantity: Math.min(quantity, i.maxQuantity ?? quantity) }
              : i,
          ),
    );
  }, []);

  const removeItem = useCallback((lineId: string) => {
    update((current) => current.filter((i) => i.lineId !== lineId));
  }, []);

  const clear = useCallback(() => write(EMPTY), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      totals: computeTotals(items, publicEnv.currency),
      addItem,
      setQuantity,
      removeItem,
      clear,
    }),
    [items, ready, addItem, setQuantity, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé à l'intérieur de <CartProvider>");
  }
  return context;
}
