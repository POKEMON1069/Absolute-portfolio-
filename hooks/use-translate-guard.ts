"use client";

import { useEffect } from "react";

/**
 * Marks brand-name elements `translate="no"` so browser auto-translate leaves
 * them intact.
 *
 * The brand name is rendered by the vendored blocks (the nav header anchor and
 * the footer's wordmark/brand row), whose markup we don't modify — so the
 * attribute is applied to those exact nodes after mount instead. Selectors are
 * deliberately narrow:
 *
 * - `header a[href]`             → the fixed nav's single anchor (the brand)
 * - `footer a[aria-label$=" home"]` → Footer16's brand link
 * - `footer svg[aria-label]`     → Footer16's wordmark
 * - `[data-brand-mark]`          → anything we mark ourselves
 */
const BRAND_SELECTORS = [
  "header a[href]",
  'footer a[aria-label$=" home"]',
  "footer svg[aria-label]",
  "[data-brand-mark]",
].join(",");

export function useTranslateGuard() {
  useEffect(() => {
    const mark = () => {
      document
        .querySelectorAll<HTMLElement>(BRAND_SELECTORS)
        .forEach((element) => element.setAttribute("translate", "no"));
    };

    mark();

    // The footer is a Motion component whose text can remount on reveal.
    const observer = new MutationObserver(mark);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);
}

/**
 * Gives the vendored nav accurate, state-aware accessible names.
 *
 * `FullscreenNav` renders its overlay as an unlabelled `role="navigation"`
 * landmark and names its hamburger a static "Toggle menu" — neither says what
 * the control will do. Both are corrected here on the live nodes so the block's
 * markup stays untouched:
 *
 * - the primary nav landmark gets `aria-label="Main"`
 * - the hamburger's label follows `aria-expanded` ("Open menu" / "Close menu")
 */
export function usePrimaryNavA11y() {
  useEffect(() => {
    const sync = () => {
      const nav = document.querySelector('nav[role="navigation"]');
      if (nav && !nav.getAttribute("aria-label")) {
        nav.setAttribute("aria-label", "Main");
      }

      const toggle = document.querySelector<HTMLButtonElement>(
        "header button[aria-expanded]",
      );
      if (!toggle) return;
      const open = toggle.getAttribute("aria-expanded") === "true";
      const label = open ? "Close menu" : "Open menu";
      if (toggle.getAttribute("aria-label") !== label) {
        toggle.setAttribute("aria-label", label);
      }
    };

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["aria-expanded"],
    });

    return () => observer.disconnect();
  }, []);
}
