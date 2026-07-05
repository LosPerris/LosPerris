/**
 * Actualizaciones — lectura en build + sync de commits en CI.
 *
 * Datos:
 *   src/data/updates/published.json  → /actualizaciones
 *   src/data/updates/planned.json    → Próximamente (editar a mano en git)
 *
 * CI: scripts/updates/sync.mjs
 */
export type {
  PlannedUpdateEntry,
  PublishedUpdateEntry,
  PublishedUpdatesFile,
  UpdateApi,
  UpdateEntryRaw,
  UpdatesJsonFile,
} from "./types";

export { fetchPlannedUpdates, fetchPublishedUpdates } from "./sources";
