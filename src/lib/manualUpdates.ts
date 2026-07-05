import manualFile from "../data/manual-updates.json";
import type { UpdateApi } from "./githubUpdates";

export interface ManualUpdateEntry {
  id: string;
  data: {
    title: string;
    date: Date;
    dateString: string;
    tag: string;
    api: UpdateApi;
    description: string;
    status: "published";
  };
}

interface ManualUpdatesFile {
  entries: Array<{
    id: string;
    title: string;
    description: string;
    tag: string;
    api: UpdateApi;
    date: string;
    dateString: string;
  }>;
}

/** Novedades históricas migradas desde content/updates (no se pisan con el sync de GitHub). */
export function fetchManualUpdates(): ManualUpdateEntry[] {
  const file = manualFile as ManualUpdatesFile;
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
    },
  }));
}
