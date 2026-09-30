import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aayushman Chandra — Designer & Developer",
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

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      {/*
        The site is intentionally light (`:root` tokens) with dark sections baked
        into individual blocks, so no `dark` class is applied here. Add
        `className="dark"` to <html> to flip every shadcn token at once.
      */}
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
