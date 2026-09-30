import LogoIcon from "@/assets/logo-icon";
import PatternMark from "@/assets/pattern-mark";
import { person } from "@/lib/portfolio-data";

/**
 * Opening statement — the page's first section and the target of the
 * "Skip to content" link, hence `tabIndex={-1}` so it can receive focus.
 *
 * Light (`bg-slate-50`) so it flows straight into the hero's own light theme
 * without a visible seam. Headings are `text-balance`d and counts are set in
 * `tabular-nums`; contrast is held at AA for every text size (neutral-600 and
 * darker on the slate-50 surface).
 */
export function HeroIntro() {
  return (
    <section
      id="top"
      tabIndex={-1}
      className="relative flex min-h-[92svh] w-full flex-col justify-between overflow-hidden bg-slate-50 px-6 pt-32 pb-12 text-neutral-900 sm:px-10 lg:px-16"
    >
      {/* Decorative lattice from the supplied secondary asset. */}
      <PatternMark className="pointer-events-none absolute -right-24 -bottom-24 size-[420px] text-neutral-900/[0.04] sm:-right-16" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-10">
        <div className="flex items-center gap-3">
          <LogoIcon className="size-7 text-neutral-900" />
          <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-600">
            {person.role}
          </span>
        </div>

        {/* translate="no": a name, not prose — keep auto-translate off it. */}
        <h1
          translate="no"
          className="max-w-5xl text-[13vw] leading-[0.86] font-medium tracking-tighter sm:text-[9vw] lg:text-[7.5vw]"
        >
          {person.firstName}
          <br />
          <span className="text-neutral-500">{person.lastName}</span>
        </h1>

        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xl text-sm leading-relaxed font-light text-pretty text-neutral-600 sm:text-base">
            {person.intro}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="inline-flex min-h-11 items-center rounded-full bg-neutral-900 px-6 text-sm font-medium text-slate-50 shadow-sm shadow-neutral-900/20 ring-1 ring-neutral-900/10 transition-[transform,background-color] duration-200 ease-out motion-safe:hover:-translate-y-0.5 hover:bg-neutral-800 active:translate-y-0 active:bg-neutral-950"
            >
              View selected work
            </a>
            <a
              href={`mailto:${person.email}`}
              className="inline-flex min-h-11 items-center rounded-full px-6 text-sm font-medium text-neutral-900 ring-1 ring-neutral-900/15 transition-colors duration-200 ease-out hover:bg-neutral-900/5 active:bg-neutral-900/10"
            >
              Email me
            </a>
          </div>
        </div>
      </div>

      <dl className="relative mx-auto mt-16 grid w-full max-w-7xl grid-cols-2 gap-x-6 gap-y-8 border-t border-neutral-900/10 pt-8 lg:grid-cols-4">
        {person.stats.map((stat) => (
          <div key={stat.label}>
            <dt className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-600">
              {stat.label}
            </dt>
            <dd className="mt-2 text-2xl font-medium tracking-tight tabular-nums">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="relative mx-auto mt-10 flex w-full max-w-7xl items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-600">
        <span className="h-px w-10 bg-neutral-300" aria-hidden="true" />
        Scroll
      </div>
    </section>
  );
}
