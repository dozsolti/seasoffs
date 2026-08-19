import { defineConfig } from "vite";

import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { githubPagesSpa } from "@sctg/vite-plugin-github-pages-spa";

import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: "/seasoffs",
  plugins: [
    react(),
    tailwindcss(),
    githubPagesSpa({
      verbose: false, // Set to false to disable console logs
    }),
    VitePWA({
      registerType: "prompt",
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: "Seasoffs",
        short_name: "Seasoffs",
        description:
          "A simple calendar app to track your events and appointments.",
        theme_color: "#ffe58a",
        orientation: "portrait",
        display: "standalone",
        start_url: ".",
        background_color: "#f0e9ff",
      },

      // add this to cache all the
      // static assets in the public folder
      includeAssets: ["**/*"],
      workbox: {
        globPatterns: ["**/*"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: false,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
