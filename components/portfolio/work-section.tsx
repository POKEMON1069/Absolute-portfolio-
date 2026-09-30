"use client";

import { useState } from "react";

import { LiquidGlassCarousel } from "@/components/ui/liquid-glass-carousel";
import { useInView } from "@/hooks/use-in-view";
import { projects } from "@/lib/portfolio-data";

/**
 * Selected work — a full-bleed `LiquidGlassCarousel`.
 *
 * The carousel owns its own pointer/wheel/keyboard model (wheel or drag moves
 * the row, click focuses a panel, ←/→ step, Esc closes), so this wrapper only
 * supplies the data, the chrome around it, and mirrors the active index out.
 *
 * The carousel is mounted once the section is within 400px of the viewport:
 * that keeps a WebGL context out of the initial page load, and lets the
 * component's built-in rise-and-grow entry play exactly when the visitor
 * arrives instead of finishing off-screen.
 *
 * Known constraint: the active panel is *not* persisted in the URL. The block
 * exposes `onActiveChange` but no `initialIndex`/`goTo` prop, so a query param
 * could not be restored on load without remounting (and replaying) the whole
 * scene. The section itself is deep-linkable at `#work`.
 */
export function WorkSection() {
  const [active, setActive] = useState(0);
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "400px" });
  const current = projects[active] ?? projects[0];

  // Empty state: render nothing rather than a broken caption under a dead row.
  if (projects.length === 0) return null;

  return (
    <section
      id="work"
      className="relative w-full overflow-hidden bg-white text-neutral-900"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 pt-24 pb-2 sm:px-10 lg:px-16">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          {/* h2 follows the hero's h1; see HeroIntro. */}
          <h2 className="text-3xl font-medium tracking-tighter text-balance sm:text-4xl">
            Selected work
          </h2>
          <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-600 tabular-nums">
            {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
        </div>
        <p className="max-w-xl text-sm leading-relaxed font-light text-pretty text-neutral-600">
          Scroll, drag or use ←/→ to move the row. Select a panel to focus it,
          then press Escape to close.
        </p>
      </div>

      <div ref={ref} className="h-[74svh] min-h-[520px] w-full">
        {inView ? (
          <LiquidGlassCarousel
            items={projects}
            panelHeight={470}
            gap={12}
            background="#ffffff"
            entry
            onActiveChange={setActive}
          />
        ) : (
          // Reserves the exact box the carousel will occupy, so mounting it
          // doesn't shift anything below.
          <div className="h-full w-full" aria-hidden="true" />
        )}
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 pb-24 sm:px-10 lg:px-16">
        <p className="text-lg font-medium tracking-tight text-pretty">
          {current?.title}
        </p>
        <a
          href="#contact"
          className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-medium text-neutral-900 underline-offset-4 transition-[text-decoration-color] duration-200 ease-out hover:underline hover:decoration-neutral-900"
        >
          Request the full case study
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
