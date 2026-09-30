"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Brand resources, surfaced from the logo itself.
 *
 * Right-clicking the nav logo (wired up in `site-nav.tsx`) opens this menu at
 * the pointer, so the SVG is two clicks away anywhere on the page. The same
 * components back the `/brand` page, which is the linkable version of this.
 */

const ASSETS = {
  logo: { href: "/logo-icon.svg", label: "Primary mark" },
  pattern: { href: "/pattern-mark.svg", label: "Secondary mark" },
} as const;

/** Small inline spinner — decorative, so hidden from assistive tech. */
function Spinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Fetch + copy an asset's source, reporting the result to assistive tech. */
export function useCopySvg() {
  const [state, setState] = useState<"idle" | "copying" | "copied" | "error">(
    "idle",
  );

  const copy = useCallback(async (href: string, label: string) => {
    setState("copying");
    try {
      const response = await fetch(href);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await navigator.clipboard.writeText(await response.text());
      setState("copied");
      return `${label} copied to your clipboard.`;
    } catch {
      setState("error");
      return `Couldn’t copy ${label.toLowerCase()} — use the download link instead.`;
    }
  }, []);

  return { state, copy, reset: () => setState("idle") };
}

/** A button that copies an asset's SVG source, with its own live feedback. */
export function CopySvgButton({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  const { state, copy } = useCopySvg();
  const [message, setMessage] = useState("");

  return (
    <>
      <button
        type="button"
        disabled={state === "copying"}
        aria-busy={state === "copying"}
        onClick={async () => setMessage(await copy(href, label))}
        className={
          className ??
          "inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-medium ring-1 ring-neutral-900/15 transition-colors duration-200 ease-out hover:bg-neutral-900/5 active:bg-neutral-900/10 disabled:opacity-60"
        }
      >
        {/* Label stays put while the work happens; the spinner carries state. */}
        {state === "copying" && (
          <Spinner className="size-3.5 motion-safe:animate-spin" />
        )}
        Copy SVG
      </button>
      <span aria-live="polite" className="sr-only">
        {state === "copying" ? `Copying ${label.toLowerCase()}…` : message}
      </span>
    </>
  );
}

type Point = { x: number; y: number };

export interface BrandAssetsMenuProps {
  point: Point | null;
  onClose: () => void;
  /** Element that opened the menu — focus returns here on close. */
  returnFocusTo?: HTMLElement | null;
}

export function BrandAssetsMenu({
  point,
  onClose,
  returnFocusTo,
}: BrandAssetsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const { state, copy } = useCopySvg();
  const [message, setMessage] = useState("");
  const open = point !== null;

  useEffect(() => {
    if (!open) return;
    openerRef.current = returnFocusTo ?? null;

    const items = () =>
      Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ??
          [],
      );

    // Move focus into the menu so it is keyboard-operable from the pointer gesture.
    items()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Own the Escape key: the nav panel's focus trap also listens for it.
        event.preventDefault();
        event.stopImmediatePropagation();
        onClose();
        return;
      }
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      const list = items();
      const index = list.indexOf(document.activeElement as HTMLElement);
      const next =
        event.key === "ArrowDown"
          ? (index + 1) % list.length
          : (index - 1 + list.length) % list.length;
      list[next]?.focus();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (menuRef.current?.contains(event.target as Node)) return;
      onClose();
    };

    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("pointerdown", onPointerDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
      // Return focus to the logo that opened the menu.
      openerRef.current?.focus();
    };
  }, [open, onClose, returnFocusTo]);

  if (!open) return null;

  // Keep the panel inside the viewport.
  const width = 264;
  const height = 232;
  const left = Math.max(8, Math.min(point.x, window.innerWidth - width - 8));
  const top = Math.max(8, Math.min(point.y, window.innerHeight - height - 8));

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Brand assets"
      style={{ left, top, width }}
      className="fixed z-100 overflow-hidden rounded-xl border border-white/10 bg-neutral-950/95 p-1.5 text-zinc-100 shadow-2xl shadow-black/50 backdrop-blur-sm"
    >
      <a
        role="menuitem"
        href={ASSETS.logo.href}
        download="aayushman-chandra-mark.svg"
        className="flex min-h-11 items-center justify-between gap-3 rounded-lg px-3 text-sm transition-colors duration-200 hover:bg-white/10 focus-visible:bg-white/10"
      >
        {ASSETS.logo.label}
        <span aria-hidden="true" className="text-zinc-500">
          ↓
        </span>
      </a>
      <a
        role="menuitem"
        href={ASSETS.pattern.href}
        download="aayushman-chandra-pattern.svg"
        className="flex min-h-11 items-center justify-between gap-3 rounded-lg px-3 text-sm transition-colors duration-200 hover:bg-white/10 focus-visible:bg-white/10"
      >
        {ASSETS.pattern.label}
        <span aria-hidden="true" className="text-zinc-500">
          ↓
        </span>
      </a>
      <button
        type="button"
        role="menuitem"
        disabled={state === "copying"}
        aria-busy={state === "copying"}
        onClick={async () =>
          setMessage(await copy(ASSETS.logo.href, ASSETS.logo.label))
        }
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 text-left text-sm transition-colors duration-200 hover:bg-white/10 focus-visible:bg-white/10 disabled:opacity-60"
      >
        <span className="inline-flex items-center gap-2">
          {state === "copying" && (
            <Spinner className="size-3.5 motion-safe:animate-spin" />
          )}
          Copy SVG
        </span>
        {/* No shortcut hint: ⌘/Ctrl differ per platform and this is a pointer
            affordance, not a real key binding. */}
        <span aria-hidden="true" className="text-zinc-500">
          ⧉
        </span>
      </button>
      <Link
        role="menuitem"
        href="/brand"
        onClick={onClose}
        className="flex min-h-11 items-center justify-between gap-3 rounded-lg px-3 text-sm transition-colors duration-200 hover:bg-white/10 focus-visible:bg-white/10"
      >
        All brand assets
        <span aria-hidden="true" className="text-zinc-500">
          →
        </span>
      </Link>
      <span aria-live="polite" className="sr-only">
        {message}
      </span>
    </div>
  );
}
