import LogoIcon from "@/assets/logo-icon";
import PatternMark from "@/assets/pattern-mark";
import { capabilities, navImages, person } from "@/lib/portfolio-data";

/** Studio / about block — typographic, light, with the brand marks. */
export function StudioSection() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-slate-50 px-6 py-24 text-neutral-900 sm:px-10 lg:px-16"
    >
      <PatternMark className="pointer-events-none absolute -top-32 -left-24 size-[380px] text-neutral-900/[0.04]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-16">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div className="flex min-w-0 flex-col gap-8">
            <div className="flex items-center gap-3">
              <LogoIcon className="size-6 text-neutral-900" />
              <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-600">
                The studio
              </span>
            </div>

            <h2 className="max-w-2xl text-3xl leading-[1.05] font-medium tracking-tighter text-balance sm:text-5xl">
              One practice, from first sketch to shipped build.
            </h2>

            <div className="flex max-w-2xl flex-col gap-5">
              {person.bio.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="text-sm leading-relaxed font-light text-pretty text-neutral-600 sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-light text-neutral-600">
              <span className="inline-flex items-center gap-2">
                {/* Colour is a redundant cue only — the text carries the meaning. */}
                <span
                  className="size-1.5 rounded-full bg-emerald-500"
                  aria-hidden="true"
                />
                Available for Q1&nbsp;projects
              </span>
              <span>{person.location}</span>
            </div>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-elevated">
            {/* Explicit dimensions + lazy loading: no CLS, nothing fetched
                before it is needed. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={navImages[1]}
              alt="Studio workspace: sketches, a display and a laptop mid-project"
              width={900}
              height={1200}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>

        <dl className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((capability) => (
            <div
              key={capability.title}
              className="border-t border-neutral-900/10 pt-5"
            >
              <dt className="text-sm font-medium tracking-tight">
                {capability.title}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed font-light text-pretty text-neutral-600">
                {capability.body}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
