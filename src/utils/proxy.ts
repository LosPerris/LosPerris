import type { APIRoute } from 'astro';

export const createProxy = (targetBaseUrl: string): APIRoute => {
    return async ({ request, params }) => {
        const path = params.path || '';
        const url = new URL(request.url);
        const searchParams = url.search;

        // Remove leading slash if present in path to prevent double slash with base url
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        const targetUrl = `${targetBaseUrl}${cleanPath ? `/${cleanPath}` : ''}${searchParams}`;

        try {
            const response = await fetch(targetUrl, {
                method: request.method,
                headers: request.headers,
                body: request.body ? await request.arrayBuffer() : undefined,
            });

            return new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: 'Proxy Error', details: String(error) }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };
};
