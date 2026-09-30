import Link from "next/link";

const demos = [
  {
    href: "/",
    title: "Portfolio",
    body: "Every block composed into the real site.",
  },
  {
    href: "/demos/immersive-full-screen-nav",
    title: "Immersive Full Screen Nav",
    body: "Clip-path wipe, staggered panel reveal, focus trap.",
  },
  {
    href: "/demos/cinematic-orbit-hero",
    title: "Cinematic Orbit Hero",
    body: "Scroll-driven 3D elliptical card orbit.",
  },
  {
    href: "/demos/liquid-glass-carousel",
    title: "Liquid Glass Carousel",
    body: "Infinite WebGL image row with a liquid-glass lens.",
  },
  {
    href: "/demos/footer16",
    title: "Footer 16",
    body: "Wordmark, link columns and socials over a backdrop.",
  },
];

export const metadata = { title: "Component demos" };

export default function DemosPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-24">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-medium tracking-tighter">
          Component demos
        </h1>
        <p className="max-w-xl text-sm leading-relaxed font-light text-neutral-500">
          Each integrated block, rendered on its own with the props it shipped
          with.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {demos.map((demo) => (
          <li key={demo.href}>
            <Link
              href={demo.href}
              className="flex h-full flex-col gap-2 rounded-xl border border-neutral-200 p-6 transition-colors duration-200 hover:bg-neutral-50"
            >
              <span className="text-base font-medium tracking-tight">
                {demo.title}
              </span>
              <span className="text-sm font-light text-neutral-500">
                {demo.body}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
