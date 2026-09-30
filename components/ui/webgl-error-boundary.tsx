"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Companion module for `liquid-glass-carousel.tsx`, which imports
 * `{ WebGLErrorBoundary, WebGLFallback }` from `@/components/ui/webgl-error-boundary`.
 *
 * WebGL can fail in three different ways and each needs a different guard:
 *  1. `new THREE.WebGLRenderer()` throws synchronously → handled by the carousel
 *     itself (`createCarousel` returns `null` and it renders `<WebGLFallback />`).
 *  2. The context is created but lost / the driver crashes mid-frame → surfaced
 *     as a React render error, caught by the boundary below.
 *  3. The browser simply has no WebGL at all → also ends in `<WebGLFallback />`.
 */

export interface WebGLFallbackProps {
  className?: string;
  /** Copy shown inside the fallback panel. */
  message?: string;
}

/** Neutral, on-brand placeholder shown whenever the WebGL canvas can't run. */
export function WebGLFallback({ className, message }: WebGLFallbackProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg border border-black/10 bg-black/[0.03] px-6 text-center text-sm text-neutral-500",
        className,
      )}
      role="status"
    >
      <p className="m-0 max-w-[38ch] leading-relaxed">
        {message ?? "This 3D scene needs WebGL, which is unavailable here."}
      </p>
    </div>
  );
}

export interface WebGLErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  /** Called with the caught error — handy for logging/reporting. */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface WebGLErrorBoundaryState {
  hasError: boolean;
}

/**
 * Error boundary specialised for WebGL canvases: if anything inside throws
 * (context loss, exhausted GPU memory, driver reset) it swaps the subtree for
 * `fallback` instead of taking down the whole page.
 */
export class WebGLErrorBoundary extends Component<
  WebGLErrorBoundaryProps,
  WebGLErrorBoundaryState
> {
  state: WebGLErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): WebGLErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <WebGLFallback className="size-full" />;
    }
    return this.props.children;
  }
}
