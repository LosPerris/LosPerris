#!/usr/bin/env node
/**
 * Smoke test local: valida JSON + filtros + lectura de commits (sin escribir).
 * Uso: node --env-file=.env scripts/updates/smoke.mjs
 */
import { readPublished } from "./lib/sync-core.mjs";
import { analyzeCommit } from "./lib/filters.mjs";
import { fetchCommitEntries } from "./lib/sync-core.mjs";

const token = process.env.GITHUB_TOKEN || process.env.UPDATE_SYNC_TOKEN;

const store = readPublished();
const entryCount = store.entries?.length ?? 0;
console.log(`[smoke] published.json → ${entryCount} entradas`);

const sample = analyzeCommit(
  "corregir vista previa del QR cuando el logo supera el tamaño máximo",
);
console.log(
  `[smoke] filtro ejemplo → publish=${sample.publish} reason=${sample.reason} tag=${sample.tag}`,
);

if (!token) {
  console.warn("[smoke] Sin GITHUB_TOKEN; omitiendo fetch de commits.");
  process.exit(0);
}

const { entries, stats, evaluations } = await fetchCommitEntries(token);
console.log(
  `[smoke] GitHub → ${stats.published}/${stats.total} publicables, ${entries.length} entradas generadas`,
);
console.log(`[smoke] primeras evaluaciones:`);
for (const ev of evaluations.slice(0, 5)) {
  console.log(`  ${ev.publish ? "✓" : "·"} ${ev.repo}/${ev.sha} (${ev.reason})`);
}

console.log("[smoke] OK");
