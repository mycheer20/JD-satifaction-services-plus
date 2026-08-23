"use client";

import Link from "next/link";
import { useCart } from "@/features/cart/cart-context";

export function CartButton() {
  const { items, ready } = useCart();
  const count = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link
      href="/panier"
      className="relative inline-flex size-11 items-center justify-center rounded-xl text-slate-700 transition hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring-color)]"
      aria-label={`Panier${count > 0 ? `, ${count} article${count > 1 ? "s" : ""}` : ""}`}
    >
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className="size-5">
        <path
          d="M6 6h15l-1.5 9h-12L6 6Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M6 6 5 3H2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="9.5" cy="19.5" r="1.5" fill="currentColor" />
        <circle cx="17.5" cy="19.5" r="1.5" fill="currentColor" />
      </svg>
      {ready && count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex min-w-[1.125rem] items-center justify-center rounded-full bg-[color:var(--accent)] px-1 text-[10px] font-bold text-[color:var(--accent-foreground)] shadow-md">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
