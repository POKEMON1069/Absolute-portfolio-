import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatedFolder } from "@/components/ui/3d-folder"
import type { Category, Project } from "@/data/projects"

interface HeroProps {
  projects: Project[]
  onSelectCategory: (category: Category) => void
}

/** One folder per discipline: product, interface, hardware, web. */
const FOLDERS: {
  category: Category
  english: string
  back: string
  front: string
  tab: string
}[] = [
  {
    category: "product",
    english: "Product",
    // periwinkle violet — the front folder in the reference
    back: "oklch(0.66 0.2 285)",
    front: "oklch(0.62 0.21 284)",
    tab: "oklch(0.7 0.17 284)",
  },
  {
    category: "uiux",
    english: "UI / UX",
    // sky blue
    back: "oklch(0.8 0.1 232)",
    front: "oklch(0.76 0.12 232)",
    tab: "oklch(0.84 0.08 232)",
  },
  {
    category: "hardware",
    english: "Hardware",
    // butter yellow
    back: "oklch(0.88 0.11 88)",
    front: "oklch(0.85 0.13 86)",
    tab: "oklch(0.91 0.09 90)",
  },
  {
    category: "web",
    english: "Web",
    // coral
    back: "oklch(0.72 0.16 32)",
    front: "oklch(0.68 0.19 30)",
    tab: "oklch(0.76 0.14 34)",
  },
]

export function Hero({ projects, onSelectCategory }: HeroProps) {
  return (
    <section id="top" className="overflow-hidden px-4 pb-0 pt-11 text-center sm:px-5">
      <h1 className="hero-title select-none">Portfolio</h1>
      <p className="hero-sub mt-5 text-foreground/80">
        Selected work · {projects.length} projects · Class 11 PCM
      </p>

      {/* Animated folders — one per discipline */}
      <div
        className={cn(
          "folder-stage relative mx-auto mt-14 flex max-w-5xl flex-wrap items-start justify-center gap-x-1 gap-y-4 sm:mt-10 sm:gap-y-4",
        )}
      >
        {FOLDERS.map((folder) => {
          const items = projects.filter((p) => p.category === folder.category)
          return (
            <div
              key={folder.category}
              className={cn(
                "relative z-10 flex flex-col items-center",
                // half-width on phones so the four folders form a 2×2 grid
                "w-[calc(50%-2px)] sm:w-auto",
                "[-webkit-tap-highlight-color:transparent]",
              )}
              style={
                {
                  "--folder-back": folder.back,
                  "--folder-front": folder.front,
                  "--folder-tab": folder.tab,
                } as React.CSSProperties
              }
            >
              <AnimatedFolder
                title={folder.english}
                subtitle={`${items.length} ${items.length === 1 ? "project" : "projects"}`}
                projects={items.map((p) => ({ id: p.id, image: p.image, title: p.title }))}
                className="!min-w-0 !p-1 sm:!p-4"
              />
              <button
                onClick={() => onSelectCategory(folder.category)}
                className="group/all -mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] tracking-wide text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                View all {folder.english}
                <ArrowRight className="h-3 w-3 transition-transform group-hover/all:translate-x-0.5" />
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-6 h-4 w-full bg-neutral-200/70" />
      <p className="mt-3 pb-2 text-xs tracking-[0.1em] text-muted-foreground">
        <span className="hidden sm:inline">Hover a folder to see the work · click a card to enlarge ↓</span>
        <span className="sm:hidden">Tap a folder to see the work · tap a card to enlarge ↓</span>
      </p>
    </section>
  )
}
