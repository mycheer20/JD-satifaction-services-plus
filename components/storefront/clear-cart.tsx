"use client";

import { useEffect } from "react";
import { useCart } from "@/features/cart/cart-context";

/** Empties the cart once an order has actually been created. */
export function ClearCartOnMount() {
  const { clear, ready } = useCart();

  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);

  return null;
}
