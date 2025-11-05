"use client";
import { useEffect } from "react";

// Finds the hero subtitle "Transform Your Charisma Through Action"
// wraps the words "Charisma" and "Action" in a span that scales them up,
// and adds a little extra top margin to give the main title more space.
export default function HeroFxClient() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("main, body, #__next, #root, .container, .wrapper, .page"))
      .flatMap((root) => Array.from(root.querySelectorAll<HTMLElement>("h2, h3, p, div, span")));

    const target = nodes.find((el) =>
      /\bTransform Your Charisma Through Action\b/i.test(el.textContent || "")
    );

    if (!target) return;

    // Mark as processed so we don't touch it again during hot reloads
    if (target.dataset.fxHeroDone === "1") return;
    target.dataset.fxHeroDone = "1";

    // Add a little spacing from the main title
    target.classList.add("fx-hero-sub");

    // Safely replace only the exact words Charisma / Action with wrapped spans
    const html = target.innerHTML;
    const replaced = html
      // preserve case; we replace only the first match to avoid other sections
      .replace(/\bCharisma\b/, '<span class="fx-bump">Charisma</span>')
      .replace(/\bAction\b/, '<span class="fx-bump">Action</span>');

    target.innerHTML = replaced;
  }, []);

  return null;
}
