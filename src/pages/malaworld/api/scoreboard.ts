/// <reference types="astro/client" />
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
    const apiKey = import.meta.env.MALAWORLD_API_KEY;

    try {
        const response = await fetch(`http://23.230.3.241:25908/api/all?key=${apiKey}`);
        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Error fetching data' }), { status: 500 });
        }
        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Server Error' }), { status: 500 });
    }
}
