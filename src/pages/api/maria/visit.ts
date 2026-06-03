export const prerender = false;

import { trackVisit } from "../../../maria/scripts/tracking";

export async function POST({ request }: { request: Request }) {
  try {
    // Vercel inyecta este header automáticamente en Serverless Functions
    const country = request.headers.get("x-vercel-ip-country");
    await trackVisit(country);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
