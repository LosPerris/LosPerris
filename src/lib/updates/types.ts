export type UpdateApi =
  | "Twitch"
  | "Valorant"
  | "Transcripts"
  | "Códigos QR"
  | "General";

export interface UpdateEntryRaw {
  id: string;
  title: string;
  description: string;
  tag: string;
  api: UpdateApi;
  date: string;
  dateString: string;
  commitSha?: string;
}

export interface UpdatesJsonFile {
  entries: UpdateEntryRaw[];
}

export interface GithubCacheFile extends UpdatesJsonFile {
  syncedAt: string | null;
}

export interface PublishedUpdateEntry {
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

export interface PlannedUpdateEntry {
  id: string;
  data: {
    title: string;
    date: Date;
    dateString: string;
    tag: string;
    api: UpdateApi;
    description: string;
    status: "planned";
  };
}

/** Rutas en el repo (GitHub API + sync de CI). */
export const UPDATE_DATA_PATHS = {
  manual: "src/data/updates/manual.json",
  planned: "src/data/updates/planned.json",
  github: "src/data/updates/github-cache.json",
} as const;

export type UpdateCollection = keyof typeof UPDATE_DATA_PATHS;
