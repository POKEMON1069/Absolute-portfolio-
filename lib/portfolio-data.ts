import type { Footer16Column, Footer16Social } from "@/components/ui/footer16";
import type { CustomNavbarLink } from "@/components/ui/immersive-full-screen-nav";
import type { LiquidGlassCarouselItem } from "@/components/ui/liquid-glass-carousel";

/**
 * Single source of truth for the portfolio's copy.
 *
 * Everything below is plain data — edit it here and every block on the page
 * updates. The values marked `TODO` are placeholders: swap in the real links,
 * handles and project names before shipping.
 *
 * Typographic notes: user-visible copy uses curly apostrophes (’) and
 * non-breaking spaces (\u00A0) to keep glued terms — "Q1 projects",
 * "IST / UTC+5:30", "© 2026" — from breaking across lines.
 */

const nbsp = "\u00A0";

export const person = {
  name: "Aayushman Chandra",
  /** Split for the wordmark + typographic treatments. */
  firstName: "Aayushman",
  lastName: "Chandra",
  role: "Designer & Developer",
  location: "New Delhi, India",
  email: "hello@aayushmanchandra.com",
  tagline: "Design. Code. Impact.",
  intro:
    "I design and build brand systems, product interfaces and the immersive web experiences that hold them together — from the first sketch to the last commit.",
  bio: [
    "I’m Aayushman Chandra, an independent designer and developer. I work with founders and small teams to shape products that feel considered from the very first screen.",
    "My practice sits between design and engineering: type, motion, layout systems and the front-end code that makes them real. Nothing hands off — the same person who draws the grid ships it.",
  ],
  /** Hero stat strip. */
  stats: [
    { label: "Years practising", value: "08+" },
    { label: "Products shipped", value: "40+" },
    { label: "Brand systems", value: "25" },
    { label: `Based in${nbsp}(IST)`, value: "UTC+5:30" },
  ],
} as const;

export const capabilities = [
  {
    title: "Brand Systems",
    body: "Identity, type systems and the guidelines that keep them coherent at every scale.",
  },
  {
    title: "Product Interfaces",
    body: "Design systems, component libraries and interface work for web and mobile products.",
  },
  {
    title: "Creative Engineering",
    body: "WebGL, motion and interaction-heavy front-ends built with React, Three.js and GSAP.",
  },
  {
    title: "Growth Surfaces",
    body: "Landing pages, launches and the conversion detail work around them.",
  },
] as const;

/* ------------------------------------------------------------------ *
 * Navigation — wired into ImmersiveFullscreenNav
 * ------------------------------------------------------------------ */

export const navLinks: CustomNavbarLink[] = [
  { label: "Index", href: "#top" },
  { label: "Work", href: "#work" },
  { label: "Studio", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/** Unsplash stills that ride along the full-screen nav panel. */
export const navImages: string[] = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=1200&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1514906689926-25ba6dcb584b?w=900&h=1200&q=85&auto=format&fit=crop",
];

export const navSocials = [
  { type: "instagram", href: "https://instagram.com" }, // TODO: real handle
  { type: "twitter", href: "https://x.com" }, // TODO: real handle
  { type: "linkedin", href: "https://linkedin.com" }, // TODO: real profile
];

/** Text links used by the contact block (and mirrored in the footer). */
export const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" }, // TODO: real handle
  { label: "X", href: "https://x.com" }, // TODO: real handle
  { label: "LinkedIn", href: "https://linkedin.com" }, // TODO: real profile
];

/* ------------------------------------------------------------------ *
 * Work — wired into the LiquidGlassCarousel
 * ------------------------------------------------------------------ */

/** Unsplash IDs lifted from the component's own defaults (all verified stills). */
const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=900&h=1200&q=85&auto=format&fit=crop`;

export const projects: LiquidGlassCarouselItem[] = [
  { title: "Aperture — Product Site", src: unsplash("1600585154340-be6161a56a0c"), aspect: 3 / 4 },
  { title: "Meridian — Identity", src: unsplash("1514906689926-25ba6dcb584b"), aspect: 3 / 4 },
  { title: "Foundry — Design System", src: unsplash("1568557412756-7d219873dd11"), aspect: 3 / 4 },
  { title: "Northlight — Launch Film", src: unsplash("1581892805885-73bdd91beff0"), aspect: 3 / 4 },
  { title: "Terra — Packaging", src: unsplash("1482938289607-e9573fc25ebb"), aspect: 3 / 4 },
  { title: "Halo — WebGL Editorial", src: unsplash("1610846202780-b4d9837371ea"), aspect: 3 / 4 },
  { title: "Vantage — Dashboard", src: unsplash("1527630941-4a229fd674ab"), aspect: 3 / 4 },
  { title: "Solstice — Campaign", src: unsplash("1603786420263-ad59136a7409"), aspect: 3 / 4 },
];

/* ------------------------------------------------------------------ *
 * Footer — wired into Footer16
 * ------------------------------------------------------------------ */

export const footerColumns: Footer16Column[] = [
  {
    title: "Work",
    links: [
      { label: "Selected Projects", href: "#work" },
      { label: "Case Studies", href: "#work" },
      { label: "Availability", href: "#contact" },
      { label: "Playground", href: "/demos" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "About", href: "#about" },
      { label: "Approach", href: "#about" },
      { label: "Capabilities", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { label: "LinkedIn", href: "https://linkedin.com" }, // TODO
      { label: "X", href: "https://x.com" }, // TODO
      { label: "Instagram", href: "https://instagram.com" }, // TODO
      { label: "Dribbble", href: "https://dribbble.com" }, // TODO
    ],
  },
];

export const footerLegalLinks = [
  { label: "Privacy Policy", href: "/brand" }, // TODO: real policy page
  { label: "Terms of Service", href: "/brand" }, // TODO: real terms page
  { label: "Brand Assets", href: "/brand" },
];

export const footerSocials: Footer16Social[] = [
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" }, // TODO
  { label: "Twitter", href: "https://x.com", icon: "twitter" }, // TODO
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" }, // TODO
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" }, // TODO
];

export const footerCopyright = `©${nbsp}2026 Aayushman Chandra. All rights reserved.`;

export const footerTagline =
  "Independent designer and developer building brand systems\nand product interfaces — everything a launch needs,\nunder one roof.";

/**
 * Footer backdrop — `public/footer-bg.webp`, 1915×821, 22 KB.
 *
 * Drop your own artwork in at that path (same filename) and the footer picks it
 * up with no code change; alternatively point this constant at any remote URL.
 * If you supply a `.png`/`.jpg` instead, just update the extension here — WebP
 * is used because the source PNG was 2.1 MB and this is visually identical.
 */
export const footerBackgroundImage = "/footer-bg.webp";
