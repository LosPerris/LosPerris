export type {
  GithubCacheFile,
  PlannedUpdateEntry,
  PublishedUpdateEntry,
  UpdateApi,
  UpdateCollection,
  UpdateEntryRaw,
  UpdatesJsonFile,
} from "./types";

export { UPDATE_DATA_PATHS } from "./types";

export {
  fetchGithubUpdates,
  fetchManualUpdates,
  fetchPlannedUpdates,
  fetchPublishedUpdates,
} from "./sources";

/** @deprecated Usar PublishedUpdateEntry */
export type { PublishedUpdateEntry as GithubUpdateEntry } from "./types";

/** @deprecated Usar PublishedUpdateEntry */
export type { PublishedUpdateEntry as ManualUpdateEntry } from "./types";
