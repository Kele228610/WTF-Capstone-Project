
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: [
        "favicon.ico",
      ],

      manifest: {
        name: "EduLearn Offline",
        short_name: "EduLearn",
        description: "Offline-first learning platform",
        theme_color: "#124CC9",
        background_color: "#124CC9",
        display: "standalone",
        start_url: "/",
        scope: "/",

        icons: [
          {
            src: "/edulearn-logo-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/edulearn-logo-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      },

      workbox: {
        navigateFallback: "/index.html",
        cleanupOutdatedCaches: true
      }
    })
  ]
});