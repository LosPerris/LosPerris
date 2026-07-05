import manualFile from "../../data/updates/manual.json";
import plannedFile from "../../data/updates/planned.json";
import githubFile from "../../data/updates/github-cache.json";
import type {
  GithubCacheFile,
  PlannedUpdateEntry,
  PublishedUpdateEntry,
  UpdatesJsonFile,
} from "./types";

function mapPublished(
  file: UpdatesJsonFile,
  extra?: (
    raw: UpdatesJsonFile["entries"][number],
  ) => Partial<PublishedUpdateEntry["data"]>,
): PublishedUpdateEntry[] {
  return (file.entries ?? []).map((e) => ({
    id: e.id,
    data: {
      title: e.title,
      description: e.description,
      tag: e.tag,
      api: e.api,
      status: "published" as const,
      date: new Date(e.date),
      dateString: e.dateString,
      ...extra?.(e),
    },
  }));
}

/** Historial escrito a mano — no lo pisa el sync de GitHub. */
export function fetchManualUpdates(): PublishedUpdateEntry[] {
  return mapPublished(manualFile as UpdatesJsonFile);
}

/** Avisos «Próximamente» — no los pisa el sync de GitHub. */
export function fetchPlannedUpdates(): PlannedUpdateEntry[] {
  const file = plannedFile as UpdatesJsonFile;
  return (file.entries ?? []).map((e) => ({
    id: e.id,
    data: {
      title: e.title,
      description: e.description,
      tag: e.tag,
      api: e.api,
      status: "planned" as const,
      date: new Date(e.date),
      dateString: e.dateString,
    },
  }));
}

/** Commits sincronizados desde repos de APIs (caché de CI). */
export async function fetchGithubUpdates(): Promise<PublishedUpdateEntry[]> {
  if (import.meta.env.SKIP_GITHUB_UPDATES === "true") {
    return [];
  }

  const cache = githubFile as GithubCacheFile;
  if (!cache.entries?.length) {
    if (import.meta.env.DEV) {
      console.warn(
        "[updates] Caché vacía. Ejecuta sync-github-updates en GitHub o: UPDATE_SYNC_TOKEN=... pnpm sync:updates",
      );
    }
    return [];
  }

  return mapPublished(cache, (e) => ({
    commitSha: e.commitSha,
  }));
}

export async function fetchPublishedUpdates(): Promise<PublishedUpdateEntry[]> {
  const [manual, github] = await Promise.all([
    Promise.resolve(fetchManualUpdates()),
    fetchGithubUpdates(),
  ]);
  return [...manual, ...github].sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
}
