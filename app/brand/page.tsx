import type { Metadata } from "next";
import Link from "next/link";

import LogoIcon from "@/assets/logo-icon";
import PatternMark from "@/assets/pattern-mark";
import { CopySvgButton } from "@/components/portfolio/brand-assets";
import { LOGO_COLOR } from "@/assets/logo-icon";

export const metadata: Metadata = {
  title: "Brand assets",
  description:
    "Download the Aayushman Chandra logo marks as SVG — primary spark mark and secondary lattice block.",
};

const tokens = [
  { name: "Mark grey", value: LOGO_COLOR },
  { name: "Surface (light)", value: "#f8fafc" },
  { name: "Surface (dark)", value: "#0b0b0e" },
  { name: "Accent", value: "#f43f5e" },
];

const downloadClass =
  "inline-flex min-h-11 items-center rounded-full bg-neutral-900 px-5 text-sm font-medium text-slate-50 transition-colors duration-200 ease-out hover:bg-neutral-800 active:bg-neutral-950";

export default function BrandAssetsPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 py-32 sm:px-10">
      <header className="flex flex-col gap-4">
        <Link
          href="/"
          className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-medium text-neutral-600 transition-colors duration-200 ease-out hover:text-neutral-900"
        >
          <span aria-hidden="true">←</span>
          Back to portfolio
        </Link>
        <h1 className="text-4xl font-medium tracking-tighter text-balance sm:text-5xl">
          Brand assets
        </h1>
        <p className="max-w-xl text-sm leading-relaxed font-light text-pretty text-neutral-600 sm:text-base">
          The two supplied marks, as SVG. Right-click the logo in the site
          header anywhere on the site for the same shortcuts.
        </p>
      </header>

      <section className="flex flex-col gap-8">
        <h2 className="text-lg font-medium tracking-tight">The marks</h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <article className="flex flex-col gap-5 rounded-2xl border border-neutral-200 p-6">
            <div className="flex items-center gap-4">
              <span className="flex size-16 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-black/5">
                <LogoIcon className="size-10 text-neutral-900" />
              </span>
              <span className="flex size-16 items-center justify-center rounded-xl bg-[#0b0b0e] ring-1 ring-white/10">
                <LogoIcon className="size-10 text-zinc-100" />
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-medium tracking-tight">
                Primary mark
              </h3>
              <p className="text-sm font-light text-neutral-600">
                Four-point spark with notched corners. Use at 24&nbsp;px or
                larger; keep it clear of other elements.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/logo-icon.svg"
                download="aayushman-chandra-mark.svg"
                className={downloadClass}
              >
                Download SVG
              </a>
              <CopySvgButton href="/logo-icon.svg" label="Primary mark" />
            </div>
          </article>

          <article className="flex flex-col gap-5 rounded-2xl border border-neutral-200 p-6">
            <div className="flex items-center gap-4">
              <span className="flex size-16 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-black/5">
                <PatternMark className="size-10 text-neutral-900" />
              </span>
              <span className="flex size-16 items-center justify-center rounded-xl bg-[#0b0b0e] ring-1 ring-white/10">
                <PatternMark className="size-10 text-zinc-100" />
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-medium tracking-tight">
                Secondary mark
              </h3>
              <p className="text-sm font-light text-neutral-600">
                Lattice block used as an oversized, low-opacity ornament behind
                sections.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/pattern-mark.svg"
                download="aayushman-chandra-pattern.svg"
                className={downloadClass}
              >
                Download SVG
              </a>
              <CopySvgButton href="/pattern-mark.svg" label="Secondary mark" />
            </div>
          </article>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-medium tracking-tight">Colour</h2>
        <dl className="grid gap-4 sm:grid-cols-4">
          {tokens.map((token) => (
            <div
              key={token.name}
              className="flex flex-col gap-2 border-t border-neutral-900/10 pt-4"
            >
              <dt className="text-sm font-light text-neutral-600">
                {token.name}
              </dt>
              <dd
                className="text-sm font-medium tracking-tight tabular-nums"
                translate="no"
              >
                {token.value.toUpperCase()}
              </dd>
            </div>
          ))}
        </dl>
        <p className="max-w-xl text-sm leading-relaxed font-light text-pretty text-neutral-600">
          Both marks inherit the surrounding text colour, so one file covers
          every surface — <span translate="no">{LOGO_COLOR}</span> on light
          backgrounds, white on dark.
        </p>
      </section>
    </main>
  );
}
