import { useEffect } from "react"

/**
 * Fades `.reveal` elements in as they scroll into view.
 * Tagging <html> with `.js` means content stays visible if JS never runs.
 */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    document.documentElement.classList.add("js")
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"))

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in")
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" },
    )

    els.forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight) el.classList.add("in")
      else io.observe(el)
    })

    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
