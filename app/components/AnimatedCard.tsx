"use client";

/**
 * AnimatedCard.tsx
 * One-file solution: alternating slide-in on scroll (left/right), resets on exit,
 * respects prefers-reduced-motion. Use by wrapping any "black card/panel".
 */

import React, { useEffect, useRef } from "react";

type Dir = "left" | "right";

function initAlternatingSlideAnimation(
  el: HTMLElement,
  dir: Dir = "left",
  offsetPx = 20,
  durationMs = 600
): () => void {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Set base styles first (no transition yet → avoids flash/jump)
  const baseOpacity = prefersReduced ? "1" : "0";
  const baseTransform = prefersReduced
    ? "translateX(0px)"
    : `translateX(${dir === "left" ? -offsetPx : offsetPx}px)`;

  el.style.opacity = baseOpacity;
  el.style.transform = baseTransform;
  el.style.willChange = "transform, opacity";
  el.style.transition = "none";

  // Enable transition on next frame
  const rafId = requestAnimationFrame(() => {
    el.style.transition = `opacity ${durationMs}ms ease-out, transform ${durationMs}ms ease-out`;
  });

  // Reduced motion: reveal immediately, no observer
  if (prefersReduced) {
    el.style.opacity = "1";
    el.style.transform = "translateX(0px)";
    return () => {
      cancelAnimationFrame(rafId);
    };
  }

  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    // Fallback for very old browsers
    el.style.opacity = "1";
    el.style.transform = "translateX(0px)";
    return () => {
      cancelAnimationFrame(rafId);
    };
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateX(0px)";
        } else {
          el.style.opacity = "0";
          el.style.transform = `translateX(${dir === "left" ? -offsetPx : offsetPx}px)`;
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  io.observe(el);

  return () => {
    cancelAnimationFrame(rafId);
    io.disconnect();
  };
}

type Props = {
  children: React.ReactNode;
  /** Alternate per item: "left" or "right" */
  direction?: Dir;
  /** Subtle offset (px). Default 20. */
  offsetPx?: number;
  /** Duration (ms). Default 600. */
  durationMs?: number;
  /** Keep your existing styling classes here (e.g., "panel p-5"). */
  className?: string;
  /** Render as a different tag if you want. */
  as?: keyof JSX.IntrinsicElements;
};

export default function AnimatedCard({
  children,
  direction = "left",
  offsetPx = 20,
  durationMs = 600,
  className = "",
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cleanup = initAlternatingSlideAnimation(el, direction, offsetPx, durationMs);
    return cleanup;
  }, [direction, offsetPx, durationMs]);

  // @ts-expect-error: generic HTMLElement ref for arbitrary tag
  return <Tag ref={ref} className={className}>{children}</Tag>;
}
