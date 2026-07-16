#!/usr/bin/env node
/**
 * Importa commits de repos privados → src/data/updates/published.json
 *
 * Tokens (en orden):
 * 1. UPDATE_SYNC_TOKEN — PAT con lectura a los repos de APIs
 * 2. GITHUB_TOKEN — el de Actions (sirve si LosPerris tiene Access a esos repos)
 */
import {
  fetchCommitEntries,
  mergePublishedSync,
  readPublished,
  resolveSyncToken,
  updateSyncHealth,
  writePublished,
} from "./lib/sync-core.mjs";

async function main() {
  let token;
  try {
    token = await resolveSyncToken();
  } catch (err) {
    const store = readPublished();
    if (store.entries?.length) {
      console.warn(`[sync-published] ${err.message || err}`);
      console.warn(
        `[sync-published] Sin token usable; se mantiene published.json (${store.entries.length} entradas).`,
      );
      return;
    }
    throw err;
  }

  const store = readPublished();
  const beforeCount = store.entries?.length ?? 0;

  let entries;
  let errors;
  let evaluations;
  let stats;
  try {
    ({ entries, errors, evaluations, stats } = await fetchCommitEntries(token));
  } catch (err) {
    if (err.transient) {
      console.warn("[sync-published] GitHub devolvió errores transitorios en todos los repos:");
      console.warn(err.message || err);
      console.warn(
        `[sync-published] Se mantiene published.json (${beforeCount} entradas). Reintenta más tarde.`,
      );
      return;
    }
    throw err;
  }

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
