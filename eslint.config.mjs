import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    /**
     * Vendor exception: everything under `components/ui` is third-party block
     * code (Cinematic Orbit Hero, Liquid Glass Carousel, Footer 16, Immersive
     * Full Screen Nav) kept byte-for-byte as it shipped. It predates the React
     * Compiler lint rules and uses a few patterns those rules flag —
     * `someRef.current = value` during render, an untyped `any` in the orbit
     * card props, and plain `<img>` tags inside WebGL/canvas-driven scenes
     * where `next/image` is not applicable.
     *
     * These rules stay ON everywhere else (`components/portfolio`, `app`,
     * `lib`, `assets`) so our own code is still held to them.
     */
    files: ["components/ui/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@next/next/no-img-element": "off",
      "react-hooks/refs": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
