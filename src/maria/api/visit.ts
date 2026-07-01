import type { APIRoute } from "astro";
import { trackVisit } from "../scripts/tracking";
import { checkRateLimit, getClientIp } from "../../lib/rateLimit";

export const POST: APIRoute = async ({ request }) => {
  const ip = getClientIp(request);
  if (!checkRateLimit(`maria-visit:${ip}`, 10)) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const country = request.headers.get("x-vercel-ip-country");
    await trackVisit(country);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Maria visit error:", e);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
