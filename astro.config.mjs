// @ts-check
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://losperris.dev",
  adapter: vercel({
    webAnalytics: { enabled: true },
    imagesConfig: { sizes: [320, 480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840], domains: ["losperris.dev"] },
    imageService: true,
  }),
  output: "server",
  prefetch: true,
  integrations: [sitemap({
    filter: (page) => !page.includes("/maria"),
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
    "/guias": "/bots/documentacion",
    "/bots/guias": "/bots/documentacion",
  },
});
