// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  output: 'server',
  image: {
    domains: ["mc-heads.net", "media.valorant-api.com", "cdn.discordapp.com", "img.youtube.com"],
  },
  vite: {
    plugins: [tailwindcss()]
  }
});