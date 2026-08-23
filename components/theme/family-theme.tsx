"use client";

import { useEffect } from "react";
import { isFamilySlug } from "@/lib/theme/families";

/**
 * Sets `data-family` on `<html>` so global CSS variables switch per universe.
 * Pass `null` to restore the default Belgian-blue brand theme.
 */
export function FamilyTheme({ family }: { family: string | null | undefined }) {
  useEffect(() => {
    const root = document.documentElement;
    if (family && isFamilySlug(family)) {
      root.dataset.family = family;
    } else {
      delete root.dataset.family;
    }
    return () => {
      delete root.dataset.family;
    };
  }, [family]);

  return null;
}
