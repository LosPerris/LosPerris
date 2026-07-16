import { analyzeCommit, filterStats } from "./filters.mjs";
import { sanitizeUpdateText } from "./sanitize.mjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PUBLISHED_PATH = path.join(
  __dirname,
  "../../../src/data/updates/published.json",
);

const SYNCED_ENTRY_ID = /^gh-(valorant|qr|transcripts|twitch)-/;

export function isSyncedEntry(id) {
  return SYNCED_ENTRY_ID.test(id ?? "");
}

/** Clave para detectar el mismo cambio con distinto sha (rebase/force-push). */
export function entryDedupeKey(entry) {
  const norm = (entry.title ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
  return `${entry.api}::${norm}`;
}

export const MONTHS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const UPDATE_REPOS = [
  {
    id: "valorant",
    owner: "Ponss17",
    repo: "LosPerrisValorantApi",
    branch: "main",
    api: "Valorant",
  },
  {
    id: "qr",
    owner: "Ponss17",
    repo: "GeneradorQR",
    branch: "main",
    api: "Códigos QR",
  },
  {
    id: "twitch",
    owner: "Ponss17",
    repo: "twitch_api",
    branch: "master",
    api: "Twitch",
  },
  {
    id: "transcripts",
    owner: "Ponss17",
    repo: "transcripts",
    branch: "main",
    api: "Transcripts",
    enabled: false,
  },
];

export const MAX_AGE_DAYS = 90;
export const MAX_PER_REPO = 12;
const STALE_SYNC_ALERT_THRESHOLD = 5;

export function formatDateString(date) {
  return `${date.getDate()} ${MONTHS_ES[date.getMonth()]} ${date.getFullYear()}`;
}

export function parseCommitMessage(message) {
  const { title, body, tag } = analyzeCommit(message);
  return {
    title: sanitizeUpdateText(title, 120),
    description: sanitizeUpdateText(body, 400),
    tag,
  };
}

const TRANSIENT_HTTP = new Set([429, 500, 502, 503, 504]);
const FETCH_RETRIES = 5;
const FETCH_RETRY_BASE_MS = 2000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function summarizeErrorBody(body) {
  if (!body) return "";
  if (body.includes("Hello future GitHubber") || body.trimStart().startsWith("<!DOCTYPE")) {
    return " — (HTML de error de GitHub; suele ser 5xx/gateway o token inválido)";
  }
  try {
    const json = JSON.parse(body);
    if (json?.message) return ` — ${String(json.message).slice(0, 160)}`;
  } catch {
    /* ignore */
  }
  return ` — ${body.slice(0, 120)}`;
}

function githubHeaders(token) {
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "LosPerris-Updates",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${token}`,
  };
}

/** Comprueba que el token autentique; no valida acceso a repos concretos. */
export async function probeGithubToken(token) {
  const res = await fetch("https://api.github.com/rate_limit", {
    headers: githubHeaders(token),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return {
      ok: false,
      status: res.status,
      detail: summarizeErrorBody(body),
    };
  }
  const data = await res.json();
  return {
    ok: true,
    status: res.status,
    remaining: data?.resources?.core?.remaining,
    limit: data?.resources?.core?.limit,
  };
}

/**
 * PAT (UPDATE_SYNC_TOKEN) si autentica; si no, GITHUB_TOKEN de Actions
 * (puede leer otros repos privados si el repo tiene "Access" configurado).
 */
export async function resolveSyncToken() {
  const pat = (process.env.UPDATE_SYNC_TOKEN || "").trim();
  const actionsToken = (process.env.GITHUB_TOKEN || "").trim();

  if (pat) {
    const probe = await probeGithubToken(pat);
    if (probe.ok) {
      console.log(
        `[sync-published] Token: UPDATE_SYNC_TOKEN (rate ${probe.remaining}/${probe.limit})`,
      );
      return pat;
    }
    console.warn(
      `[sync-published] UPDATE_SYNC_TOKEN falló HTTP ${probe.status}${probe.detail}; probando GITHUB_TOKEN de Actions`,
    );
  } else {
    console.warn("[sync-published] Sin UPDATE_SYNC_TOKEN; usando GITHUB_TOKEN de Actions");
  }

  if (actionsToken && actionsToken !== pat) {
    const probe = await probeGithubToken(actionsToken);
    if (probe.ok) {
      console.log(
        `[sync-published] Token: GITHUB_TOKEN (rate ${probe.remaining}/${probe.limit})`,
      );
      return actionsToken;
    }
    throw new Error(
      `Ningún token válido. UPDATE_SYNC_TOKEN y GITHUB_TOKEN fallaron (último HTTP ${probe.status}${probe.detail}). Revisa el secret o Actions → Access a repos privados.`,
    );
  }

  throw new Error(
    "Falta token. Configura UPDATE_SYNC_TOKEN (PAT con lectura a los repos de APIs) o permite Access del GITHUB_TOKEN a esos repos.",
  );
}

async function fetchRepoCommits(cfg, token) {
  const since = new Date();
  since.setDate(since.getDate() - MAX_AGE_DAYS);

  const url = new URL(
    `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/commits`,
  );
  url.searchParams.set("sha", cfg.branch);
  url.searchParams.set("per_page", String(MAX_PER_REPO));
  url.searchParams.set("since", since.toISOString());

  let lastError = null;

  for (let attempt = 1; attempt <= FETCH_RETRIES; attempt++) {
    const res = await fetch(url, {
      headers: githubHeaders(token),
    });

    if (res.ok) return res.json();

    const body = await res.text().catch(() => "");
    lastError = new Error(
      `${cfg.owner}/${cfg.repo}: HTTP ${res.status} ${res.statusText}${summarizeErrorBody(body)}`,
    );

    // 401/403/404 no se reintentan: suelen ser token/permisos.
    if (!TRANSIENT_HTTP.has(res.status) || attempt === FETCH_RETRIES) {
      throw lastError;
    }

    const retryAfter = Number(res.headers.get("retry-after"));
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : FETCH_RETRY_BASE_MS * 2 ** (attempt - 1);

    console.warn(
      `[sync-published] ${cfg.owner}/${cfg.repo}: HTTP ${res.status}, reintento ${attempt}/${FETCH_RETRIES} en ${waitMs}ms`,
    );
    await sleep(waitMs);
  }

  throw lastError;
}

function isTransientSyncError(message) {
  return /\bHTTP (429|500|502|503|504)\b/.test(message || "");
}

/** @param {string} token PAT o GITHUB_TOKEN con lectura a los repos */
export async function fetchCommitEntries(token) {
  if (!token) {
    throw new Error(
      "Falta token. Configura UPDATE_SYNC_TOKEN o GITHUB_TOKEN con acceso a los repos de APIs.",
    );
  }

  const entries = [];
  const errors = [];
  const evaluations = [];
  const stats = { fetched: 0, published: 0 };

  for (const cfg of UPDATE_REPOS) {
    if (cfg.enabled === false) continue;
    try {
      const commits = await fetchRepoCommits(cfg, token);
      stats.fetched += commits.length;

      for (const c of commits) {
        const analysis = analyzeCommit(c.commit.message);
        const sha7 = c.sha.slice(0, 7);
        evaluations.push({
          repo: cfg.id,
          sha: sha7,
          publish: analysis.publish,
          reason: analysis.reason,
          subject: c.commit.message.split("\n")[0]?.slice(0, 80) ?? "",
        });

        if (!analysis.publish) continue;

        stats.published += 1;
        const date = new Date(c.commit.author.date);
        entries.push({
          id: `gh-${cfg.id}-${sha7}`,
          title: sanitizeUpdateText(analysis.title, 120),
          description: sanitizeUpdateText(analysis.body, 400),
          tag: analysis.tag,
          api: cfg.api,
          date: date.toISOString(),
          dateString: formatDateString(date),
          commitSha: sha7,
        });
      }
    } catch (err) {
      errors.push(err.message || String(err));
    }
  }

  if (entries.length === 0 && errors.length > 0) {
    const allTransient = errors.every(isTransientSyncError);
    const err = new Error(errors.join("\n"));
    err.transient = allTransient;
    throw err;
  }

  entries.sort((a, b) => new Date(b.date) - new Date(a.date));
  return { entries, errors, evaluations, stats: filterStats(stats.fetched, stats.published) };
}

export function readPublished() {
  if (!fs.existsSync(PUBLISHED_PATH)) {
    return { syncedAt: null, entries: [] };
  }
  return JSON.parse(fs.readFileSync(PUBLISHED_PATH, "utf8"));
}

export function writePublished(store) {
  const payload = {
    syncedAt: store.syncedAt ?? new Date().toISOString(),
    entries: store.entries ?? [],
    ...(store.syncHealth ? { syncHealth: store.syncHealth } : {}),
  };
  fs.mkdirSync(path.dirname(PUBLISHED_PATH), { recursive: true });
  fs.writeFileSync(PUBLISHED_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return payload;
}

export function mergePublishedSync(store, fetchedEntries) {
  const merged = [];
  const seen = new Set();
  const dedupeKeys = new Map();
  const rewrites = [];

  for (const entry of store.entries ?? []) {
    if (!isSyncedEntry(entry.id)) {
      merged.push(entry);
      seen.add(entry.id);
      continue;
    }
    dedupeKeys.set(entryDedupeKey(entry), entry.id);
  }

  for (const fetched of fetchedEntries) {
    if (seen.has(fetched.id)) continue;

    const key = entryDedupeKey(fetched);
    const duplicateId = dedupeKeys.get(key);
    if (duplicateId && duplicateId !== fetched.id) {
      const dupIdx = merged.findIndex((e) => e.id === duplicateId);
      if (dupIdx >= 0) merged.splice(dupIdx, 1);
      seen.delete(duplicateId);
      rewrites.push({ from: duplicateId, to: fetched.id });
    }

    merged.push(fetched);
    seen.add(fetched.id);
    dedupeKeys.set(key, fetched.id);
  }

  for (const entry of store.entries ?? []) {
    if (isSyncedEntry(entry.id) && !seen.has(entry.id)) {
      merged.push(entry);
      seen.add(entry.id);
    }
  }

  merged.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    syncedAt: new Date().toISOString(),
    entries: merged,
    rewrites,
  };
}

export function updateSyncHealth(store, stats) {
  const prev = store.syncHealth?.consecutiveNoPublish ?? 0;
  const noPublish = stats.published === 0 && stats.total > 0;
  const health = {
    consecutiveNoPublish: noPublish ? prev + 1 : 0,
    lastFetched: stats.total,
    lastPublished: stats.published,
  };
  if (health.consecutiveNoPublish >= STALE_SYNC_ALERT_THRESHOLD) {
    console.warn(
      `[sync-published] ALERTA: ${health.consecutiveNoPublish} corridas seguidas sin commits publicables (de ${stats.total} leídos). Revisa filtros o tokens.`,
    );
  }
  return health;
}
