#!/usr/bin/env node
/** Quita entradas gh-* que ya no pasan filtros o vienen de repos desactivados. */
import { analyzeCommit } from "./lib/filters.mjs";
import {
  isSyncedEntry,
  readPublished,
  writePublished,
  UPDATE_REPOS,
} from "./lib/sync-core.mjs";

const enabledRepoIds = new Set(
  UPDATE_REPOS.filter((r) => r.enabled !== false).map((r) => r.id),
);

const store = readPublished();
const before = store.entries?.length ?? 0;
const kept = (store.entries ?? []).filter((e) => {
  if (!isSyncedEntry(e.id)) return true;
  if (e.adminModified) return true;
  const repoId = e.id?.match(/^gh-([^-]+)-/)?.[1];
  if (repoId && !enabledRepoIds.has(repoId)) return false;
  return analyzeCommit(e.title).publish;
});
writePublished({ ...store, entries: kept });
console.log(`[prune-published] ${before} → ${kept.length} entradas`);
