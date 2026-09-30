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
 */
export function WorkSection() {
  const [active, setActive] = useState(0);
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "400px" });
  const current = projects[active] ?? projects[0];

  return (
    <section id="work" className="relative w-full overflow-hidden bg-white text-neutral-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 pt-24 pb-2 sm:px-10 lg:px-16">
        <div className="flex items-baseline justify-between gap-6">
          <h2 className="text-3xl font-medium tracking-tighter sm:text-4xl">
            Selected work
          </h2>
          <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-400 tabular-nums">
            {String(active + 1).padStart(2, "0")} — {String(projects.length).padStart(2, "0")}
          </span>
        </div>
        <p className="max-w-xl text-sm leading-relaxed font-light text-neutral-500">
          Scroll, drag or use the arrow keys to move through the row. Click a
          panel to pull it forward; press Escape to send it back.
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
        <p className="text-lg font-medium tracking-tight">{current?.title}</p>
        <p className="text-sm font-light text-neutral-500">
          Case study available on request —{" "}
          <a
            href="#contact"
            className="text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-neutral-900"
          >
            get in touch
          </a>
          .
        </p>
      </div>
    </section>
  );
}
