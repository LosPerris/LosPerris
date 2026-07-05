export function getAdminSecret() {
  return import.meta.env.UPDATES_ADMIN_SECRET;
}

export function isAuthorized(request: Request) {
  const secret = getAdminSecret();
  if (!secret) return false;

  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] === secret;
}

const PRIVATE_HEADERS = { "X-Robots-Tag": "noindex, nofollow" };

export function unauthorizedResponse() {
  return new Response(JSON.stringify({ error: "No autorizado" }), {
    status: 401,
    headers: { "Content-Type": "application/json", ...PRIVATE_HEADERS },
  });
}

export function badRequest(message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { "Content-Type": "application/json", ...PRIVATE_HEADERS },
  });
}
