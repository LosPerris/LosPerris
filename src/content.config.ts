import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const updatesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/updates" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    dateString: z.string(),
    tag: z.string(),
    api: z.enum(["Twitch", "Valorant", "Transcripts", "Códigos QR", "General"]),
    description: z.string(),
  }),
});

export const collections = {
  updates: updatesCollection,
};
