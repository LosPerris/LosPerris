// In-memory rate limiter – works within a single warm serverless instance.
// NOTE: On Vercel, multiple cold-starts each get their own Map (no shared state).
// This still provides per-instance protection against burst abuse.
// For cross-instance rate limiting, use Vercel KV / Upstash Redis.

const RATE_LIMIT_WINDOW_MS = 60_000;

type RateEntry = { count: number; resetAt: number };
const hits = new Map<string, RateEntry>();

// Lazy cleanup: purge expired entries on each check instead of setInterval.
// setInterval in serverless keeps the Lambda container alive unnecessarily.
function purgeExpired(): void {
  const now = Date.now();
  for (const [key, entry] of hits.entries()) {
    if (now > entry.resetAt) hits.delete(key);
  }
}

export function checkRateLimit(
  key: string,
  max: number,
  windowMs = RATE_LIMIT_WINDOW_MS,
): boolean {
  purgeExpired();

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
