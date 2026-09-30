import LogoIcon from "@/assets/logo-icon";
import PatternMark from "@/assets/pattern-mark";
import { person } from "@/lib/portfolio-data";

/**
 * Opening statement — sits between the fixed nav and `CinematicOrbitHero`.
 * Light (`bg-slate-50`) so it flows straight into the hero's own light theme
 * without a visible seam.
 */
export function HeroIntro() {
  return (
    <section
      id="top"
      className="relative flex min-h-[92svh] w-full flex-col justify-between overflow-hidden bg-slate-50 px-6 pt-32 pb-12 text-neutral-900 sm:px-10 lg:px-16"
    >
      {/* Decorative lattice from the supplied secondary asset. */}
      <PatternMark className="pointer-events-none absolute -right-24 -bottom-24 size-[420px] text-neutral-900/[0.04] sm:-right-16" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-10">
        <div className="flex items-center gap-3">
          <LogoIcon className="size-7 text-neutral-900" />
          <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">
            {person.role}
          </span>
        </div>

        <h1 className="max-w-5xl text-[13vw] leading-[0.86] font-medium tracking-tighter sm:text-[9vw] lg:text-[7.5vw]">
          {person.firstName}
          <br />
          <span className="text-neutral-400">{person.lastName}</span>
        </h1>

        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xl text-sm leading-relaxed font-light text-neutral-600 sm:text-base">
            {person.intro}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="inline-flex h-11 items-center rounded-full bg-neutral-900 px-6 text-sm font-medium text-slate-50 transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0"
            >
              Selected work
            </a>
            <a
              href={`mailto:${person.email}`}
              className="inline-flex h-11 items-center rounded-full px-6 text-sm font-medium text-neutral-900 ring-1 ring-neutral-900/15 transition-colors duration-200 ease-out hover:bg-neutral-900/5"
            >
              {person.email}
            </a>
          </div>
        </div>
      </div>

      <dl className="relative mx-auto mt-16 grid w-full max-w-7xl grid-cols-2 gap-x-6 gap-y-8 border-t border-neutral-900/10 pt-8 lg:grid-cols-4">
        {person.stats.map((stat) => (
          <div key={stat.label}>
            <dt className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
              {stat.label}
            </dt>
            <dd className="mt-2 text-2xl font-medium tracking-tight">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="relative mx-auto mt-10 flex w-full max-w-7xl items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-400">
        <span className="h-px w-10 bg-neutral-300" />
        Scroll
      </div>
    </section>
  );
}
