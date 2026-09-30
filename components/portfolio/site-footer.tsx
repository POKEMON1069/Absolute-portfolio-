"use client";

import { MotionConfig } from "motion/react";

import { Footer16 } from "@/components/ui/footer16";
import { useTranslateGuard } from "@/hooks/use-translate-guard";
import {
  footerBackgroundImage,
  footerColumns,
  footerCopyright,
  footerLegalLinks,
  footerSocials,
  footerTagline,
  person,
} from "@/lib/portfolio-data";

/**
 * Site footer — `Footer16` with the portfolio's own copy and the supplied
 * backdrop artwork (`public/footer-bg.png`). The logo the component renders
 * next to the brand row is `assets/logo-icon.tsx`, i.e. the supplied mark.
 *
 * `MotionConfig reducedMotion="user"` is the additive fix for this block not
 * checking `prefers-reduced-motion` itself: under a reduced-motion preference
 * Motion drops every transform/translate reveal, leaving a plain opacity fade.
 */
export function SiteFooter() {
  useTranslateGuard();

  return (
    <MotionConfig reducedMotion="user">
      <Footer16
        brandName={person.name.toUpperCase()}
        tagline={footerTagline}
        columns={footerColumns}
        legalLinks={footerLegalLinks}
        socials={footerSocials}
        copyright={footerCopyright}
        backgroundImage={footerBackgroundImage}
      />
    </MotionConfig>
  );
}
