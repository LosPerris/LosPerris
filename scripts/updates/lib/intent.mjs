/**
 * Lógica de actualizaciones: infiere si un commit es para usuarios y qué etiqueta lleva.
 * Umbrales en filters.config.json; analyzeCommit devuelve `reason` para depurar.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, "filters.config.json");

const DEFAULT_THRESHOLDS = {
  minSubjectLength: 12,
  descriptiveSubjectMinLength: 22,
  descriptiveSubjectMinWords: 4,
  clearSubjectMinLength: 18,
  bodyContextMinLength: 40,
  bodyContextSubjectMinLength: 14,
};

function loadThresholds() {
  try {
    const raw = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    return { ...DEFAULT_THRESHOLDS, ...raw.thresholds };
  } catch {
    return DEFAULT_THRESHOLDS;
  }
}

export const FILTER_THRESHOLDS = loadThresholds();

const CONVENTIONAL_RE =
  /^(fix|feat|perf|docs|chore|refactor|a11y|infra|style|test|ci|build|revert)(\([^)]+\))?!?:\s*(.+)$/i;

const PUBLISH_TYPES = new Set([
  "feat",
  "perf",
  "a11y",
  "revert",
]);

const SKIP_TYPES = new Set([
  "chore",
  "docs",
  "style",
  "test",
  "ci",
  "build",
  "fix",
  "refactor",
]);

const TAG_FROM_TYPE = {
  fix: "Fix",
  feat: "Feature",
  perf: "Optimización",
  a11y: "A11y",
  refactor: "Optimización",
  revert: "Fix",
  infra: "Infra",
};

const SKIP_SUBJECT_PATTERNS = [
  /^merge\b/i,
  /^wip\b/i,
  /^tmp\b/i,
  /^lint\b/i,
  /^format\b/i,
  /^prettier\b/i,
  /^bump\b/i,
  /^deps?\b/i,
  /^update (deps|dependencies|lock|lockfile)/i,
  /^chore\b/i,
  /^style:/i,
  /^test:/i,
  /^ci:/i,
  /^build:/i,
  /^refactor:/i,
  /^sync\b/i,
  /^typo\b/i,
  /^rename\b/i,
  /^cleanup\b/i,
  /^checkpoint\b/i,
  /^save\b/i,
  /^minor\b/i,
  /^readme\b/i,
  /^update readme/i,
  /^gitignore/i,
  /^husky/i,
  /^pre-commit/i,
  /^dependabot/i,
  /^sincronizar actualizaciones/i,
  /^chore:/i,
  /^usar node/i,
  /^actualizar engines/i,
  /\bengines?\b/i,
  /\bnode\s*22\b/i,
  /\bnode\s*>=/i,
  /\bjest\b/i,
  /\bworkflow\b/i,
  /\bsync de actualizaciones/i,
  /\bdispatch\b/i,
  /\bgithub actions?\b/i,
  /\bpnpm\b/i,
  /\bastro 6\b/i,
  /\bci obsoleto/i,
  /\btests unitarios\b/i,
  /\blint-staged\b/i,
  /^probar (dispatch|flujo)/i,
  /\bvercel\.json\b/i,
  /\bfunctions de vercel\b/i,
  /\blegacy path\b/i,
  /\blimpieza\b.*\b(carpetas|tests?)\b/i,
  /\bcorrecci[oó]n de tests?\b/i,
  /\be2e\b/i,
  /\bsmoke\.spec\b/i,
  /\bupstash\b/i,
  /\brealtimeservice\b/i,
  /\bworker-src\b/i,
  /\bservice worker\b/i,
  // Ruido interno genérico (código/arquitectura, no producto)
  /\bsimplificar archivo\b/i,
  /\bextraer m[oó]dulos?\b/i,
  /\bdividir\b.*\b(controller|servicio|service|provider|archivo)\b/i,
  /\barquitectura de (dos|2|\w+) capas?\b/i,
  /\bmigrar (provider|backend|activity_logs|a matriz)\b/i,
  /\beliminando componentes\b/i,
  /\bestilo modular\b/i,
  /\b\w+\.controller\b/i,
  /\b\w+\.service\b/i,
  /\b\w+provider\b/i,
  /\brefactors?\b/i,
  /\btipos? (compartidos|internos)\b/i,
  /\bbarrel exports?\b/i,
  /\blocalstorage\b/i,
  /\bapikey\b/i,
  /\bbento\b/i,
  /\bscrollbars?\b/i,
  /\bp[aá]gina 404\b/i,
  /\brutas? legacy\b/i,
];

/** Commits que suenan a producto pero son solo reorganización de código. */
const INTERNAL_CODE_RE =
  /\b(controller|provider|dataexporter|extraer m[oó]dulos?|simplificar archivo|arquitectura de|dos capas|estilo modular|eliminando componentes|\.controller\b|\.service\b|migrar provider|localstorage|apiKey|bento box)\b/i;

const DEVOPS_SUBJECT_RE =
  /\b(workflow|yaml|sintaxis|engines?|jest|pnpm|node\s*22|node\s*>=|dispatch|sync de actualizaciones|losperris al pushear|ci obsoleto|tests unitarios|caché de actualizaciones|trigger-losperris|vercel\.json|legacy path|custom 404|paths técnicos|lint-staged|github actions?)\b/i;

/** Palabras de producto real (evitar jerga de UI/eng: bento, dashboard solo, modal solo). */
const USER_FACING_RE =
  /\b(vista previa|preview|selector de regi[oó]n|regi[oó]n br|export|usuario|logo|imagen|gif|avatar|qr|c[oó]digo qr|panel|comando|bot[oó]n|formulario|descarga|transcript|embed|generador|perfil|clip|stream|landing|streamlabs|botrix|nightbot|fossabot|streamelements|wizebot|overlay|ruleta|tendencias|minijuego|shoutout|followage|obs|cookies?|sesi[oó]n|twitch|valorant)\b/gi;

const INTENT_TAG_RULES = [
  {
    tag: "Fix",
    re: /\b(fix|corregir|corrección|correccion|arreglar|arreglo|bug|error|errores|falla|fallo|roto|flixeo|fixeo|solucionar|hotfix|parche|reparar)\b/gi,
  },
  {
    tag: "Feature",
    re: /\b(feat|añadir|agregar|nuevo|nueva|implementar|soportar|soporte|permitir|introducir|habilitar|integrar|lanzar|rediseñ)\b/gi,
  },
  {
    tag: "A11y",
    re: /\b(a11y|accesibilidad|contraste|teclado|aria|lector de pantalla)\b/gi,
  },
  {
    tag: "Optimización",
    re: /\b(perf|optimiz(ar|ación|acion)|rendimiento|más rápido|mas rapido)\b/gi,
  },
];

const ALLOW_SUBJECT_RE =
  /\b(región br|regiones|format=text|subdominio|dc\.losperris|vlr\.losperris|qr\.losperris)\b/i;

export function splitCommitMessage(message) {
  const full = message?.trim() ?? "";
  const lines = full.split("\n");
  const subject = lines[0]?.trim() ?? "";
  const body = lines
    .slice(1)
    .map((l) => l.trim())
    .filter(Boolean)
    .join(" ");
  return { full, subject, body };
}

export function cleanCommitTitle(subject) {
  let text = subject.trim().replace(/\[(update|novedad)\]\s*/gi, "");
  const cc = text.match(CONVENTIONAL_RE);
  if (cc) text = cc[3].trim();
  if (!text) return "Actualización";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Scoring: gana la etiqueta con más coincidencias (más explicable que primer match). */
export function inferUpdateTag(text) {
  const cc = text.match(CONVENTIONAL_RE);
  if (cc) {
    const type = cc[1].toLowerCase();
    return TAG_FROM_TYPE[type] ?? "Infra";
  }

  const scores = new Map();
  for (const { tag, re } of INTENT_TAG_RULES) {
    const matches = text.match(re);
    const count = matches?.length ?? 0;
    if (count > 0) scores.set(tag, (scores.get(tag) ?? 0) + count);
  }

  let best = "Infra";
  let bestScore = 0;
  for (const [tag, score] of scores) {
    if (score > bestScore) {
      bestScore = score;
      best = tag;
    }
  }
  return best;
}

function isMaintenanceSubject(subject) {
  if (subject.length < FILTER_THRESHOLDS.minSubjectLength) return true;
  if (SKIP_SUBJECT_PATTERNS.some((re) => re.test(subject))) return true;
  if (DEVOPS_SUBJECT_RE.test(subject)) return true;
  if (INTERNAL_CODE_RE.test(subject)) return true;
  return false;
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function hasUserFacingContext(text) {
  USER_FACING_RE.lastIndex = 0;
  return USER_FACING_RE.test(text);
}

/**
 * @returns {{ publish: boolean, reason: string, tag: string, title: string, body: string }}
 */
export function analyzeCommit(message) {
  const { full, subject, body } = splitCommitMessage(message);
  const title = cleanCommitTitle(subject);
  const tag = inferUpdateTag(`${subject} ${body}`);
  const T = FILTER_THRESHOLDS;

  if (!full) {
    return { publish: false, reason: "empty-message", tag: "Infra", title: "Actualización", body: "" };
  }

  if (/\[skip updates?\]/i.test(full)) {
    return { publish: false, reason: "marker:skip-update", tag, title, body };
  }

  const forced = /\[(update|novedad)\]/i.test(full);

  if (forced) {
    return { publish: true, reason: "marker:forced", tag, title, body };
  }

  if (/BREAKING CHANGE/i.test(full)) {
    return { publish: true, reason: "breaking-change", tag: "Feature", title, body };
  }

  if (isMaintenanceSubject(subject)) {
    return { publish: false, reason: "maintenance-subject", tag, title, body };
  }

  const cc = subject.match(CONVENTIONAL_RE);
  if (cc) {
    const type = cc[1].toLowerCase();
    if (SKIP_TYPES.has(type)) {
      return { publish: false, reason: `conventional:skip:${type}`, tag, title, body };
    }
    if (PUBLISH_TYPES.has(type)) {
      const scope = cc[2] ? cc[2].slice(1, -1).toLowerCase() : "";
      const SKIP_SCOPES = new Set(["security", "ci", "deps", "devops", "test", "e2e"]);
      if (SKIP_SCOPES.has(scope)) {
        return { publish: false, reason: `conventional:skip-scope:${scope}`, tag, title, body };
      }
      // feat/perf/a11y sin contexto de producto → no publicar (usa [novedad] si importa).
      if (type !== "revert" && !hasUserFacingContext(`${subject} ${body}`)) {
        return {
          publish: false,
          reason: `conventional:${type}-no-product`,
          tag,
          title,
          body,
        };
      }
      return { publish: true, reason: `conventional:publish:${type}`, tag, title, body };
    }
  }

  if (ALLOW_SUBJECT_RE.test(subject)) {
    return { publish: true, reason: "allowlist-subject", tag, title, body };
  }

  const combined = `${subject} ${body}`;
  const words = wordCount(subject);

  // Feature/Fix/A11y con sujeto descriptivo + contexto de producto
  if (
    (tag === "Feature" || tag === "Fix" || tag === "A11y") &&
    hasUserFacingContext(combined) &&
    subject.length >= T.descriptiveSubjectMinLength &&
    words >= T.descriptiveSubjectMinWords
  ) {
    return { publish: true, reason: "user-facing:descriptive-subject", tag, title, body };
  }

  // Optimización solo si el cuerpo explica el valor para el usuario
  if (
    tag === "Optimización" &&
    hasUserFacingContext(combined) &&
    body.length >= T.bodyContextMinLength &&
    subject.length >= T.bodyContextSubjectMinLength
  ) {
    return { publish: true, reason: "user-facing:perf-with-body", tag, title, body };
  }

  if (
    (tag === "Feature" || tag === "Fix" || tag === "A11y") &&
    subject.length >= T.clearSubjectMinLength &&
    words >= 4 &&
    hasUserFacingContext(combined)
  ) {
    return { publish: true, reason: "intent-tag:clear-subject", tag, title, body };
  }

  if (
    body.length >= T.bodyContextMinLength &&
    hasUserFacingContext(combined) &&
    subject.length >= T.bodyContextSubjectMinLength &&
    (tag === "Feature" || tag === "Fix" || tag === "A11y" || tag === "Optimización")
  ) {
    return {
      publish: true,
      reason: "user-facing:body-context",
      tag: inferUpdateTag(combined),
      title,
      body,
    };
  }

  return { publish: false, reason: "no-match", tag, title, body };
}

export function shouldPublishCommit(message) {
  return analyzeCommit(message).publish;
}

export function filterStats(total, published) {
  return { total, published, skipped: total - published };
}
