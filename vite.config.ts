import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import packageJson from "./package.json" with { type: "json" };

export default defineConfig({
  base: "./",
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Tracklet",
        short_name: "Tracklet",
        description: "Copilote financier hors ligne pour les micro-entrepreneurs",
        lang: "fr",
        theme_color: "#185FA5",
        background_color: "#FAFBFC",
        display: "standalone",
        orientation: "portrait",
        start_url: "./#/dashboard",
        scope: ".",
        icons: [
          {
            src: "icon-192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "icon-512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
      workbox: { globPatterns: ["**/*.{js,css,html,ico,png,svg}"] },
    }),
  ],
  test: {
    environment: "node",
    coverage: { provider: "v8", reporter: ["text", "html"] },
  },
});
