/**
 * Novedades — módulo del sitio
 *
 * Datos (JSON en repo):
 *   src/data/updates/published.json  → /actualizaciones (publicadas)
 *   src/data/updates/planned.json    → sección Próximamente
 *
 * Runtime (build):
 *   sources.ts  — lee y valida JSON
 *   schema.ts   — Zod
 *   sanitize.ts — texto seguro
 *
 * Admin (Vercel):
 *   admin/      — panel /admin/novedades + API /api/admin/updates
 *
 * CI / local:
 *   scripts/updates/sync.mjs  — commits Valorant/QR → published.json
 */
export type {
  GithubCacheFile,
  PlannedUpdateEntry,
  PublishedUpdateEntry,
  PublishedUpdatesFile,
  UpdateApi,
  UpdateCollection,
  UpdateEntryRaw,
  UpdatesJsonFile,
} from "./types";

export { UPDATE_DATA_PATHS } from "./types";

export { fetchPlannedUpdates, fetchPublishedUpdates } from "./sources";
