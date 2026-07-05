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
  /** Editada en admin; el sync no la sobrescribe con el commit original. */
  adminModified?: boolean;
  adminModifiedAt?: string;
  originalTitle?: string;
  originalDescription?: string;
}

export interface UpdatesJsonFile {
  entries: UpdateEntryRaw[];
}

export interface PublishedUpdatesFile extends UpdatesJsonFile {
  syncedAt: string | null;
  /** IDs gh-* que el admin eliminó; el sync no las vuelve a agregar. */
  suppressedIds?: string[];
  /** Métricas para alertas de sync (corridas sin publicables). */
  syncHealth?: {
    consecutiveNoPublish: number;
    lastFetched?: number;
    lastPublished?: number;
  };
}

/** @deprecated Usar PublishedUpdatesFile */
export type GithubCacheFile = PublishedUpdatesFile;

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
  published: "src/data/updates/published.json",
  planned: "src/data/updates/planned.json",
} as const;

export type UpdateCollection = keyof typeof UPDATE_DATA_PATHS;
