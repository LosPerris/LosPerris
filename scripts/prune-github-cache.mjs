#!/usr/bin/env node
/** Quita entradas gh-* que ya no pasan los filtros o vienen de repos desactivados. */
import { shouldPublishCommit } from "./lib/update-filters.mjs";
import {
  readCache,
  writeCache,
  UPDATE_REPOS,
} from "./lib/github-updates-core.mjs";

const enabledRepoIds = new Set(
  UPDATE_REPOS.filter((r) => r.enabled !== false).map((r) => r.id),
);

const cache = readCache();
const before = cache.entries?.length ?? 0;
const kept = (cache.entries ?? []).filter((e) => {
  if (e.id?.startsWith("manual-")) return true;
  const repoId = e.id?.match(/^gh-([^-]+)-/)?.[1];
  if (repoId && !enabledRepoIds.has(repoId)) return false;
  return shouldPublishCommit(e.title);
});
writeCache(kept);
console.log(`[prune-cache] ${before} → ${kept.length} entradas`);
