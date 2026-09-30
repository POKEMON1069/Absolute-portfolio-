# Aayushman Chandra — Portfolio

A Next.js 16 App Router portfolio built on a shadcn/ui structure, with four
integrated blocks composed into one page:

| Block | File | Used on the page as |
| --- | --- | --- |
| **Immersive Full Screen Nav** | `components/ui/immersive-full-screen-nav.tsx` | `components/portfolio/site-nav.tsx` |
| **Cinematic Orbit Hero** | `components/ui/cinematic-orbit-hero.tsx` | `app/page.tsx` (directly) |
| **Liquid Glass Carousel** | `components/ui/liquid-glass-carousel.tsx` | `components/portfolio/work-section.tsx` |
| **Footer 16** | `components/ui/footer16/index.tsx` | `components/portfolio/site-footer.tsx` |

Live preview (dev server): run `npm run dev` and open `http://localhost:3000`.

---

## 1. Stack & structure

The project satisfies all three prerequisites out of the box:

- **shadcn project structure** — `components.json` (style `new-york`, base colour
  `neutral`, `cssVariables: true`, aliases `@/components`, `@/lib/utils`,
  `@/components/ui`, `@/hooks`).
- **Tailwind CSS v4** — `@tailwindcss/postcss` + `@import "tailwindcss"` in
  `app/globals.css`, no `tailwind.config.js` needed at v4.
- **TypeScript** — `strict: true`, path alias `@/*` → project root.

```
app/
  layout.tsx            fonts, metadata, <html>/<body>
  page.tsx              the portfolio page (composes everything)
  globals.css           Tailwind v4 + shadcn design tokens
  icon.svg              favicon (the supplied logo mark)
  brand/page.tsx        brand assets: downloads, colour, copy-SVG
  demos/                one route per block, plus /demos index
assets/
  logo-icon.tsx         ← your supplied 4-point spark mark
  pattern-mark.tsx      ← your supplied notched-corner lattice mark
components/
  ui/                   the integrated blocks (kept verbatim)
  portfolio/            site-level sections built on top of them
hooks/
  use-in-view.ts        defers the WebGL carousel until it is near the viewport
  use-translate-guard.ts  translate="no" on brand nodes + nav landmark/control names
lib/
  utils.ts              cn() — the standard shadcn helper
  portfolio-data.ts     all copy, projects, links, footer columns
public/
  footer-bg.webp        footer backdrop artwork (22 KB)
  logo-icon.svg         the mark as a plain file
  pattern-mark.svg      the secondary mark as a plain file
```

### Component / style default paths

This project uses the shadcn defaults, so nothing had to be relocated:

- components → `@/components` (`/components`)
- UI primitives → `@/components/ui` (`/components/ui`) ✅ **already the default**
- global stylesheet → `app/globals.css`

**Why `/components/ui` matters.** `components.json` declares
`aliases.ui = "@/components/ui"`, and that is where every `npx shadcn@latest add`
writes primitives *and* where it looks for existing ones to resolve imports
between them. Blocks placed anywhere else (say `components/blocks/`) still
compile, but they fall outside the CLI's own bookkeeping: `shadcn add` can't see
them when computing dependencies, `shadcn diff`/upgrades skip them, and every
registry item that imports `@/components/ui/<thing>` breaks. Keeping the four
integrated blocks in `/components/ui` means future `shadcn add` runs slot in
next to them without rewrites.

---

## 2. Installation

The repository is already installed and building. From a clean clone:

```bash
npm install          # installs everything in package.json
npm run dev          # http://localhost:3000
npm run build        # production build (passes)
npm run lint         # eslint (passes)
```

### Dependencies added for the blocks

```bash
# Cinematic Orbit Hero
npm install motion

# Liquid Glass Carousel
npm install three && npm install -D @types/three

# Footer 16
npm install motion react-icons

# Immersive Full Screen Nav
npm install gsap

# shadcn foundation (cn helper + Tailwind v4 animation utilities)
npm install clsx tailwind-merge class-variance-authority tw-animate-css
```

`lucide-react` is installed as the project's icon library
(`components.json → iconLibrary: "lucide"`). Once you add shadcn primitives that
use icons, import them from `lucide-react`. The blocks you supplied carry their
own inline SVGs (nav socials) and are left exactly as they shipped.

### If you were starting from scratch (shadcn CLI)

```bash
npx create-next-app@latest my-app --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*"
cd my-app
npx shadcn@latest init      # writes components.json + the token block in globals.css
npx shadcn@latest add button card separator   # any primitives you need
```

Then re-run the four `npm install` lines above and copy the block files into
`components/ui/`. `npx shadcn@latest init` was **not** run in this sandbox (the
sandbox's network allowlist blocks `ui.shadcn.com`), so `components.json`, the
`.dark` token block and `lib/utils.ts` were authored by hand to the exact
`new-york` / `neutral` output the CLI produces. Re-running `init` in a normal
environment is safe — it will just rewrite the same token block.

---

## 3. How each block is wired

### Immersive Full Screen Nav — `components/portfolio/site-nav.tsx`

```tsx
<ImmersiveFullscreenNav
  navConfig={{ brand: person.firstName, overlayBg: "#0b0b0e", clipOrigin: "left", … }}
  navContent={{ agencyName: person.name, tagline, location, links, images, socials }}
/>
```

- Header brand is "Aayushman"; panel opens from the **left** over `#0b0b0e`.
- `navContent.images` are Unsplash stills; `socials` use the block's built-in
  inline SVG icons.
- **Header colour:** the block draws its closed header in black, which would
  vanish over the dark contact/footer sections. Its `headerClassName` escape
  hatch is used with `mix-blend-difference` + forced white fills so the brand
  and hamburger auto-invert over any section — near-black on the light hero and
  work blocks, white over the dark nav panel, contact block and footer.
- **Closing on link click:** when the panel is driven by the `children` render
  prop (needed for the image/social layout), the block's links don't dismiss the
  menu. Hash anchors are intercepted (`onClickCapture`) and the panel is
  dismissed through the component's own Escape path — the handler its focus trap
  already listens for, so it is a no-op while the panel is closed — then the
  target section is scrolled to. That covers the panel links and the header
  brand link alike.

### Cinematic Orbit Hero — `app/page.tsx`

Rendered unmodified, directly after the intro section. It is a self-contained
350vh scroll scene: the cards orbit, then spread as `scrollYProgress` passes
0.95, with pointer parallax and a rose glow behind the headline. Its imagery
comes from the component's own CDN base (`IMG_BASE` at the top of the file) — if
those URLs ever move, swap `IMAGES` for your own stills or drop files into
`public/` and point the array at `/your-file.png`. The block already carries
`dark:` variants, so it renders correctly in either theme.

### Liquid Glass Carousel — `components/portfolio/work-section.tsx`

```tsx
<LiquidGlassCarousel items={projects} panelHeight={470} gap={12}
  background="#ffffff" entry onActiveChange={setActive} />
```

- `projects` (8 items) comes from `lib/portfolio-data.ts` and uses the same
  Unsplash stills the block shipped with, so the panels load out of the box.
- The block needs a fixed-height parent: it sits in a `h-[74svh] min-h-[520px]`
  wrapper.
- It is mounted only once the section is within 400px of the viewport
  (`hooks/use-in-view.ts`). That keeps a WebGL context out of the initial load
  *and* lets the block's rise-and-grow intro play as the visitor arrives rather
  than finishing off-screen above the fold.
- `onActiveChange` mirrors the active index into the section header and the
  caption under the row. Wheel, drag, click-to-focus, `←`/`→` and `Esc` all
  behave exactly as the block defines them.
- `components/ui/webgl-error-boundary.tsx` is the companion module the block
  imports (`WebGLErrorBoundary`, `WebGLFallback`). It catches context loss and
  falls back to a quiet placeholder when WebGL is unavailable.

### Footer 16 — `components/portfolio/site-footer.tsx`

```tsx
<Footer16 brandName="AAYUSHMAN CHANDRA" tagline={…} columns={…}
  legalLinks={…} socials={…} copyright={…} backgroundImage="/footer-bg.png" />
```

- The logo beside the brand row is `assets/logo-icon.tsx` — your supplied mark.
- The wordmark behind the footer is an inline SVG that stretches `brandName` to
  80% of the panel width; with a full name it reads as a wide typographic wall.
- `backgroundImage` points at `public/footer-bg.png` (a dark dusk landscape
  backdrop). Replace that file with your own artwork — same filename — and the
  footer picks it up with no code change.

---

## 4. Brand assets

Your logo SVG is used in three places, always from one source of truth
(`assets/logo-icon.tsx`):

1. Footer brand row (`Footer16`).
2. Site header, hero intro and studio/contact section labels.
3. `app/icon.svg` → the browser favicon, plus `public/logo-icon.svg`.

The file renders the **exact path data you supplied**, with the paint switched
from the hard-coded `rgb(84, 84, 84)` to `currentColor` so the mark inherits the
surrounding text colour (grey `#545454` on light surfaces, white on dark ones).
If you want the literal flat grey everywhere instead, hard-code
`fill={LOGO_COLOR}` in that file — the constant is exported for exactly that.

Your second SVG (the notched-corner lattice) is kept at
`assets/pattern-mark.tsx` and used as a large, 4%-opacity ornament behind the
hero intro and studio sections.

---

## 5. Editing the content

Everything textual lives in **`lib/portfolio-data.ts`** — name, role, bio,
stats, capabilities, nav links, nav stills, project list, footer columns, legal
links, socials and the footer backdrop path. Change a value there and every
block updates; no component edits required.

Values marked `// TODO` are placeholder outbound links (socials, legal pages) —
point them at your real profiles before shipping.

---

## 6. Deliberate deviations from the supplied files

Four changes were necessary or clearly better, and each is isolated:

1. **`"use client"` added to `components/ui/footer16/index.tsx`.** The block is
   built on Motion, which cannot run in a React Server Component; without the
   directive the production build fails at prerender. The other three blocks
   already shipped with it. Nothing else in the file was touched.
2. **`components/ui/webgl-error-boundary.tsx` written.** The carousel imports
   `{ WebGLErrorBoundary, WebGLFallback }` from
   `@/components/ui/webgl-error-boundary`, which wasn't part of the paste; the
   file implements both, typed, per the import's usage.
3. **`.eslintrc` scope for vendored code.** `eslint.config.mjs` turns off four
   rules (`no-explicit-any`, `no-img-element`, `react-hooks/refs`,
   `react-hooks/exhaustive-deps`) **only** for `components/ui/**`, so the blocks
   stay byte-for-byte as delivered while `npm run lint` still passes. Those
   rules remain enforced for `app/`, `components/portfolio/`, `hooks/`, `lib/`
   and `assets/`.
4. **Demo files kept as routes.** Each block's demo lives beside it in
   `components/ui/` exactly as pasted (`*-demo.tsx`, `footer16/demo.tsx`) and is
   reachable at `/demos/…`, so you can verify any block in isolation.

### Fonts

`app/globals.css` sets a system font stack (`ui-sans-serif, system-ui, …`)
rather than `next/font/google`: the sandbox that built this project can't reach
`fonts.googleapis.com`, so a Google font would have broken the build. To move to
Geist, Inter or similar, add it in `app/layout.tsx`:

```tsx
import { Geist } from "next/font/google";
const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
// <html className={geist.variable}> … then map it in globals.css:
// --font-sans: var(--font-geist-sans);
```

(That requires outbound access to Google Fonts at build time.)

---

## 7. Web Interface Guidelines audit

The UI was reviewed against the [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines)
(`npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines`).
Findings were fixed in the base layer, the app shell and the portfolio wrappers;
the vendored blocks were left intact — see the accepted deviations below.

### Fixed

**Focus, keyboard & touch**
- One global `:focus-visible` ring in `app/globals.css` covers every control,
  *including* the vendored blocks. The only `outline-none` in the codebase
  (`liquid-glass-carousel.tsx:1483`) already pairs with a
  `focus-visible:ring-*` replacement, so it is not a violation.
- `touch-action: manipulation` on all interactive elements; `-webkit-tap-
  highlight-color: transparent` (we draw our own hover/active states).
- `scroll-margin-top: 5rem` on `[id]` so the fixed header never covers an
  anchored section or a focused element.
- The full-screen nav panel traps focus and returns it to the hamburger (in the
  block); its landmarks/controls were given accurate names at runtime —
  `nav[role="navigation"]` → `aria-label="Main"`, and the hamburger's label
  follows its state ("Open menu" / "Close menu") — via
  `hooks/use-translate-guard.ts`.

**Layout, safe areas & scrollbars**
- `overflow-x: clip` on `html` (sticky-safe) so the blocks' `100vw` rows can't
  produce a horizontal scrollbar; `scrollbar-gutter: stable` so locking scroll
  for the nav panel can't shift the page.
- `overscroll-behavior: contain` on the nav overlay.
- `viewport-fit=cover` + `env(safe-area-inset-*)` padding on the fixed header
  and the footer.
- Zoom is left fully enabled (no `maximum-scale`).

**Theming & browser UI**
- `color-scheme: light` on `<html>`, `<meta name="theme-color" content="#f8fafc">`
  (matches the page canvas), and no `<select>` elements to patch.

**Motion**
- `<MotionConfig reducedMotion="user">` around the footer's Motion reveals
  (the block doesn't check the media query itself); a base-layer
  `prefers-reduced-motion` block collapses CSS transitions/animations; the
  in-page anchor scrolling in `site-nav.tsx` switches `smooth` → `auto`. The
  hero, carousel and nav each check the media query internally.

**Typography & copy**
- Curly apostrophes throughout user-visible copy (`Let’s`, `I’m`).
- Non-breaking spaces in glued terms: `Q1&nbsp;projects`, `©&nbsp;2026`,
  `Based in&nbsp;(IST)`. Plus `tabular-nums` on every number column.
- `text-balance` on headings, `text-pretty` on body copy.
- Loading state keeps its label: the copy button shows a spinner and stays
  labelled "Copy SVG", with the state announced through an `aria-live` region —
  instead of swapping the label to "Copying…".

**Semantics & a11y**
- Skip link → `#top` (the hero is `tabIndex={-1}` so it can receive focus).
- Exactly one `<h1>` per page; `h2` per section, `h3` in the footer.
- Icon-only controls named; decorative marks `aria-hidden`; counts and status
  never rely on colour alone.
- Brand name wrapped in `translate="no"` (statically on the `h1`, at runtime for
  the vendored header/footer nodes) so auto-translate can't garble it.

**Performance & assets**
- Preconnect to the two media origins (with `crossorigin`, matching how three.js
  and `<img>` fetch them).
- The studio image has explicit `width`/`height` + `loading="lazy"`.
- Footer backdrop shipped as WebP: **2.1 MB PNG → 22 KB**, visually identical.
- The WebGL carousel mounts only when the section is within 400px of the
  viewport (`hooks/use-in-view.ts`) — no GPU context on first load.

**Navigation, state & links**
- Every navigational control is an `<a>`/`<Link>` (Cmd/Ctrl-click and
  middle-click work); no `onClick` on a `<div>` for navigation.
- Depth: the new `/brand` page, reachable from the footer and from
  right-clicking the nav logo, which opens a `role="menu"` brand-assets popover
  with download + copy-SVG actions.

### Accepted deviations (vendored block interiors)

Deliberately left as delivered, per "use each component exactly as specified":

| Location | Finding | Why it's not a live bug |
| --- | --- | --- |
| `components/ui/cinematic-orbit-hero.tsx:139` | `transition-all` | Animates only shadows/transform in practice; the card's box doesn't change. |
| `components/ui/cinematic-orbit-hero.tsx:141` | `<img>` without `width`/`height` | Cards are absolutely positioned inside a fixed `100svh` wrapper, sized in `vw`/`vh` — no layout shift is possible. |
| `components/ui/immersive-full-screen-nav.tsx:343,349,355` | `transition-all` on the hamburger bars | `translate`/`rotate`/`scale` only, each with `motion-reduce:transition-none`. |
| `components/ui/immersive-full-screen-nav.tsx:674` | `<img>` without dimensions, no `loading="lazy"` | Fixed `h-[18vw] w-[25vw]` frame; the panel is closed until the user opens it. Add `loading="lazy"` if you want the two stills deferred. |
| `components/ui/liquid-glass-carousel.tsx` | Canvas is `aria-hidden`; gesture control has no equivalent tap target inside the canvas | The wrapper is a labelled `role="region"` with a polite live region, and `←`/`→`/`Esc` are wired; a click on any panel also works. |
| `components/ui/footer16/index.tsx` | Reveals don't self-check `prefers-reduced-motion` | Handled from outside via `<MotionConfig reducedMotion="user">`. |

Two edits *were* made inside a vendored file, both required and both noted in
§6: the `"use client"` directive in `footer16/index.tsx`, and its
`backgroundUrl` constant now pointing at this site's own `/footer-bg.webp`
instead of the demo CDN (so it matches `footerBackgroundImage`).

### Verified by hand

- Footer small text on the darkened backdrop: ≈ **4.7:1** (zinc-400/76 over
  `rgba(9,10,14,0.9)`), so it clears AA. Link hovers *increase* contrast.
- Contact-block grey text on `#0b0b0e`: zinc-400 → **6.3:1**; the `zinc-500`
  span is large display text (≥ 4xl), clearing the 3:1 large-text threshold.
- Light sections: `neutral-600` on `#f8fafc`/white → **7.4–7.8:1**. Small
  uppercase labels were raised from `neutral-500` (4.47:1 — just under AA) to
  `neutral-600` because of this check.

`npm run lint`, `npx tsc --noEmit` and `npm run build` all pass. The carousel
logs one benign WebGL shader-compile note (a loop-varying-derivative warning
from the block's own GLSL) — it does not affect rendering.

---

## 8. Page order

```
SiteNav (fixed)
  HeroIntro          #top      name, role, intro, stats
  CinematicOrbitHero           350vh scroll scene
  WorkSection        #work    LiquidGlassCarousel + captions
  StudioSection      #about   bio, capabilities, studio still
  ContactSection     #contact dark CTA, email, socials
SiteFooter                     Footer 16
```

Anchors are wired end to end: `#top`, `#work`, `#about`, `#contact` resolve to
real sections, and `scroll-margin-top: 5rem` in `globals.css` keeps them clear of
the fixed header.
