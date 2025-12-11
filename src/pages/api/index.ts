import type { APIRoute } from "astro";
import { apis } from "../../data/apis";

export const GET: APIRoute = async () => {
    return new Response(JSON.stringify({
        status: "ok",
        message: "Los Perris API Gateway",
        timestamp: new Date().toISOString(),
        services: apis.map(api => ({
            name: api.title,
            description: api.description,
            status: "operational",
            endpoints: api.endpoints.map(ep => ({
                method: ep.method,
                path: ep.path
            }))
        }))
    }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
};
