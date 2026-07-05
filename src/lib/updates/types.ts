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

export interface PublishedUpdatesFile extends UpdatesJsonFile {
  syncedAt: string | null;
  syncHealth?: {
    consecutiveNoPublish: number;
    lastFetched?: number;
    lastPublished?: number;
  };
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
