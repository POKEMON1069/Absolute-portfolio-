"use client";

import { useCallback, type MouseEvent, type ReactNode } from "react";

import ImmersiveFullscreenNav from "@/components/ui/immersive-full-screen-nav";
import { navImages, navLinks, navSocials, person } from "@/lib/portfolio-data";

/**
 * The site's navigation, built on `ImmersiveFullscreenNav`.
 *
 * Two integration details:
 *
 * 1. `headerClassName` is the component's own escape hatch for the fixed
 *    header. `mix-blend-difference` + a forced white fill makes the header
 *    auto-invert against whatever section it floats over: near-black over the
 *    light hero/work/studio blocks, white over the dark nav panel, contact
 *    block and footer. (The component's closed-state colour is fixed black, so
 *    the `!important` utilities are what let the header survive dark sections.)
 *
 * 2. When the panel is driven by the `children` render prop (as below, to get
 *    the full image/social layout), its links don't close the menu the way the
 *    plain `links` list does. Links are therefore intercepted here and the
 *    panel is dismissed through the component's own Escape path — the same
 *    handler the focus trap already listens for — then the anchor is scrolled
 *    to. Programmatic scrolling still works while the component holds
 *    `body { overflow: hidden }`.
 */
export function SiteNav({ children }: { children?: ReactNode }) {
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

    const destination = document.getElementById(hash.slice(1));
    destination?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div onClickCapture={onLinkActivate}>
      <ImmersiveFullscreenNav
        navConfig={{
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
      {children}
    </div>
  );
}
