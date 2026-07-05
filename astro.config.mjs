// @ts-check
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://losperris.dev",
  adapter: vercel({
    // Web Analytics requiere "Audiences" activo en el dashboard de Vercel;
    // sin eso el script inyectado POSTea a /{id}/vitals y devuelve 404 en consola.
    webAnalytics: { enabled: false },
    imageService: false,
  }),
  output: "static",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover"
  },
  integrations: [sitemap({
    filter: (page) => !page.includes("/maria") && !page.includes("/admin"),
  })],
  image: {
    domains: [
      "mc-heads.net",
      "media.valorant-api.com",
      "cdn.discordapp.com",
      "img.youtube.com",
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    "/api": "/apis",
    "/guias": "/bots/documentacion",
    "/bots/guias": "/bots/documentacion",
  },
});
