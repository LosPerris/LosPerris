/// <reference types="astro/client" />
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, clientAddress }) => {
    const apiKey = import.meta.env.MALAWORLD_API_KEY;

    let userIp = clientAddress;
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        userIp = forwarded.split(",")[0].trim();
    }

    if (userIp === "::1" || userIp === "127.0.0.1") {
    }

    try {
        const response = await fetch(
            `http://23.230.3.241:25908/api/all?key=${apiKey}`,
        );
        if (!response.ok) {
            return new Response(
                JSON.stringify({ error: "Error fetching upstream data" }),
                { status: 500 },
            );
        }

        const allStats = await response.json();
        const players = Object.values(allStats) as any[];

        const matches = players.filter(
            (p) => p.last_ip === userIp || p.ip === userIp,
        );
        const safeMatches = matches.map((p) => ({
            uuid: p.uuid,
            name: p.name,
            skin: p.skin,
            mob_kills: parseInt(p.mob_kills || 0),
            deaths: parseInt(p.deaths || 0),
            hours_played: parseFloat(p.hours_played || 0),
            player_kills: parseInt(p.player_kills || 0),
        }));

        return new Response(
            JSON.stringify({ ip: userIp, candidates: safeMatches }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            },
        );
    } catch (error) {
        return new Response(JSON.stringify({ error: "Server Error" }), {
            status: 500,
        });
    }
};
