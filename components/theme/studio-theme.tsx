"use client";

import { useEffect } from "react";

/** Applies the design-studio palette via `[data-family="design"]` on `<html>`. */
export function StudioTheme() {
  useEffect(() => {
    document.documentElement.dataset.family = "design";
    return () => {
      delete document.documentElement.dataset.family;
    };
  }, []);

  return null;
}
