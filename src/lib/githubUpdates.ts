export type UpdateApi =
  | "Twitch"
  | "Valorant"
  | "Transcripts"
  | "Códigos QR"
  | "General";

import cacheFile from "../data/github-updates-cache.json";

export interface GithubUpdateEntry {
  id: string;
  data: {
    title: string;
    date: Date;
    dateString: string;
    tag: string;
    api: UpdateApi;
    description: string;
    status: "published";
    commitUrl: string;
    commitSha: string;
    repoLabel: string;
  };
}

interface CachedEntry {
  id: string;
  title: string;
  description: string;
  tag: string;
  api: UpdateApi;
  status: "published";
  date: string;
  dateString: string;
  commitUrl: string;
  commitSha: string;
  repoLabel: string;
}

interface UpdatesCache {
  syncedAt: string | null;
  entries: CachedEntry[];
}

/** Lee commits sincronizados desde repos privados (caché generada por GitHub Actions). */
export async function fetchGithubUpdates(): Promise<GithubUpdateEntry[]> {
  if (import.meta.env.SKIP_GITHUB_UPDATES === "true") {
    return [];
  }

  const cache = cacheFile as UpdatesCache;
  if (!cache.entries?.length) {
    if (import.meta.env.DEV) {
      console.warn(
        "[updates] Caché vacía. Ejecuta el workflow sync-github-updates en GitHub o: UPDATE_SYNC_TOKEN=... node scripts/sync-github-updates.mjs",
      );
    }
    return [];
  }

  return cache.entries.map((e) => ({
    id: e.id,
    data: {
      title: e.title,
      description: e.description,
      tag: e.tag,
      api: e.api,
      status: "published",
      date: new Date(e.date),
      dateString: e.dateString,
      commitUrl: e.commitUrl,
      commitSha: e.commitSha,
      repoLabel: e.repoLabel,
    },
  }));
}

export function mergeUpdates<
  T extends { data: { date: Date; status?: string } },
>(manual: T[], github: GithubUpdateEntry[]): Array<T | GithubUpdateEntry> {
  return [...manual, ...github].sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
}
