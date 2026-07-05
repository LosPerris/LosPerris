import type { UpdateApi, UpdateEntryRaw, UpdatesJsonFile } from "../types";
import { parseUpdateEntry } from "../schema";
import { sanitizeUpdateEntry } from "../sanitize";

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

const MONTHS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function formatVisibleDate(date: Date) {
  return `${date.getDate()} ${MONTHS_ES[date.getMonth()]} ${date.getFullYear()}`;
}

export function publishedIdFromPlanned(plannedId: string) {
  return `pub-from-${plannedId}`;
}

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

export function validateEntry(entry: UpdateEntryInput): string | null {
  const legacy = validateEntryLegacy(entry);
  if (legacy) return legacy;

  const parsed = parseUpdateEntry({
    id: entry.id ?? "draft-id",
    title: entry.title,
    description: entry.description,
    tag: entry.tag,
    api: entry.api,
    date: entry.date,
    dateString: entry.dateString,
  });
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Entrada inválida.";
  }
  return null;
}

function validateEntryLegacy(entry: UpdateEntryInput): string | null {
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
  return null;
}

/** Marca edición admin en entradas gh-* y conserva el texto original del commit. */
export function applySyncedEditMetadata(
  previous: UpdateFileEntry,
  next: UpdateFileEntry,
): UpdateFileEntry {
  if (!isSyncedGithubEntry(previous.id)) return sanitizeUpdateEntry(next);

  const sanitized = sanitizeUpdateEntry(next);
  return {
    ...sanitized,
    commitSha: previous.commitSha,
    adminModified: true,
    adminModifiedAt: new Date().toISOString(),
    originalTitle: previous.originalTitle ?? previous.title,
    originalDescription: previous.originalDescription ?? previous.description,
  };
}

/** Restaura título/descripción del commit; quita flags de edición admin. */
export function buildRevertedSyncedEntry(
  entry: UpdateFileEntry,
): UpdateFileEntry | null {
  if (!entry.adminModified || entry.originalTitle == null) return null;

  const {
    originalTitle,
    originalDescription,
    adminModified: _am,
    adminModifiedAt: _at,
    ...rest
  } = entry;

  return sanitizeUpdateEntry({
    ...rest,
    title: originalTitle,
    description: originalDescription ?? "",
  });
}

const SYNCED_GITHUB_ID = /^gh-(valorant|qr|transcripts)-/;

export function isSyncedGithubEntry(id: string) {
  return SYNCED_GITHUB_ID.test(id);
}

export function normalizeEntry(
  entry: UpdateEntryInput,
  collection: "published" | "planned",
): UpdateFileEntry {
  const date = new Date(entry.date);
  const id =
    entry.id?.trim() ||
    `${collection === "published" ? "pub" : "planned"}-${slugify(entry.title)}-${Date.now().toString(36)}`;

  return sanitizeUpdateEntry({
    id,
    title: entry.title.trim(),
    description: entry.description.trim(),
    tag: entry.tag.trim(),
    api: entry.api,
    date: date.toISOString(),
    dateString: entry.dateString.trim(),
  });
}
