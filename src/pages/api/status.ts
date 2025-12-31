import type { APIRoute } from "astro";
import { getSystemStatus } from "../../services/status";

export const GET: APIRoute = async () => {
    const statusData = getSystemStatus();

    return new Response(JSON.stringify(statusData), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
};
