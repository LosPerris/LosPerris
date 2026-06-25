const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;

type RateEntry = { count: number; resetAt: number };

const hits = new Map<string, RateEntry>();

export function checkRateLimit(
  key: string,
  max = RATE_LIMIT_MAX,
  windowMs = RATE_LIMIT_WINDOW_MS,
): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= max) {
    return false;
  }

  entry.count += 1;
  return true;
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function sanitizeEmbedText(value: string, maxLength = 500): string {
  return value
    .replace(/@everyone|@here|<@&?\d+>/gi, "[mención]")
    .slice(0, maxLength);
}
