import type { APIRoute } from 'astro';

export const createProxy = (targetBaseUrl: string): APIRoute => {
    return async ({ request, params }) => {
        const path = params.path || '';
        const url = new URL(request.url);
        const searchParams = url.search;

        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        const targetUrl = `${targetBaseUrl}${cleanPath ? `/${cleanPath}` : ''}${searchParams}`;

        try {
            const response = await fetch(targetUrl, {
                method: request.method,
                headers: request.headers,
                body: request.body ? await request.arrayBuffer() : undefined,
            });

            const responseHeaders = new Headers(response.headers);
            responseHeaders.delete('content-encoding');
            responseHeaders.delete('content-length');

            return new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: responseHeaders
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: 'Proxy Error', details: String(error) }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };
};
