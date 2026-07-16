#!/usr/bin/env node
/**
 * Importa commits de repos privados → src/data/updates/published.json
 * Requiere UPDATE_SYNC_TOKEN (PAT con lectura a repos privados).
 * No usar el GITHUB_TOKEN automático de Actions: solo cubre este repo.
 */
import {
  fetchCommitEntries,
  mergePublishedSync,
  readPublished,
  updateSyncHealth,
  writePublished,
} from "./lib/sync-core.mjs";

const token = process.env.UPDATE_SYNC_TOKEN || process.env.GITHUB_TOKEN;

async function main() {
  if (!token) {
    const store = readPublished();
    if (store.entries?.length) {
      console.log(
        `[sync-published] Sin token; usando published.json (${store.entries.length} entradas, ${store.syncedAt ?? "sin fecha"}).`,
      );
      return;
    }
    console.warn(
      "[sync-published] Sin token y sin entradas. Configura UPDATE_SYNC_TOKEN en GitHub Secrets.",
    );
    writePublished({ syncedAt: null, entries: [] });
    return;
  }

  const store = readPublished();
  const beforeCount = store.entries?.length ?? 0;
  const { entries, errors, evaluations, stats } = await fetchCommitEntries(token);
  const merged = mergePublishedSync(store, entries);

  writePublished({
    ...merged,
    syncHealth: updateSyncHealth(store, stats),
  });

  console.log(
    `[sync-published] ${stats.published}/${stats.total} commits publicables → ${merged.entries.length} entradas (antes ${beforeCount})`,
  );
  if (merged.rewrites?.length) {
    for (const r of merged.rewrites) {
      console.warn(`[sync-published] REWRITE ${r.from} → ${r.to} (mismo título+api, nuevo sha)`);
    }
  }
  if (stats.skipped > 0) {
    console.log(`[sync-published] ${stats.skipped} commits omitidos (mantenimiento/ruido)`);
  }
  for (const ev of evaluations) {
    const flag = ev.publish ? "PUBLISH" : "skip";
    console.log(`[sync-published] ${flag} ${ev.repo}/${ev.sha} (${ev.reason}) — ${ev.subject}`);
  }
  if (errors.length) {
    console.warn("[sync-published] Advertencias:");
    for (const e of errors) console.warn(`  - ${e}`);
  }
}

main().catch((err) => {
  console.error("[sync-published] Error:", err.message || err);
  process.exit(1);
});
