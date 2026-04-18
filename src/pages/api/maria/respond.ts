import type { APIRoute } from "astro";
import { trackResponse } from "../../../maria/scripts/tracking";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { answer, question } = await request.json();

    if (!answer || !question) {
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
