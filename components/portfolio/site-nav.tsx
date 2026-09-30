"use client";

import {
  useCallback,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

import ImmersiveFullscreenNav from "@/components/ui/immersive-full-screen-nav";
import { BrandAssetsMenu } from "@/components/portfolio/brand-assets";
import { usePrimaryNavA11y, useTranslateGuard } from "@/hooks/use-translate-guard";
import { navImages, navLinks, navSocials, person } from "@/lib/portfolio-data";

/**
 * The site's navigation, built on `ImmersiveFullscreenNav`.
 *
 * Three integration details, all additive — the block's own markup is untouched:
 *
 * 1. `headerClassName` is the component's escape hatch for the fixed header.
 *    `mix-blend-difference` + forced white fills make the header auto-invert
 *    against whatever section it floats over: near-black over the light
 *    hero/work/studio blocks, white over the dark nav panel, contact block and
 *    footer.
 *
 * 2. Links inside the panel: when the panel is driven by the `children` render
 *    prop (needed for the image/social layout) its links don't dismiss the
 *    menu. Hash anchors are intercepted and the panel is closed through the
 *    component's own Escape path — the handler its focus trap already listens
 *    for, so it is a no-op while the panel is closed — then the target section
 *    is scrolled to. Scrolling honours `prefers-reduced-motion`.
 *
 * 3. Right-clicking the logo opens the brand-assets menu (see
 *    `brand-assets.tsx`), so the SVG is reachable from anywhere on the page.
 */
export function SiteNav({ children }: { children?: ReactNode }) {
  const [brandMenu, setBrandMenu] = useState<{
    x: number;
    y: number;
    opener: HTMLElement;
  } | null>(null);

  useTranslateGuard();
  usePrimaryNavA11y();

  const onLinkActivate = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    const anchor = target?.closest?.('a[href^="#"]');
    if (!anchor) return;

    const hash = anchor.getAttribute("href");
    if (!hash || hash === "#") return;

    // No-op when the panel is closed: the Escape listener only exists while
    // the focus trap is active.
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;

    document.getElementById(hash.slice(1))?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, []);

  const onContextMenu = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const header = (event.target as HTMLElement | null)?.closest?.("header");
    if (!header) return;

    const opener = header.querySelector<HTMLElement>("a[href]");
    if (!opener) return;

    event.preventDefault();

    // Clamp to the viewport here, in the handler, rather than reading
    // window.innerWidth during render.
    const width = 264;
    const height = 232;
    const x = Math.max(8, Math.min(event.clientX, window.innerWidth - width - 8));
    const y = Math.max(8, Math.min(event.clientY, window.innerHeight - height - 8));

    setBrandMenu({ x, y, opener });
  }, []);

  return (
    <div onClickCapture={onLinkActivate} onContextMenuCapture={onContextMenu}>
      <ImmersiveFullscreenNav
        navConfig={{
          // Non-breaking space keeps the brand name on one line (see the same
          // treatment on the footer wordmark).
          brand: person.firstName,
          brandHref: "#top",
          overlayBg: "#0b0b0e",
          clipOrigin: "left",
          headerOpenColor: "#ffffff",
          headerClassName:
            "mix-blend-difference [&_a]:text-white! [&_span]:bg-white!",
        }}
        navContent={{
          agencyName: person.name,
          tagline: person.tagline,
          location: person.location,
          links: navLinks,
          images: navImages,
          socials: navSocials,
        }}
      />

      <BrandAssetsMenu
        point={brandMenu}
        returnFocusTo={brandMenu?.opener}
        onClose={() => setBrandMenu(null)}
      />

      {children}
    </div>
  );
}
