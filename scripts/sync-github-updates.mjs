#!/usr/bin/env node
/**
 * Sincroniza commits de repos privados → src/data/github-updates-cache.json
 * Requiere GITHUB_TOKEN o UPDATE_SYNC_TOKEN con acceso de lectura a los repos.
 */
import {
  CACHE_PATH,
  fetchAllGithubEntries,
  readCache,
  writeCache,
} from "./lib/github-updates-core.mjs";

const token = process.env.GITHUB_TOKEN || process.env.UPDATE_SYNC_TOKEN;

async function main() {
  if (!token) {
    const cache = readCache();
    if (cache.entries?.length) {
      console.log(
        `[sync-updates] Sin token; usando caché existente (${cache.entries.length} entradas, ${cache.syncedAt ?? "sin fecha"}).`,
      );
      return;
    }
    console.warn(
      "[sync-updates] Sin token y sin caché. Configura UPDATE_SYNC_TOKEN en GitHub Secrets.",
    );
    writeCache([]);
    return;
  }

  const { entries, errors, stats } = await fetchAllGithubEntries(token);
  writeCache(entries);

  console.log(
    `[sync-updates] ${stats.published}/${stats.total} commits publicables → ${entries.length} entradas`,
  );
  if (stats.skipped > 0) {
    console.log(`[sync-updates] ${stats.skipped} commits omitidos (mantenimiento/ruido)`);
  }
  if (errors.length) {
    console.warn("[sync-updates] Advertencias:");
    for (const e of errors) console.warn(`  - ${e}`);
  }
}

main().catch((err) => {
  console.error("[sync-updates] Error:", err.message || err);
  process.exit(1);
});
