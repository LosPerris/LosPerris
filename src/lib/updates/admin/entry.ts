import type { UpdateApi, UpdateEntryRaw, UpdatesJsonFile } from "../types";

export const UPDATE_APIS: UpdateApi[] = [
  "Twitch",
  "Valorant",
  "Transcripts",
  "Códigos QR",
  "General",
];

export const UPDATE_TAGS = [
  "Fix",
  "Feature",
  "Infra",
  "Optimización",
  "A11y",
  "Fix & Feat",
] as const;

export interface UpdateEntryInput {
  id?: string;
  title: string;
  description: string;
  tag: string;
  api: UpdateApi;
  date: string;
  dateString: string;
}

export interface UpdatesFileShape extends UpdatesJsonFile {}

export type UpdateFileEntry = UpdateEntryRaw;

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export function validateEntry(
  entry: UpdateEntryInput,
  collection: "manual" | "planned",
): string | null {
  if (!entry.title?.trim() || entry.title.length < 4) {
    return "El título debe tener al menos 4 caracteres.";
  }
  if (!entry.description?.trim()) {
    return "La descripción es obligatoria.";
  }
  if (!UPDATE_APIS.includes(entry.api)) {
    return "API no válida.";
  }
  if (!entry.tag?.trim()) {
    return "La etiqueta es obligatoria.";
  }
  if (!entry.dateString?.trim()) {
    return "La fecha visible (dateString) es obligatoria.";
  }
  const parsed = new Date(entry.date);
  if (Number.isNaN(parsed.valueOf())) {
    return "La fecha ISO no es válida.";
  }
  if (!entry.id?.trim() && collection === "manual") {
    return null;
  }
  return null;
}

export function normalizeEntry(
  entry: UpdateEntryInput,
  collection: "manual" | "planned",
): UpdateFileEntry {
  const date = new Date(entry.date);
  const id =
    entry.id?.trim() ||
    `${collection}-${slugify(entry.title)}-${Date.now().toString(36)}`;

  return {
    id,
    title: entry.title.trim(),
    description: entry.description.trim(),
    tag: entry.tag.trim(),
    api: entry.api,
    date: date.toISOString(),
    dateString: entry.dateString.trim(),
  };
}
