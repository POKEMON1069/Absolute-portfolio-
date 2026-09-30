import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Aayushman Chandra — brand mark.
 *
 * The raw asset is a 256×256 four-point "spark" with notched corners, drawn in
 * `rgb(84, 84, 84)` (#545454). The geometry below is byte-for-byte the supplied
 * path; only the paint is switched to `currentColor` so the mark reads
 * correctly on both the light sections and the dark footer/nav (it simply
 * inherits the surrounding text colour).
 */
export const LOGO_COLOR = "#545454";

export default function LogoIcon({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("size-6 shrink-0", className)}
      {...props}
    >
      <path
        d="M 108 0 C 119.046 0 128 8.954 128 20 L 128.007 19.483 C 128.281 8.676 137.127 0 148 0 L 236 0 C 247.046 0 256 8.954 256 20 L 256 108 C 256 119.046 247.046 128 236 128 C 247.046 128 256 136.954 256 148 L 256 236 C 256 247.046 247.046 256 236 256 L 148 256 C 136.954 256 128 247.046 128 236 C 128 247.046 119.046 256 108 256 L 20 256 C 8.954 256 0 247.046 0 236 L 0 148 C 0 137.127 8.676 128.281 19.483 128.007 L 20 128 C 8.954 128 0 119.046 0 108 L 0 20 C 0 8.954 8.954 0 20 0 Z M 128 64 C 128 99.346 99.346 128 64 128 C 99.346 128 128 156.654 128 192 C 128 156.654 156.654 128 192 128 C 156.654 128 128 99.346 128 64 Z"
        fill="currentColor"
      />
    </svg>
  );
}
