import publishedFile from "../../data/updates/published.json";
import plannedFile from "../../data/updates/planned.json";
import { parsePublishedFile, parseUpdatesFile } from "./schema";
import { sanitizeUpdateText } from "./sanitize";
import type {
  PlannedUpdateEntry,
  PublishedUpdateEntry,
  UpdateEntryRaw,
  UpdatesJsonFile,
} from "./types";

function safeEntries(file: UpdatesJsonFile, label: string): UpdateEntryRaw[] {
  const parsed = parseUpdatesFile(file);
  if (!parsed.success) {
    console.error(`[updates] ${label} inválido:`, parsed.error.issues);
    return [];
  }
  return parsed.data.entries.filter((entry) => {
    const title = sanitizeUpdateText(entry.title, 200);
    const description = sanitizeUpdateText(entry.description, 2000);
    return title.length >= 4 && description.length >= 0;
  });
}

function mapPublished(entries: UpdateEntryRaw[]): PublishedUpdateEntry[] {
  return entries.map((e) => ({
    id: e.id,
    data: {
      title: sanitizeUpdateText(e.title, 200),
      description: sanitizeUpdateText(e.description, 2000),
      tag: e.tag,
      api: e.api,
      status: "published" as const,
      date: new Date(e.date),
      dateString: e.dateString,
      commitSha: e.commitSha,
    },
  }));
}

/** Todo lo publicado en /actualizaciones (commits sync + entradas manuales en git). */
export function fetchPublishedUpdates(): PublishedUpdateEntry[] {
  if (import.meta.env.SKIP_GITHUB_UPDATES === "true") {
    return [];
  }

  const parsed = parsePublishedFile(publishedFile);
  if (!parsed.success) {
    console.error("[updates] published.json inválido:", parsed.error.issues);
    return [];
  }

  const entries = safeEntries(parsed.data, "published.json");
  if (!entries.length && import.meta.env.DEV) {
    console.warn(
      "[updates] published.json vacío. Ejecuta sync-published en CI o: UPDATE_SYNC_TOKEN=... pnpm sync:updates",
    );
  }

  return mapPublished(entries).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
}

/** Avisos «Próximamente». */
export function fetchPlannedUpdates(): PlannedUpdateEntry[] {
  const parsed = parseUpdatesFile(plannedFile);
  if (!parsed.success) {
    console.error("[updates] planned.json inválido:", parsed.error.issues);
    return [];
  }

  return safeEntries(parsed.data, "planned.json").map((e) => ({
    id: e.id,
    data: {
      title: sanitizeUpdateText(e.title, 200),
      description: sanitizeUpdateText(e.description, 2000),
      tag: e.tag,
      api: e.api,
      status: "planned" as const,
      date: new Date(e.date),
      dateString: e.dateString,
    },
  }));
}
