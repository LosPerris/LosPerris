/**
 * Lógica de novedades: infiere si un commit es para usuarios y qué etiqueta lleva.
 * No hace falta conventional commit; basta un mensaje descriptivo en español.
 */

const CONVENTIONAL_RE =
  /^(fix|feat|perf|docs|chore|refactor|a11y|infra|style|test|ci|build|revert)(\([^)]+\))?!?:\s*(.+)$/i;

const PUBLISH_TYPES = new Set([
  "feat",
  "fix",
  "perf",
  "a11y",
  "refactor",
  "revert",
]);

const SKIP_TYPES = new Set([
  "chore",
  "docs",
  "style",
  "test",
  "ci",
  "build",
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

const DEVOPS_SUBJECT_RE =
  /\b(workflow|yaml|sintaxis|engines?|jest|pnpm|node\s*22|node\s*>=|dispatch|sync de novedades|losperris al pushear|ci obsoleto|tests unitarios|caché de novedades|trigger-losperris|vercel\.json|legacy path|custom 404|hover animation|footer de la landing|badge de api privada|paths técnicos)\b/i;

/** Palabras que suelen describir cambios visibles para quien usa la API/web. */
const USER_FACING_RE =
  /\b(vista previa|preview|selector|modal|página|pagina|export|región|region|usuario|dashboard|logo|imagen|gif|avatar|qr|código|codigo|panel|comando|botón|boton|formulario|descarga|subdominio|transcript|embed|reacción|reaccion|documento|generador|latencia|api key|perfil|clip|stream|chat)\b/i;

/** Orden importa: la primera coincidencia define la etiqueta. */
const INTENT_TAG_RULES = [
  {
    tag: "Fix",
    re: /\b(fix|corregir|corrección|correccion|arreglar|arreglo|bug|error|errores|falla|fallo|roto|flixeo|fixeo|solucionar|hotfix|parche|reparar)\b/i,
  },
  {
    tag: "Feature",
    re: /\b(feat|añadir|agregar|nuevo|nueva|implementar|soportar|permitir|introducir|habilitar|integrar|lanzar)\b/i,
  },
  {
    tag: "A11y",
    re: /\b(a11y|accesibilidad|contraste|teclado|aria|lector de pantalla)\b/i,
  },
  {
    tag: "Optimización",
    re: /\b(perf|optimiz(ar|ación|acion)|rendimiento|más rápido|mas rapido|mejor(ar|é|e|ado)?|migrar|refactor)\b|mejoré/i,
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

/** Título limpio para la tarjeta (sin prefijos ni marcas). */
export function cleanCommitTitle(subject) {
  let text = subject.trim().replace(/\[(update|novedad)\]\s*/gi, "");
  const cc = text.match(CONVENTIONAL_RE);
  if (cc) text = cc[3].trim();
  if (!text) return "Actualización";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function inferUpdateTag(text) {
  const cc = text.match(CONVENTIONAL_RE);
  if (cc) {
    const type = cc[1].toLowerCase();
    return TAG_FROM_TYPE[type] ?? "Infra";
  }

  for (const { tag, re } of INTENT_TAG_RULES) {
    if (re.test(text)) return tag;
  }

  return "Infra";
}

function isMaintenanceSubject(subject) {
  if (subject.length < 10) return true;
  if (SKIP_SUBJECT_PATTERNS.some((re) => re.test(subject))) return true;
  if (DEVOPS_SUBJECT_RE.test(subject)) return true;
  return false;
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Analiza un mensaje de commit y devuelve si publicar + metadatos para la tarjeta.
 */
export function analyzeCommit(message) {
  const { full, subject, body } = splitCommitMessage(message);

  if (!full) {
    return { publish: false, tag: "Infra", title: "Actualización", body: "" };
  }

  if (/\[skip updates?\]/i.test(full)) {
    return { publish: false, tag: "Infra", title: cleanCommitTitle(subject), body };
  }

  const forced = /\[(update|novedad)\]/i.test(full);
  const title = cleanCommitTitle(subject);
  const tag = inferUpdateTag(`${subject} ${body}`);

  if (forced) {
    return { publish: true, tag, title, body };
  }

  if (/BREAKING CHANGE/i.test(full)) {
    return { publish: true, tag: "Feature", title, body };
  }

  if (isMaintenanceSubject(subject)) {
    return { publish: false, tag, title, body };
  }

  if (ALLOW_SUBJECT_RE.test(subject)) {
    return { publish: true, tag, title, body };
  }

  const cc = subject.match(CONVENTIONAL_RE);
  if (cc) {
    const type = cc[1].toLowerCase();
    if (SKIP_TYPES.has(type)) {
      return { publish: false, tag, title, body };
    }
    if (PUBLISH_TYPES.has(type)) {
      return { publish: true, tag, title, body };
    }
  }

  const combined = `${subject} ${body}`;

  // Mensaje descriptivo sobre la app (español libre, sin prefijo)
  if (
    USER_FACING_RE.test(combined) &&
    subject.length >= 18 &&
    wordCount(subject) >= 3 &&
    tag !== "Infra"
  ) {
    return { publish: true, tag, title, body };
  }

  // Verbo de intención claro al inicio o en el texto
  if (tag !== "Infra" && subject.length >= 14) {
    return { publish: true, tag, title, body };
  }

  // Cuerpo explicativo + contexto de producto
  if (
    body.length >= 20 &&
    USER_FACING_RE.test(combined) &&
    subject.length >= 12
  ) {
    return { publish: true, tag: inferUpdateTag(combined), title, body };
  }

  return { publish: false, tag, title, body };
}

export function shouldPublishCommit(message) {
  return analyzeCommit(message).publish;
}

export function filterStats(total, published) {
  return { total, published, skipped: total - published };
}
