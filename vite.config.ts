import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 8000,
    strictPort: true,
    // allow the Arena preview host (https://<port>-<sandboxId>.e2b.app)
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 8000,
    strictPort: true,
    allowedHosts: true,
  },
})
