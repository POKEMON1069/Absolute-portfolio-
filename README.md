# Aayushman Chandra — Portfolio

A minimal, white-background personal portfolio whose hero is a row of clay-like 3D folders.
Hover (or tap, on a phone) a folder and three project cards fan out of it; click a card and it
expands into an animated lightbox with keyboard, dot and button navigation.

Built with **React 18 + TypeScript + Vite + Tailwind CSS v4**, following the shadcn/ui
project structure (`components.json`, `src/components/ui/*`, `@/lib/utils`).

## Stack

```
React 18 · TypeScript · Vite 6
Tailwind CSS v4 (@tailwindcss/vite) + tw-animate-css
lucide-react icons · clsx + tailwind-merge (cn helper)
```

## Structure

```
index.html                     # shell: #root, fonts, zh-CN default lang
components.json                # shadcn config — style "new-york", css: src/index.css
src/
  main.tsx                     # React entry
  App.tsx                      # category state, sticky header, + menu, sections
  index.css                    # Tailwind 4 import, @theme inline tokens, folder geometry
  components/
    hero.tsx                   # wordmark, 4 discipline folders, grey bar
    works.tsx                  # filter pills + project grid
    about.tsx                  # About (bio/facts/interests) + Footer (contact)
    ui/
      3d-folder.tsx            # AnimatedFolder · ProjectCard · ImageLightbox
      button.tsx card.tsx badge.tsx
  data/
    site.ts                    # ✏️ name, email, skills, interests, inspirations
    projects.ts                # ✏️ the 5 projects + categories
  hooks/use-reveal.ts          # IntersectionObserver scroll-reveal
  lib/utils.ts                 # cn()
public/assets/
  projects/                    # 5 project images (720×960, 3:4)
  fonts/                       # self-hosted Inter + Noto Sans SC
```

## Editing it

**Projects** — `src/data/projects.ts`. Each entry:

```ts
{ id, image: "/assets/projects/xxx.jpg", title, desc, role,
  stack: ["React", "TypeScript"], category: "product" }
```

`category` must be one of `product | uiux | hardware | web` — those four values drive the
hero folders *and* the filter pills. Each folder shows the first three projects in its category.

**Your details** — `src/data/site.ts`: name, short name, email (currently a placeholder),
grade, location, club, interests, skills, inspirations, goal.

**Colours** — `src/index.css`. Site tokens live in `:root` under `@theme inline`; the four folder
palettes are in `hero.tsx` as oklch values (`--folder-back/-front/-tab` per folder).

## Interaction

| Action | Result |
| --- | --- |
| Hover a hero folder (tap on touch) | up to 3 cards fan out; tap again to close |
| Click a fanned card | lightbox opens, growing from that card |
| `←` `→`, arrows, or dots | move between cards in the same folder |
| `Esc` / backdrop / ✕ | close the lightbox |
| "View all Product" | jumps to the index filtered to that category |
| `+` in the header | navigation menu |

## Local development

```bash
npm install
npm run dev        # http://localhost:8000
npm run build      # → dist/
npm run typecheck  # tsc -b --noEmit
```

## Deploy

Any static host. For GitHub Pages, publish `dist/` after `npm run build`
(Vite `base` is `/`, so use a custom domain or a root-level user page unless you set `base`).

## Notes

- The component was delivered in `src/components/ui/` (not a root-level `components/ui/`),
  because `components.json` aliases `@/components` → `src/components`. That folder is what
  shadcn's CLI treats as the default destination for `npx shadcn@latest add …`, so future
  components land in the same place.
- Project thumbnails are locally generated artwork standing in for real screenshots — the
  deployed environment blocks external image hosts (Unsplash included). Drop your own 3:4
  images into `public/assets/projects/` and point `projects.ts` at them.
