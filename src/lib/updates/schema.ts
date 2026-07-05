import { z } from "zod";

export const UPDATE_API_VALUES = [
  "Twitch",
  "Valorant",
  "Transcripts",
  "Códigos QR",
  "General",
] as const;

export const updateEntrySchema = z.object({
  id: z.string().min(1).max(120),
  title: z.string().min(4).max(200),
  description: z.string().max(2000),
  tag: z.string().min(1).max(40),
  api: z.enum(UPDATE_API_VALUES),
  date: z
    .string()
    .min(1)
    .refine((v) => !Number.isNaN(new Date(v).valueOf()), "date ISO inválida"),
  dateString: z.string().min(1).max(80),
  commitSha: z.string().max(40).optional(),
});

export const updatesJsonFileSchema = z.object({
  entries: z.array(updateEntrySchema),
});

export const publishedUpdatesFileSchema = updatesJsonFileSchema.extend({
  syncedAt: z.string().nullable(),
  syncHealth: z
    .object({
      consecutiveNoPublish: z.number().int().nonnegative(),
      lastFetched: z.number().int().nonnegative().optional(),
      lastPublished: z.number().int().nonnegative().optional(),
    })
    .optional(),
});

export type UpdateEntryParsed = z.infer<typeof updateEntrySchema>;

export function parseUpdatesFile(raw: unknown) {
  return updatesJsonFileSchema.safeParse(raw);
}

export function parsePublishedFile(raw: unknown) {
  return publishedUpdatesFileSchema.safeParse(raw);
}
