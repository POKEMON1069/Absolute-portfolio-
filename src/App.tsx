import { useEffect, useState } from "react"
import { Hero } from "@/components/hero"
import { Works } from "@/components/works"
import { About, Footer } from "@/components/about"
import { Button } from "@/components/ui/button"
import { useReveal } from "@/hooks/use-reveal"
import { SITE } from "@/data/site"
import { projects, type Category } from "@/data/projects"

export default function App() {
  const [category, setCategory] = useState<Category | "all">("all")
  const [menuOpen, setMenuOpen] = useState(false)

  useReveal([category])

  // reflect the active filter in the tab title
  useEffect(() => {
    document.title = category === "all" ? SITE.title : `${category.toUpperCase()} — ${SITE.name}`
  }, [category])

  const jumpToWorks = () => {
    document.getElementById("works")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── top bar ── */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-background/85 px-5 py-3.5 backdrop-blur-xl sm:px-7">
        <a href="#top" className="text-[13px] font-medium tracking-tight">
          {SITE.shortName}
        </a>
        <span className="toc-pill hidden sm:inline-block">{SITE.collection}</span>
        <div className="relative">
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-foreground hover:text-background"
          >
            <span
              className="block text-[26px] font-light leading-none transition-transform duration-300"
              style={{ transform: menuOpen ? "rotate(45deg)" : "none" }}
            >
              +
            </span>
          </button>

          {menuOpen && (
            <>
              {/* click-away layer */}
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <nav className="absolute right-0 top-11 z-50 flex min-w-[200px] flex-col rounded-xl border border-border bg-popover p-2 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
                {[
                  { href: "#works", label: "目录 · Works" },
                  { href: "#about", label: "关于 · About" },
                  { href: "#contact", label: "联系 · Contact" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3.5 py-2.5 text-sm transition-colors hover:bg-muted"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </>
          )}
        </div>
      </header>

      <main>
        <Hero
          projects={projects}
          onSelectCategory={(c) => {
            setCategory(c)
            jumpToWorks()
          }}
        />

        <Works
          projects={projects}
          category={category}
          onCategoryChange={setCategory}
          onOpen={(project) => {
            setCategory(project.category)
          }}
        />

        <About />
      </main>

      <Footer />

      {/* skip link for keyboard users */}
      <a
        href="#works"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to work
      </a>

      <noscript>
        <div className="fixed bottom-0 left-0 right-0 bg-foreground p-3 text-center text-sm text-background">
          Please enable JavaScript to use the animated folders and filters.
        </div>
      </noscript>

      {/* kept for parity with the design system; unused buttons stay tree-shaken */}
      <span className="hidden">
        <Button tabIndex={-1} aria-hidden>
          hint
        </Button>
      </span>
    </div>
  )
}
