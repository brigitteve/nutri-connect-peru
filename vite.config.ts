import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Standard Vite SPA configuration — no SSR, no Cloudflare Workers.
// TanStackRouterVite generates src/routeTree.gen.ts automatically from the
// files found inside src/routes/ when the dev server starts.
export default defineConfig({
  plugins: [
    // 1. Route-tree generation MUST come before React plugin.
    TanStackRouterVite({ routesDirectory: "src/routes" }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  server: {
    port: 3000,
    host: true,
    strictPort: false,
  },
  preview: {
    port: 3001,
    host: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
