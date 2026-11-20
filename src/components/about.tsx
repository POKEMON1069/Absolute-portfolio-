import { Badge } from "@/components/ui/badge"
import { SITE } from "@/data/site"

const FACTS = [
  { label: "Based in", value: SITE.location },
  { label: "Studying", value: SITE.grade },
  { label: "Football club", value: SITE.club },
  { label: "Currently", value: "Building side projects" },
]

export function About() {
  return (
    <section id="about" className="mx-auto max-w-[1100px] px-5 pt-16 sm:px-7">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
        <span className="text-sm font-medium">• 关于 · About</span>
        <Badge>ABOUT ME</Badge>
        <span className="text-sm font-bold">#01</span>
      </div>

      <div className="reveal py-14">
        <p className="max-w-3xl text-2xl font-medium leading-snug tracking-tight sm:text-4xl">
          Hi, I'm {SITE.name} —
          <br />
          a student who builds things on the internet.
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5 text-[15px] leading-[1.9] text-muted-foreground">
            <p>
              I'm in 11th grade studying PCM (Physics, Chemistry, Mathematics) in India, and most of my
              free time goes into technology, coding, football, cricket and gaming. I like taking an idea
              from a rough sketch all the way to something that actually runs.
            </p>
            <p>
              That's meant web apps like <strong className="font-medium text-foreground">SkibidiSpin</strong> and{" "}
              <strong className="font-medium text-foreground">Berty</strong>, interface work like{" "}
              <strong className="font-medium text-foreground">Totem.ui</strong>, and{" "}
              <strong className="font-medium text-foreground">SERENE</strong> — an Arduino-based system that
              monitors physiological signals and sends real-time stress notifications.
            </p>
            <p className="border-l-2 border-foreground/20 pl-4 text-foreground/90">{SITE.goal}</p>
          </div>

          {/* quick facts + interests */}
          <div className="space-y-8">
            <dl className="divide-y divide-border rounded-2xl border border-border">
              {FACTS.map((fact) => (
                <div key={fact.label} className="flex items-baseline justify-between gap-4 px-4 py-3">
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {fact.label}
                  </dt>
                  <dd className="text-[13.5px] font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Interests</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {SITE.interests.map((interest) => (
                  <li
                    key={interest}
                    className="rounded-full border border-border px-3.5 py-1.5 text-[12.5px] text-foreground/80"
                  >
                    {interest}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                What I work with
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {SITE.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full bg-secondary px-3.5 py-1.5 text-[12.5px] font-medium text-secondary-foreground"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* inspiration */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border p-6">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Inspired by · Entrepreneurs
            </p>
            <p className="mt-3 text-xl font-medium tracking-tight">
              {SITE.inspiration.entrepreneurs.join(", ")}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              For turning a dorm-room idea into products used by billions — and for caring about the
              product more than the noise around it.
            </p>
          </div>
          <div className="rounded-2xl border border-border p-6">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Inspired by · Football
            </p>
            <p className="mt-3 text-xl font-medium tracking-tight">
              {SITE.inspiration.footballers.join(" & ")}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Two careers built on relentless discipline and longevity. Supporting {SITE.club} comes with
              its own lessons in patience.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer id="contact" className="mx-auto max-w-[1100px] px-5 pb-16 pt-16 text-center sm:px-7">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-4 text-left">
        <span className="text-sm font-medium">• 联系 · Contact</span>
        <Badge>CONTACT</Badge>
        <span className="text-sm font-bold">#02</span>
      </div>

      <p className="mt-14 text-xl font-semibold">{SITE.name}</p>
      <p className="mt-2.5 text-[13px] tracking-wide text-muted-foreground">
        {SITE.role} · {SITE.location} · Always up for a collaboration
      </p>
      <a
        href={`mailto:${SITE.email}`}
        className="mt-5 inline-block border-b-2 border-foreground pb-0.5 text-lg font-medium transition-opacity hover:opacity-60"
      >
        {SITE.email}
      </a>
      <p className="mt-2 text-[11px] tracking-wide text-muted-foreground/70">
        placeholder address — swap it for your real one in <code>src/data/site.ts</code>
      </p>
      <p className="mt-14 text-xs text-muted-foreground/60">
        © {new Date().getFullYear()} {SITE.name} — Portfolio. Built with React, TypeScript &amp; Tailwind CSS.
      </p>
    </footer>
  )
}
