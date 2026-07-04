import { shouldPublishCommit, filterStats } from "./update-filters.mjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const CACHE_PATH = path.join(
  __dirname,
  "../../src/data/github-updates-cache.json",
);

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
    id: "transcripts",
    owner: "Ponss17",
    repo: "transcripts",
    branch: "main",
    api: "Transcripts",
  },
];

export const MAX_AGE_DAYS = 90;
export const MAX_PER_REPO = 12;

export function formatDateString(date) {
  return `${date.getDate()} ${MONTHS_ES[date.getMonth()]} ${date.getFullYear()}`;
}

export function parseCommitMessage(message) {
  const lines = message.split("\n");
  const subject = lines[0]?.trim() ?? "Actualización";
  const body = lines
    .slice(1)
    .map((l) => l.trim())
    .filter(Boolean)
    .join(" ");

  const cc = subject.match(
    /^(fix|feat|perf|docs|chore|refactor|a11y|infra)(\([^)]+\))?!?:\s*(.+)$/i,
  );

  const tagMap = {
    fix: "Fix",
    feat: "Feature",
    perf: "Optimización",
    docs: "Infra",
    chore: "Infra",
    refactor: "Optimización",
    a11y: "A11y",
    infra: "Infra",
  };

  if (cc) {
    const type = cc[1].toLowerCase();
    const title = cc[3].trim();
    return {
      title: title.slice(0, 120),
      description: (body || title).slice(0, 400),
      tag: tagMap[type] ?? "Infra",
    };
  }

  return {
    title: subject.slice(0, 120),
    description: (body || subject).slice(0, 400),
    tag: "Infra",
  };
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

  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "LosPerris-Updates",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `${cfg.owner}/${cfg.repo}: HTTP ${res.status} ${res.statusText}${body ? ` — ${body.slice(0, 120)}` : ""}`,
    );
  }

  return res.json();
}

/** @param {string} token PAT con acceso de lectura a repos privados */
export async function fetchAllGithubEntries(token) {
  if (!token) {
    throw new Error(
      "Falta GITHUB_TOKEN. Los repos son privados: crea un PAT (scope repo) y configúralo en GitHub Secrets como UPDATE_SYNC_TOKEN.",
    );
  }

  const entries = [];
  const errors = [];
  const stats = { fetched: 0, published: 0 };

  for (const cfg of UPDATE_REPOS) {
    try {
      const commits = await fetchRepoCommits(cfg, token);
      stats.fetched += commits.length;

      for (const c of commits) {
        if (!shouldPublishCommit(c.commit.message)) continue;

        stats.published += 1;
        const { title, description, tag } = parseCommitMessage(c.commit.message);
        const date = new Date(c.commit.author.date);
        entries.push({
          id: `gh-${cfg.id}-${c.sha.slice(0, 7)}`,
          title,
          description,
          tag,
          api: cfg.api,
          status: "published",
          date: date.toISOString(),
          dateString: formatDateString(date),
          commitUrl: c.html_url,
          commitSha: c.sha.slice(0, 7),
          repoLabel: cfg.repo,
        });
      }
    } catch (err) {
      errors.push(err.message || String(err));
    }
  }

  if (entries.length === 0 && errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  entries.sort((a, b) => new Date(b.date) - new Date(a.date));
  return { entries, errors, stats: filterStats(stats.fetched, stats.published) };
}

export function readCache() {
  if (!fs.existsSync(CACHE_PATH)) {
    return { syncedAt: null, entries: [] };
  }
  return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
}

export function writeCache(entries) {
  const payload = {
    syncedAt: new Date().toISOString(),
    entries,
  };
  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
  fs.writeFileSync(CACHE_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return payload;
}
