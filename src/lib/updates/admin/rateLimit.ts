const RATE_LIMIT_WINDOW_MS = 60_000;

type RateEntry = { count: number; resetAt: number };
const hits = new Map<string, RateEntry>();

function purgeExpired(): void {
  const now = Date.now();
  for (const [key, entry] of hits.entries()) {
    if (now > entry.resetAt) hits.delete(key);
  }
}

export function checkAdminRateLimit(
  key: string,
  max = 40,
  windowMs = RATE_LIMIT_WINDOW_MS,
): boolean {
  purgeExpired();
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= max) return false;
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
