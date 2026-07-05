/**
 * ¿Este commit merece aparecer en /actualizaciones?
 *
 * Incluir siempre:  [update] o [novedad] en el mensaje
 * Omitir siempre:   [skip update] o merge / chore / lint / deps / wip
 *
 * También entran:   feat:, fix:, perf:, a11y:, refactor:
 * O mensajes con verbos visibles (Mejorar, Corregir, Migrar…)
 * NO entran:        CI, engines, workflows, Jest, dispatch, Node 22, etc.
 */

const CONVENTIONAL_RE =
  /^(fix|feat|perf|docs|chore|refactor|a11y|infra|style|test|ci|build|revert)(\([^)]+\))?!?:\s*(.+)$/i;

/** Tipos que SÍ publicamos (conventional commits). */
const PUBLISH_TYPES = new Set([
  "feat",
  "fix",
  "perf",
  "a11y",
  "refactor",
  "revert",
]);

/** Tipos que NO publicamos (ruido de mantenimiento). */
const SKIP_TYPES = new Set([
  "chore",
  "docs",
  "style",
  "test",
  "ci",
  "build",
]);

/** Asunto que casi nunca es novedad para usuarios. */
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
  /^sincronizar novedades/i,
  /^chore:/i,
  /^disparar\b/i,
  /^declarar\b/i,
  /^restaurar\b/i,
  /^reemplazar\b/i,
  /^usar node/i,
  /^actualizar engines/i,
  /\bengines?\b/i,
  /\bnode\s*22\b/i,
  /\bnode\s*>=/i,
  /\bjest\b/i,
  /\bworkflow\b/i,
  /\bsync de novedades/i,
  /\bdispatch\b/i,
  /\bgithub actions?\b/i,
  /\bpnpm\b/i,
  /\bastro 6\b/i,
  /\bci obsoleto/i,
  /\btests unitarios\b/i,
  /\blint-staged\b/i,
  /^probar (dispatch|flujo)/i,
  /^quitar\b/i,
  /^remove\b/i,
  /^añadir página/i,
  /^add legacy/i,
  /^add custom 404/i,
  /\bhover animation/i,
  /\bfooter de la landing/i,
  /\bbadge de api privada/i,
  /\bpaths técnicos\b/i,
  /\bvercel\.json\b/i,
  /\b404 al estilo\b/i,
  /\bcustom 404 page\b/i,
  /\blatencia en segundos\b/i,
  /\bfunctions de vercel\b/i,
  /\blegacy path\b/i,
];

/** Ruido técnico aunque use feat:/fix: en el asunto. */
const DEVOPS_SUBJECT_RE =
  /\b(workflow|yaml|sintaxis|engines?|jest|pnpm|node\s*22|node\s*>=|dispatch|sync de novedades|losperris al pushear|ci obsoleto|tests unitarios|caché de novedades|trigger-losperris|vercel\.json|legacy path|custom 404|hover animation|footer de la landing|badge de api privada|paths técnicos)\b/i;

/** Verbos de cambio visible para usuarios (sin quitar/remove/añadir genéricos). */
const ACTION_VERB_RE =
  /^(mejorar|corregir|migrar|mover|implementar|arreglar|fix|feat|migrate|hotfix|revert)/i;

/** Excepciones: tweaks concretos que sí importan al usuario. */
const ALLOW_SUBJECT_RE =
  /\b(región br|regiones|format=text|subdominio|dc\.losperris|vlr\.losperris|qr\.losperris)\b/i;

export function shouldPublishCommit(message) {
  if (!message?.trim()) return false;

  const full = message.trim();
  if (/\[(update|novedad)\]/i.test(full)) return true;
  if (/\[skip updates?\]/i.test(full)) return false;
  if (/BREAKING CHANGE/i.test(full)) return true;

  const lines = full.split("\n");
  const subject = lines[0]?.trim() ?? "";
  const body = lines
    .slice(1)
    .map((l) => l.trim())
    .filter(Boolean)
    .join(" ");

  if (subject.length < 10) return false;

  if (SKIP_SUBJECT_PATTERNS.some((re) => re.test(subject))) return false;
  if (DEVOPS_SUBJECT_RE.test(subject)) return false;
  if (ALLOW_SUBJECT_RE.test(subject)) return true;

  const cc = subject.match(CONVENTIONAL_RE);
  if (cc) {
    const type = cc[1].toLowerCase();
    if (SKIP_TYPES.has(type)) return false;
    if (PUBLISH_TYPES.has(type)) return true;
  }

  if (ACTION_VERB_RE.test(subject)) return true;

  // Commit con cuerpo explicativo = suele ser intencional
  if (body.length >= 24 && subject.length >= 18 && ACTION_VERB_RE.test(subject)) {
    return true;
  }

  // Mensaje descriptivo largo sin prefijo (tus commits en español)
  if (
    subject.length >= 36 &&
    !/^chore/i.test(subject) &&
    ACTION_VERB_RE.test(subject)
  ) {
    return true;
  }

  return false;
}

export function filterStats(total, published) {
  return { total, published, skipped: total - published };
}
