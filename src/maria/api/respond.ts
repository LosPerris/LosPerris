import type { APIRoute } from "astro";
import { trackResponse } from "../scripts/tracking";
import { checkRateLimit, getClientIp } from "../../lib/rateLimit";

export const POST: APIRoute = async ({ request }) => {
  const ip = getClientIp(request);
  if (!checkRateLimit(`maria-respond:${ip}`, 10)) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { answer, question } = await request.json();

    if (
      !answer ||
      !question ||
      typeof answer !== "string" ||
      typeof question !== "string"
    ) {
      return new Response(JSON.stringify({ error: "Missing data" }), {
        status: 400,
      });
    }

    await trackResponse(answer, question);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Server Error" }), {
      status: 500,
    });
  }
};
