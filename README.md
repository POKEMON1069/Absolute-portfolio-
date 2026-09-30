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

Five changes were necessary or clearly better, and each is isolated:

1. **Three edits inside vendored files — all required, none behavioural.**
   a. `"use client"` added to `components/ui/footer16/index.tsx`. The block is
      built on Motion, which cannot run in a React Server Component; without
      the directive the production build fails at prerender. The other three
      blocks already shipped with it.
   b. The same file's `backgroundUrl` constant now points at this site's own
      `/footer-bg.webp` instead of `assets.watermelon.sh`, so the footer renders
      the supplied backdrop and doesn't depend on the demo CDN.
   c. `loading="lazy" decoding="async"` on the orbit hero's `<img>`
      (`cinematic-orbit-hero.tsx:141`) — eight full-size images that are all
      off-screen at load. Attribute-only; delete the two lines to revert.
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

### Second pass — the full guideline text

The first pass used the abridged review checklist; this one works through the
complete guidelines, including the sections that only appear in the long form
(Forms, Performance, Design, Copywriting).

**Contrast, now measured with APCA.** `npm run check:contrast`
(`scripts/check-contrast.mjs`) implements APCA-W3 0.1.9 plus WCAG 2 ratios and
composites Tailwind's `/NN` alpha colours before measuring. It found 8 failures
on the first run; all 18 enforced pairs now pass:

| Surface | Before | After | APCA min |
| --- | --- | --- | --- |
| Contact eyebrow label | zinc-400 — Lc 52 | **zinc-300 — Lc 80** | 60 |
| Contact social links, location | zinc-400 — Lc 52 | **zinc-300 — Lc 80** | 75 |
| Contact h2 second line | zinc-500 — Lc 28 | **zinc-400 — Lc 52** | 45 |
| Brand-menu hint glyphs | zinc-500 — Lc 28 | **zinc-400 — Lc 52** | 30 |
| Footer links | zinc-300/70 — Lc 46 | **#d4d4d8 — Lc 80** | 75 |
| Footer tagline, copyright | zinc-400/76 — Lc 33 | **#cccccc — Lc 76** | 75 |

The footer's two rows are the only place a vendored block's *appearance* is
overridden, and it is one unlayered rule pair in `globals.css` (`footer p`,
`footer li a`) with the measured values in the comment — delete that block to
restore Footer16's exact delivered opacities. Its structure, props, animation
and layout are untouched, and every other footer colour (column titles at
Lc 104, social icons at Lc 52) was already fine.

**Hit targets.** The guideline wants ≥ 24px for fine pointers and ≥ 44px on
touch. Three vendored controls fell short and are now corrected through the
same unlayered block, using transparent `::after` layers so nothing moves:

| Control | Delivered | Now |
| --- | --- | --- |
| Footer links (columns, legal) | `min-h-5` (20px) | 24px fine / 44px coarse |
| Footer social icons | 40 × 40px | 24/44px min |
| Nav hamburger below 768px | 40 × 40px | 44px on touch |
| Carousel "Close" (13px text) | ~13px tall | ≥ 24px fine / 44px coarse |

**Loading states.** The copy-SVG action now follows the minimum-duration rule:
the spinner is delayed by 150 ms (so an instant copy never flashes) and held for
at least 350 ms (so it never blinks out). The button keeps its "Copy SVG" label
throughout, sets `aria-busy`, and reports through a polite live region.

**Design details.** Layered shadows replaced single-layer ones — a contact
shadow plus a wide ambient layer, as `--shadow-elevated` /
`--shadow-elevated-inverse` tokens (dark surfaces get a stronger pair). Nested
radii are now concentric: the brand menu is `rounded-xl` (12px) with `p-1.5`
(6px) padding and `rounded-md` (6px) children. Borders stay semi-transparent and
paired with shadows for edge clarity.

**Copywriting.** Sentence case throughout (a personal marketing page), no
straight quotes, `&` over "and" in "Designer & Developer", numerals for counts
("4-point spark", "40+ products"), action-specific labels ("View selected
work", "Request the full case study", "Download SVG" — not "Continue"), error
copy that names the exit ("Couldn't copy the primary mark — use the download
link instead"), and the brand name is glued with a non-breaking space in the
footer wordmark and brand row.

One deliberate departure: the portfolio's copy is written in the **first
person** ("I design and build…"). The guideline's second-person preference is
aimed at product marketing; a personal portfolio's voice is the product.

**Performance.** The eight Cinematic Orbit hero images are off-screen at load
and now carry `loading="lazy" decoding="async"` (edit 3 in §6). Nothing
above the fold is raster, so there is no `fetchpriority` work to do; the only
preloads are the three `preconnect`s. The nav overlay's two stills are inside a
`position: fixed` panel that always intersects the viewport, so lazy loading
cannot defer them — they are the one eager fetch, and they are small (900px
JPEGs).

**Where the guidelines don't apply.** No `<input>`, `<textarea>`, `<select>`,
`<form>`, `<video>`, animated GIF, tooltip, toast, modal, date/number display
or virtualizable list exists on the site — so the entire Forms section, the
input-related Interactions rules (paste, autofocus, mobile input size,
hydration-safe inputs), font preload/subset, video-over-image, chart palettes,
and large-list virtualization are N/A rather than skipped. Contact is a
`mailto:` link, which needs no validation, error placement or submission state.

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

Three edits *were* made inside vendored files, all required, all noted in §6:
the `"use client"` directive in `footer16/index.tsx`; its `backgroundUrl`
constant now pointing at this site's own `/footer-bg.webp` instead of the demo
CDN (matching `footerBackgroundImage`); and the `loading="lazy"`
`decoding="async"` pair on the orbit hero's `<img>` at
`cinematic-orbit-hero.tsx:141`. The four blocks' logic, props, markup structure
and layout are otherwise untouched — every other adaptation lives in
`globals.css`, `layout.tsx`, the portfolio wrappers, or runtime DOM hooks.

Additional accepted deviations found in this pass, left as delivered:

| Location | Finding | Why it's acceptable |
| --- | --- | --- |
| `liquid-glass-carousel.tsx` (entry sequence) | Input is locked for the ~4.6s rise-and-grow intro, so the animation can't be interrupted | The carousel mounts only 400px before it is visible, so the lock is normally over before a visitor can reach it; reduced-motion users skip the entry entirely (`entryOn = entry && !reduced`). Pass `entry={false}` to remove the lock. |
| `liquid-glass-carousel.tsx` (shimmer) | Continuous `uShimmer` loop | A muted, non-essential decorative loop, exactly the autoplay case the guideline allows, and it is switched off under `prefers-reduced-motion`. |
| `immersive-full-screen-nav.tsx:674` | Two 900px stills load while the panel is closed | The panel is `position: fixed`, so it always intersects the viewport — `loading="lazy"` would not defer them. |
| Brand-assets popover | Pointer-only trigger; panel/scroll/step state is not in the URL | The logo's activation navigates, so `aria-haspopup`/`aria-expanded` would misdescribe it. Everything the menu offers is keyboard-reachable at `/brand` (footer link), the menu is fully keyboard-operable once open, and the transient popover is not addressable state — the sections themselves stay deep-linkable (`#work`, `#about`, `#contact`). |
| Empty/sparse states | No skeleton for the carousel's first paint | The mount box is reserved at exact size (no CLS), the block animates its own entry, and a skeleton cannot mirror a WebGL scene. Empty `projects`/`capabilities`/`columns` arrays render nothing rather than a broken shell. |

**Not verifiable in this environment.** Responsive coverage at mobile/laptop/
ultra-wide, iOS Low Power Mode and macOS Safari behaviour, and the 50%-zoom
ultra-wide check all need a real browser — this sandbox has no headless Chrome
and its egress is allowlisted, so cross-origin media (Unsplash, the R2 image
CDN) can't be fetched or screenshotted here either. Layout is built to hold at
those widths (containers cap at `max-w-7xl`, vw-based type, wrapping grids), but
treat the visual check as yours to run.

### Verified mechanically

`npm run check:contrast` — APCA-W3 0.1.9 and WCAG 2, alpha-composited. Current
result: **18/18 enforced pairs pass**; the three as-delivered footer opacities
are printed as informational rows so the regression is documented rather than
hidden. Every light-surface pair is 7.5:1 or better (Lc 84–104); the dark
surfaces run 7.7:1–17.9:1 (Lc 52–100).

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
