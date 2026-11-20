"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState, forwardRef } from "react"
import type React from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

/* ────────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────────── */
export interface FolderProject {
  id: string
  image: string
  title: string
}

interface AnimatedFolderProps {
  title: string
  projects: FolderProject[]
  className?: string
  /** optional line under the title, e.g. a year range */
  subtitle?: string
  /** extra content rendered under the front folder (e.g. the paper card) */
  children?: React.ReactNode
}

/* ────────────────────────────────────────────────────────────
   AnimatedFolder
   ──────────────────────────────────────────────────────────── */
export function AnimatedFolder({
  title,
  projects,
  className,
  subtitle,
  children,
}: AnimatedFolderProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const open = isHovered || isPinned
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null)
  const [hiddenCardId, setHiddenCardId] = useState<string | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const visibleProjects = projects.slice(0, 3)

  const setHover = (next: boolean) => setIsHovered(next)

  const handleProjectClick = (project: FolderProject, index: number) => {
    const cardEl = cardRefs.current[index]
    if (cardEl) setSourceRect(cardEl.getBoundingClientRect())
    setSelectedIndex(index)
    setHiddenCardId(project.id)
  }

  const handleCloseLightbox = () => {
    setSelectedIndex(null)
    setSourceRect(null)
  }

  const handleCloseComplete = () => {
    setHiddenCardId(null)
  }

  // Keep the lightbox mounted while it slides: `isOpen` is derived from
  // selectedIndex, so the close->reopen dance would unmount mid-navigation.
  const handleNavigate = (newIndex: number) => {
    setSelectedIndex(newIndex)
    setHiddenCardId(visibleProjects[newIndex]?.id ?? null)
  }

  // keyboard users get the same reveal as hover
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHover(false)
  }

  return (
    <>
      <div
        className={cn(
          "group relative flex cursor-pointer flex-col items-center justify-center",
          "rounded-2xl border border-transparent p-6 transition-all duration-500 ease-out",
          className,
        )}
        style={{
          minWidth: "var(--folder-min, 240px)",
          minHeight: "var(--folder-min-h, 300px)",
          perspective: "1000px",
        }}
        onPointerEnter={(e) => {
          if (e.pointerType !== "touch") setHover(true)
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== "touch") setHover(false)
        }}
        onFocus={() => setHover(true)}
        onBlur={handleBlur}
        onClick={(e) => {
          // on touch there is no hover: a tap pins the folder open, a second tap closes it.
          // mouse clicks keep the pure hover behaviour.
          const pointerType = (e.nativeEvent as PointerEvent).pointerType
          if (pointerType === "touch" || pointerType === "pen") {
            setIsPinned((p) => !p)
          }
        }}
      >
        {/* soft accent glow on hover */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(circle at 50% 72%, var(--accent) 0%, transparent 70%)",
            opacity: open ? 0.1 : 0,
          }}
        />

        {/* stage — sizes come from CSS vars so the whole folder scales down on phones */}
        <div
          className="folder-stage relative z-10 mb-3 flex items-center justify-center"
          style={{ height: "var(--stage-h)", width: "var(--stage-w)" }}
        >
          {/* folder back */}
          <div
            className="pointer-events-none absolute rounded-lg bg-folder-back shadow-md"
            style={{
              width: "var(--folder-w)",
              height: "var(--folder-h)",
              transformOrigin: "bottom center",
              transform: open ? "rotateX(-15deg)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 10,
            }}
          />

          {/* folder tab */}
          <div
            className="absolute rounded-t-md bg-folder-tab"
            style={{
              width: "calc(var(--folder-w) * 0.375)",
              height: "calc(var(--folder-h) * 0.1667)",
              top: "calc(50% - var(--folder-h) / 2 - var(--folder-h) * 0.1667)",
              left: "calc(50% - var(--folder-w) / 2 + var(--folder-w) * 0.125)",
              transformOrigin: "bottom center",
              transform: open ? "rotateX(-25deg) translateY(-2px)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 10,
            }}
          />

          {/* project cards, revealed between back and front */}
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 20,
              pointerEvents: open ? "auto" : "none",
              cursor: "pointer",
            }}
          >
            {visibleProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                ref={(el) => {
                  cardRefs.current[index] = el
                }}
                image={project.image}
                title={project.title}
                delay={index * 80}
                isVisible={open}
                index={index}
                onClick={() => handleProjectClick(project, index)}
                isSelected={hiddenCardId === project.id}
              />
            ))}
          </div>

          {/* folder front */}
          <div
            className="pointer-events-none absolute rounded-lg bg-folder-front shadow-lg"
            style={{
              width: "var(--folder-w)",
              height: "var(--folder-h)",
              top: "calc(50% - var(--folder-h) / 2 + 4px)",
              transformOrigin: "bottom center",
              transform: open ? "rotateX(25deg) translateY(8px)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 30,
            }}
          />

          {/* folder shine */}
          <div
            className="pointer-events-none absolute overflow-hidden rounded-lg"
            style={{
              width: "var(--folder-w)",
              height: "var(--folder-h)",
              top: "calc(50% - var(--folder-h) / 2 + 4px)",
              background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
              transformOrigin: "bottom center",
              transform: open ? "rotateX(25deg) translateY(8px)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 31,
            }}
          />
        </div>

        {children}

        <h3
          className="mt-3 text-base font-semibold tracking-tight text-foreground transition-transform duration-300"
          style={{ transform: open ? "translateY(4px)" : "translateY(0)" }}
        >
          {title}
        </h3>

        <p
          className="text-xs tracking-wide text-muted-foreground transition-opacity duration-300"
          style={{ opacity: open ? 0.7 : 1 }}
        >
          {subtitle ?? `${projects.length} projects`}
        </p>
      </div>

      <ImageLightbox
        projects={visibleProjects}
        currentIndex={selectedIndex ?? 0}
        isOpen={selectedIndex !== null}
        onClose={handleCloseLightbox}
        sourceRect={sourceRect}
        onCloseComplete={handleCloseComplete}
        onNavigate={handleNavigate}
      />
    </>
  )
}

/* ────────────────────────────────────────────────────────────
   ImageLightbox
   ──────────────────────────────────────────────────────────── */
interface ImageLightboxProps {
  projects: FolderProject[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  sourceRect: DOMRect | null
  onCloseComplete?: () => void
  onNavigate: (index: number) => void
}

export function ImageLightbox({
  projects,
  currentIndex,
  isOpen,
  onClose,
  sourceRect,
  onCloseComplete,
  onNavigate,
}: ImageLightboxProps) {
  const [animationPhase, setAnimationPhase] = useState<"initial" | "animating" | "complete">("initial")
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [internalIndex, setInternalIndex] = useState(currentIndex)
  const totalProjects = projects.length
  const hasNext = internalIndex < totalProjects - 1
  const hasPrev = internalIndex > 0

  const currentProject = projects[internalIndex]

  // Single-motion slide: commit the index immediately and let the strip
  // transition to the new offset (no out/in two-phase, no mid-way unmount).
  useEffect(() => {
    if (isOpen && currentIndex !== internalIndex) setInternalIndex(currentIndex)
  }, [currentIndex, internalIndex, isOpen])

  useEffect(() => {
    if (isOpen) setInternalIndex(currentIndex)
    // only when the lightbox opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const navigateNext = useCallback(() => {
    if (internalIndex >= totalProjects - 1) return
    onNavigate(internalIndex + 1)
  }, [internalIndex, totalProjects, onNavigate])

  const navigatePrev = useCallback(() => {
    if (internalIndex <= 0) return
    onNavigate(internalIndex - 1)
  }, [internalIndex, onNavigate])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    onClose()
    setTimeout(() => {
      setIsClosing(false)
      setShouldRender(false)
      setAnimationPhase("initial")
      onCloseComplete?.()
    }, 400)
  }, [onClose, onCloseComplete])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === "Escape") handleClose()
      if (e.key === "ArrowRight") navigateNext()
      if (e.key === "ArrowLeft") navigatePrev()
    }
    window.addEventListener("keydown", handleKeyDown)
    if (isOpen) document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, handleClose, navigateNext, navigatePrev])

  useLayoutEffect(() => {
    if (isOpen && sourceRect) {
      setShouldRender(true)
      setAnimationPhase("initial")
      setIsClosing(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimationPhase("animating"))
      })
      const timer = setTimeout(() => setAnimationPhase("complete"), 500)
      return () => clearTimeout(timer)
    }
  }, [isOpen, sourceRect])

  const handleDotClick = (idx: number) => {
    if (idx !== internalIndex) onNavigate(idx)
  }

  if (!shouldRender || !currentProject) return null

  const getInitialStyles = (): React.CSSProperties => {
    if (!sourceRect) return {}
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const targetWidth = Math.min(768, viewportWidth - 64)
    const targetHeight = Math.min(viewportHeight * 0.85, 600)
    const targetX = (viewportWidth - targetWidth) / 2
    const targetY = (viewportHeight - targetHeight) / 2
    const scale = Math.max(sourceRect.width / targetWidth, sourceRect.height / targetHeight)
    const translateX = sourceRect.left + sourceRect.width / 2 - (targetX + targetWidth / 2)
    const translateY = sourceRect.top + sourceRect.height / 2 - (targetY + targetHeight / 2)
    return { transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`, opacity: 1 }
  }

  const getFinalStyles = (): React.CSSProperties => ({
    transform: "translate(0, 0) scale(1)",
    opacity: 1,
  })

  const currentStyles = animationPhase === "initial" && !isClosing ? getInitialStyles() : getFinalStyles()
  const settled = animationPhase === "complete" && !isClosing

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={currentProject.title}
      style={{ opacity: isClosing ? 0 : 1, transition: "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-xl"
        style={{
          opacity: animationPhase === "initial" && !isClosing ? 0 : 1,
          transition: "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      <button
        onClick={(e) => {
          e.stopPropagation()
          handleClose()
        }}
        aria-label="关闭 Close"
        className={cn(
          "absolute right-5 top-5 z-50 h-10 w-10",
          "flex items-center justify-center rounded-full",
          "border border-border bg-muted/50 text-muted-foreground backdrop-blur-md",
          "transition-all duration-300 ease-out hover:scale-105 hover:bg-muted hover:text-foreground active:scale-95",
        )}
        style={{
          opacity: settled ? 1 : 0,
          transform: settled ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 300ms ease-out, transform 300ms ease-out",
        }}
      >
        <X className="h-4 w-4" strokeWidth={2.5} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          navigatePrev()
        }}
        disabled={!hasPrev}
        aria-label="上一张 Previous"
        className={cn(
          "absolute left-4 z-50 h-12 w-12 md:left-8",
          "flex items-center justify-center rounded-full",
          "border border-border bg-muted/50 text-muted-foreground backdrop-blur-md",
          "transition-all duration-300 ease-out hover:scale-110 hover:bg-muted hover:text-foreground active:scale-95",
          "disabled:pointer-events-none disabled:opacity-0",
        )}
        style={{
          opacity: settled && hasPrev ? 1 : 0,
          transform: settled ? "translateX(0)" : "translateX(-20px)",
          transition: "opacity 300ms ease-out 150ms, transform 300ms ease-out 150ms",
        }}
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          navigateNext()
        }}
        disabled={!hasNext}
        aria-label="下一张 Next"
        className={cn(
          "absolute right-4 z-50 h-12 w-12 md:right-8",
          "flex items-center justify-center rounded-full",
          "border border-border bg-muted/50 text-muted-foreground backdrop-blur-md",
          "transition-all duration-300 ease-out hover:scale-110 hover:bg-muted hover:text-foreground active:scale-95",
          "disabled:pointer-events-none disabled:opacity-0",
        )}
        style={{
          opacity: settled && hasNext ? 1 : 0,
          transform: settled ? "translateX(0)" : "translateX(20px)",
          transition: "opacity 300ms ease-out 150ms, transform 300ms ease-out 150ms",
        }}
      >
        <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
      </button>

      <div
        className="relative z-10 w-auto max-w-3xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          ...currentStyles,
          transform: isClosing ? "translate(0,0) scale(0.95)" : currentStyles.transform,
          transition:
            animationPhase === "initial" && !isClosing
              ? "none"
              : "transform 400ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease-out",
          transformOrigin: "center center",
        }}
      >
        <div
          className="relative mx-auto w-fit max-w-full overflow-hidden rounded-2xl bg-card shadow-2xl ring-1 ring-border"
          style={{
            borderRadius: animationPhase === "initial" && !isClosing ? "8px" : "16px",
            transition: "border-radius 500ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="relative overflow-hidden">
            {/* invisible spacer: the card hugs the active image instead of the strip */}
            <img
              src={currentProject.image || "/placeholder.svg"}
              alt=""
              aria-hidden="true"
              className="invisible h-auto max-h-[68vh] w-auto max-w-full"
            />
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="flex h-full"
                style={{
                  width: `${totalProjects * 100}%`,
                  transform: `translateX(-${(internalIndex * 100) / totalProjects}%)`,
                  // the spacer sets the card width, so a transform slide is safe
                  transition: settled
                    ? "transform 420ms cubic-bezier(0.32, 0.72, 0, 1)"
                    : "none",
                }}
              >
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex h-full items-center justify-center"
                    style={{ width: `${100 / totalProjects}%` }}
                  >
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/20 via-transparent to-card/10" />
          </div>

          <div
            className="border-t border-border bg-card px-6 py-5"
            style={{
              opacity: settled ? 1 : 0,
              transform: settled ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 300ms ease-out 100ms, transform 300ms ease-out 100ms",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="h-7 truncate text-lg font-medium tracking-tight text-foreground">
                  {currentProject.title}
                </h3>
                <div className="mt-1 flex items-center gap-3">
                  <p className="flex items-center text-sm text-muted-foreground">
                    <kbd className="mx-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-medium">
                      ←
                    </kbd>
                    <kbd className="mx-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-medium">
                      →
                    </kbd>
                    <span className="ml-1.5">切换</span>
                  </p>
                  <div className="flex items-center gap-1.5">
                    {projects.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDotClick(idx)}
                        aria-label={`第 ${idx + 1} 张`}
                        className={cn(
                          "h-2 w-2 rounded-full transition-all duration-300",
                          idx === internalIndex
                            ? "scale-110 bg-foreground"
                            : "bg-muted-foreground/40 hover:bg-muted-foreground/60",
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="hidden shrink-0 text-[10px] tracking-[0.16em] text-muted-foreground sm:block">
                PART PROJECTS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   ProjectCard (the fanned cards inside the folder)
   ──────────────────────────────────────────────────────────── */
interface ProjectCardProps {
  image: string
  title: string
  delay: number
  isVisible: boolean
  index: number
  onClick: () => void
  isSelected: boolean
}

export const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ image, title, delay, isVisible, index, onClick, isSelected }, ref) => {
    const rotations = [-14, 0, 14]
    const translations = [-62, 0, 62]

    return (
      <div
        ref={ref}
        className={cn(
          "folder-card absolute cursor-pointer overflow-hidden rounded-lg",
          "border border-border bg-card shadow-xl",
          "hover:ring-2 hover:ring-accent/50",
        )}
        style={{
          width: "var(--card-w)",
          height: "var(--card-h)",
          transform: isVisible
            ? `translateY(var(--fan-y)) translateX(calc(var(--fan-x) * ${translations[index] / 62})) rotate(${rotations[index]}deg)`
            : "translateY(0px) translateX(0px) rotate(0deg) scale(0.5)",
          opacity: isSelected ? 0 : isVisible ? 1 : 0,
          transition: `all 600ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
          zIndex: 10 - index,
          left: "calc(var(--card-w) / -2)",
          top: "calc(var(--card-h) / -2)",
          pointerEvents: isVisible ? "auto" : "none",
        }}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
      >
        <img src={image || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <p className="absolute inset-x-1.5 bottom-1.5 line-clamp-2 text-[10px] leading-tight font-medium text-white">
          {title}
        </p>
      </div>
    )
  },
)

ProjectCard.displayName = "ProjectCard"
