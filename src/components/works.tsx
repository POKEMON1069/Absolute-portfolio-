import { useMemo } from "react"
import { ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { categoryLabels, categoryTags, type Category, type Project } from "@/data/projects"

interface WorksProps {
  projects: Project[]
  category: Category | "all"
  onCategoryChange: (category: Category | "all") => void
  onOpen: (project: Project) => void
}

const CATEGORIES: (Category | "all")[] = ["all", "product", "uiux", "hardware", "web"]

export function Works({ projects, category, onCategoryChange, onOpen }: WorksProps) {
  const visible = useMemo(
    () => projects.filter((p) => category === "all" || p.category === category),
    [projects, category],
  )

  return (
    <section id="works" className="mx-auto max-w-[1100px] px-5 pt-16 sm:px-7">
      {/* section header */}
      <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
        <span className="text-sm font-medium">• 目录 · Index</span>
        <Badge className="hidden sm:inline-flex">SELECTED WORK</Badge>
        <span className="text-sm font-bold">{String(visible.length).padStart(2, "0")}</span>
      </div>

      <h2 className="px-2 pb-9 pt-14 text-center text-lg font-medium tracking-[0.14em] sm:text-2xl sm:tracking-[0.22em]">
        PRODUCT&nbsp;&nbsp;-&nbsp;&nbsp;UI&nbsp;/&nbsp;UX&nbsp;&nbsp;-&nbsp;&nbsp;HARDWARE&nbsp;&nbsp;-&nbsp;&nbsp;WEB
      </h2>

      {/* filters */}
      <div className="mb-7 flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((c) => (
          <Button
            key={c}
            size="pill"
            variant={category === c ? "default" : "outline"}
            onClick={() => onCategoryChange(c)}
            className={cn("text-[12.5px] sm:text-[13px]", category === c && "border-primary")}
          >
            {c === "all" ? "全部 All" : categoryLabels[c]}
          </Button>
        ))}
        <span className="w-full text-center text-xs text-muted-foreground sm:w-auto">
          {visible.length} {visible.length === 1 ? "project" : "projects"}
        </span>
      </div>

      {visible.length === 0 ? (
        <p className="py-14 text-center text-sm text-muted-foreground">
          Nothing in this category yet — try another one.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, index) => (
            <Card
              key={project.id}
              className="group reveal cursor-pointer border-border hover:-translate-y-1.5 hover:shadow-[0_24px_45px_rgba(0,0,0,0.12)]"
            >
              <button onClick={() => onOpen(project)} className="block w-full text-left">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading={index < 3 ? "eager" : "lazy"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute bottom-3 left-4 text-[11px] font-semibold tracking-[0.14em] text-white drop-shadow">
                    {categoryTags[project.category]}
                  </span>
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                </div>
                <CardContent className="pb-5">
                  <span className="text-[11px] tracking-[0.16em] text-muted-foreground">
                    {categoryLabels[project.category]}
                  </span>
                  <h3 className="mt-1.5 text-[17px] font-semibold tracking-tight">{project.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                    {project.desc}
                  </p>
                  <span className="mt-3.5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>#{String(index + 1).padStart(2, "0")}</span>
                    <span className="inline-flex items-center gap-1 transition-colors group-hover:text-foreground">
                      View details <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </span>
                </CardContent>
              </button>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
