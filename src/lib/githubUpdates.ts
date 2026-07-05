export type UpdateApi =
  | "Twitch"
  | "Valorant"
  | "Transcripts"
  | "Códigos QR"
  | "General";

import cacheFile from "../../data/github-updates-cache.json";

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
    commitSha?: string;
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
  commitSha?: string;
}

interface UpdatesCache {
  syncedAt: string | null;
  entries: CachedEntry[];
}

/** Lee novedades sincronizadas (caché en /data, solo build-time; no va a public/). */
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
      commitSha: e.commitSha,
    },
  }));
}
