"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Brand resources, surfaced from the logo itself.
 *
 * Right-clicking the nav logo (wired up in `site-nav.tsx`) opens this menu at
 * the pointer, so the SVG is two clicks away anywhere on the page. The same
 * components back the `/brand` page, which is the linkable version of this.
 *
 * This is a pointer-only shortcut: the logo's normal activation navigates, so
 * the menu can't advertise itself with `aria-haspopup`/`aria-expanded` without
 * misrepresenting the link. Every asset it exposes is reachable by keyboard on
 * `/brand` (linked from the footer), and the menu itself is fully
 * keyboard-operable once open — focus moves in, ↑/↓ move, Escape closes and
 * returns focus to the logo.
 */

const ASSETS = {
  logo: { href: "/logo-icon.svg", label: "Primary mark" },
  pattern: { href: "/pattern-mark.svg", label: "Secondary mark" },
} as const;

/* Loading-state timings from the guidelines: don't flash a spinner for work
   that resolves instantly, and don't blink it away the moment it appears. */
const BUSY_SHOW_DELAY = 150;
const BUSY_MIN_VISIBLE = 350;

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

/**
 * Fetch + copy an asset's source, reporting the result to assistive tech.
 *
 * The busy state is delayed by 150 ms and held for at least 350 ms so a fast
 * copy neither flashes a spinner nor dismisses one immediately.
 */
export function useCopySvg() {
  const [busy, setBusy] = useState(false);
  const busySince = useRef(0);

  const copy = useCallback(async (href: string, label: string) => {
    const showTimer = setTimeout(() => {
      busySince.current = performance.now();
      setBusy(true);
    }, BUSY_SHOW_DELAY);

    try {
      const response = await fetch(href);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await navigator.clipboard.writeText(await response.text());
      return `${label} copied to your clipboard.`;
    } catch {
      return `Couldn’t copy ${label.toLowerCase()} — use the download link instead.`;
    } finally {
      clearTimeout(showTimer);
      const shown = busySince.current;
      busySince.current = 0;
      if (shown) {
        const remaining = BUSY_MIN_VISIBLE - (performance.now() - shown);
        if (remaining > 0) {
          await new Promise((resolve) => setTimeout(resolve, remaining));
        }
        setBusy(false);
      }
    }
  }, []);

  return { busy, copy };
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
  const { busy, copy } = useCopySvg();
  const [message, setMessage] = useState("");

  return (
    <>
      <button
        type="button"
        disabled={busy}
        aria-busy={busy}
        onClick={async () => setMessage(await copy(href, label))}
        className={
          className ??
          "inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-medium ring-1 ring-neutral-900/15 shadow-elevated transition-colors duration-200 ease-out hover:bg-neutral-900/5 active:bg-neutral-900/10 disabled:opacity-60"
        }
      >
        {/* Label stays put while the work happens; the spinner carries state. */}
        {busy && <Spinner className="size-3.5 motion-safe:animate-spin" />}
        Copy SVG
      </button>
      <span aria-live="polite" className="sr-only">
        {busy ? `Copying ${label.toLowerCase()}…` : message}
      </span>
    </>
  );
}

type Point = { x: number; y: number };

const MENU_WIDTH = 264;

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
  const { busy, copy } = useCopySvg();
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

  const itemClass =
    "flex min-h-11 items-center justify-between gap-3 rounded-md px-3 text-sm text-zinc-100 transition-colors duration-200 hover:bg-white/10 focus-visible:bg-white/10";

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Brand assets"
      /* Coordinates are clamped in the opener's event handler — no viewport
         reads during render. */
      style={{ left: point.x, top: point.y, width: MENU_WIDTH }}
      className="fixed z-100 overflow-hidden rounded-xl border border-white/10 bg-neutral-950/95 p-1.5 shadow-elevated-inverse backdrop-blur-sm focus-within:border-white/25"
    >
      <a
        role="menuitem"
        href={ASSETS.logo.href}
        download="aayushman-chandra-mark.svg"
        className={itemClass}
      >
        {ASSETS.logo.label}
        <span aria-hidden="true" className="text-zinc-400">
          ↓
        </span>
      </a>
      <a
        role="menuitem"
        href={ASSETS.pattern.href}
        download="aayushman-chandra-pattern.svg"
        className={itemClass}
      >
        {ASSETS.pattern.label}
        <span aria-hidden="true" className="text-zinc-400">
          ↓
        </span>
      </a>
      <button
        type="button"
        role="menuitem"
        disabled={busy}
        aria-busy={busy}
        onClick={async () =>
          setMessage(await copy(ASSETS.logo.href, ASSETS.logo.label))
        }
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-3 text-left text-sm text-zinc-100 transition-colors duration-200 hover:bg-white/10 focus-visible:bg-white/10 disabled:opacity-60"
      >
        <span className="inline-flex items-center gap-2">
          {busy && <Spinner className="size-3.5 motion-safe:animate-spin" />}
          Copy SVG
        </span>
        {/* No shortcut hint: ⌘/Ctrl differ per platform and this is a pointer
            affordance, not a real key binding. */}
        <span aria-hidden="true" className="text-zinc-400">
          ⧉
        </span>
      </button>
      <Link role="menuitem" href="/brand" onClick={onClose} className={itemClass}>
        All brand assets
        <span aria-hidden="true" className="text-zinc-400">
          →
        </span>
      </Link>
      <span aria-live="polite" className="sr-only">
        {busy ? `Copying ${ASSETS.logo.label.toLowerCase()}…` : message}
      </span>
    </div>
  );
}
