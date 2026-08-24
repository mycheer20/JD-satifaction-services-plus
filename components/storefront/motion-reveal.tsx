"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type MotionRevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Délai échelonné pour les grilles (index × stagger ms). */
  delayMs?: number;
};

function isScrollRevealEnabled(): boolean {
  if (typeof document === "undefined") return false;
  const root = document.documentElement;
  if (root.getAttribute("data-motion") === "off") return false;
  return root.getAttribute("data-motion-scroll-reveal") === "on";
}

/**
 * Apparition progressive au défilement. Respecte prefers-reduced-motion
 * et les paramètres publiés via data-motion-scroll-reveal sur html.
 */
export function MotionReveal({ children, className, delayMs = 0 }: MotionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !isScrollRevealEnabled()) {
      node.classList.add("motion-reveal-visible");
      return;
    }

    if (delayMs > 0) {
      node.style.setProperty("--motion-reveal-delay", `${delayMs}ms`);
    }

    node.classList.add("motion-reveal-pending");
    node.classList.remove("motion-reveal-visible");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          node.classList.add("motion-reveal-visible");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <div ref={ref} className={cn("motion-reveal", className)}>
      {children}
    </div>
  );
}
