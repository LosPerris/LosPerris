// @ts-check
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://losperris.dev",
  adapter: vercel(),
  output: "server",
  prefetch: true,
  integrations: [sitemap()],
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
