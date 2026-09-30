"use client";

import { useEffect, useRef, useState } from "react";

export interface UseInViewOptions {
  /** Extra viewport margin, e.g. "400px" to mount slightly before entry. */
  rootMargin?: string;
  /** Fraction of the element that must be visible. */
  threshold?: number;
  /** Stop observing after the first intersection. Defaults to true. */
  once?: boolean;
}

/**
 * Minimal IntersectionObserver hook.
 *
 * Used to defer mounting heavy, off-screen blocks (the WebGL carousel) so the
 * first paint isn't competing with a GPU context — and so the block's built-in
 * rise-and-grow entry animation plays when the visitor actually arrives at it,
 * rather than silently finishing above the fold at load time.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  rootMargin = "0px",
  threshold = 0,
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // No IntersectionObserver (old browsers): reveal on the next frame so the
    // state update happens outside the effect body.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return { ref, inView } as const;
}
