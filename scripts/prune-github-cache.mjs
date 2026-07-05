#!/usr/bin/env node
/** Quita entradas gh-* que ya no pasan los filtros de novedades. */
import { shouldPublishCommit } from "./lib/update-filters.mjs";
import { readCache, writeCache } from "./lib/github-updates-core.mjs";

const cache = readCache();
const before = cache.entries?.length ?? 0;
const kept = (cache.entries ?? []).filter((e) => {
  if (e.id?.startsWith("manual-")) return true;
  return shouldPublishCommit(e.title);
});
writeCache(kept);
console.log(`[prune-cache] ${before} → ${kept.length} entradas`);
