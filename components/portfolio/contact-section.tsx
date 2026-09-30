import LogoIcon from "@/assets/logo-icon";
import { person, socialLinks } from "@/lib/portfolio-data";

/** Closing call to action — dark, so the auto-inverting nav header flips to white here. */
export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden bg-[#0b0b0e] px-6 pt-24 pb-20 text-zinc-100 sm:px-10 lg:px-16"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 opacity-40 blur-[120px]"
        aria-hidden="true"
      >
        <div className="mx-auto h-full w-1/2 rounded-full bg-zinc-500/20" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-14">
        <div className="flex items-center gap-3">
          <LogoIcon className="size-6 text-zinc-100" />
          <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-zinc-300">
            Contact
          </span>
        </div>

        <h2 className="max-w-4xl text-4xl leading-[0.98] font-medium tracking-tighter text-balance sm:text-6xl lg:text-7xl">
          Let’s build something
          <span className="text-zinc-400"> worth shipping.</span>
        </h2>

        <div className="flex flex-col gap-10 border-t border-white/10 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <a
            href={`mailto:${person.email}`}
            className="group inline-flex w-fit max-w-full min-w-0 items-center gap-3 text-lg font-medium tracking-tight break-all underline-offset-4 transition-[text-decoration-color] duration-200 ease-out hover:underline hover:decoration-zinc-100 sm:text-2xl sm:break-normal"
          >
            {person.email}
            <span
              className="inline-block transition-transform duration-300 ease-out motion-safe:group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </a>

          <div className="flex flex-col gap-2 sm:items-end">
            <ul className="flex flex-wrap items-center gap-x-6">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className="inline-flex min-h-11 items-center text-sm font-light text-zinc-300 transition-colors duration-200 ease-out hover:text-zinc-50 hover:underline hover:underline-offset-4"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-sm font-light text-zinc-300">
              {person.location}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
