export function logAdminAction(
  request: Request,
  action: string,
  detail?: Record<string, unknown>,
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  console.info(
    JSON.stringify({
      scope: "admin/updates",
      action,
      ip,
      at: new Date().toISOString(),
      ...detail,
    }),
  );
}
