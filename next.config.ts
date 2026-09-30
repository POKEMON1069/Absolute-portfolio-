import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The dev server is served from a proxied preview host, which is a different
   * origin than `localhost`. Next blocks cross-origin dev requests by default,
   * so the preview hosts are allowlisted here. Remove this on your own machine
   * if you only ever load the app from localhost.
   */
  allowedDevOrigins: [
    "*.e2b.app",
    "*.arena.ai",
    "*.21st.dev",
    "*.preview.app",
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
