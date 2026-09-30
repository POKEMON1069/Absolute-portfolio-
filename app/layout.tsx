import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

/**
 * Origins the page pulls media from. Both are fetched with
 * `crossOrigin="anonymous"` (three.js textures + plain <img>), so the
 * preconnect has to be opened the same way to actually be reused.
 */
const MEDIA_ORIGINS = [
  "https://images.unsplash.com",
  "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev",
  // Only used if you point `footerBackgroundImage` back at the block's own CDN.
  "https://assets.watermelon.sh",
];

export const metadata: Metadata = {
  title: {
    default: "Aayushman Chandra — Designer & Developer",
    template: "%s · Aayushman Chandra",
  },
  description:
    "Portfolio of Aayushman Chandra — designer and developer building brand systems, product interfaces and immersive web experiences.",
  keywords: [
    "Aayushman Chandra",
    "portfolio",
    "designer",
    "developer",
    "brand systems",
    "creative developer",
  ],
  authors: [{ name: "Aayushman Chandra" }],
  creator: "Aayushman Chandra",
  openGraph: {
    title: "Aayushman Chandra — Designer & Developer",
    description:
      "Brand systems, product interfaces and immersive web experiences by Aayushman Chandra.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aayushman Chandra — Designer & Developer",
    description:
      "Brand systems, product interfaces and immersive web experiences.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /* Zoom is deliberately left enabled (no `maximumScale`). */
  viewportFit: "cover",
  /* The site chrome is light even though several sections are dark, so the
     browser UI (address bar, scrollbars, form controls) stays light. */
  colorScheme: "light",
  themeColor: "#f8fafc",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {/* React hoists these into <head>. */}
        {MEDIA_ORIGINS.map((origin) => (
          <link
            key={origin}
            rel="preconnect"
            href={origin}
            crossOrigin="anonymous"
          />
        ))}

        {/* First tab stop: skip the fixed header and jump into the content. */}
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-full focus:bg-neutral-900 focus:px-5 focus:text-sm focus:font-medium focus:text-slate-50"
        >
          Skip to content
        </a>

        {children}
      </body>
    </html>
  );
}
