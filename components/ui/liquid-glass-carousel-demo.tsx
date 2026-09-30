"use client";

import { LiquidGlassCarousel } from "@/components/ui/liquid-glass-carousel";

export default function LiquidGlassCarouselDemo() {
  // The carousel needs a container with an explicit height — it renders a
  // full-bleed WebGL canvas into whatever box you give it.
  return (
    <main className="flex min-h-screen w-full items-center bg-white">
      <div className="h-[80svh] min-h-[520px] w-full">
        <LiquidGlassCarousel />
      </div>
    </main>
  );
}
