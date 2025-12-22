/// <reference types="astro/client" />
import type { APIRoute } from "astro";


let cachedData: any = null;
let lastFetchTime = 0;
const CACHE_TTL = 300 * 1000;

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
        let players: any[] = [];
        const now = Date.now();

        if (cachedData && now - lastFetchTime < CACHE_TTL) {
            players = Object.values(cachedData);
        } else {
            const response = await fetch(
                `http://23.230.3.241:25908/api/all?key=${apiKey}`,
            );
            if (!response.ok) {
                if (cachedData) {
                    players = Object.values(cachedData);
                } else {
                    return new Response(
                        JSON.stringify({ error: "Error fetching upstream data" }),
                        { status: 500 },
                    );
                }
            } else {
                cachedData = await response.json();
                lastFetchTime = now;
                players = Object.values(cachedData);
            }
        }

        const matches = players.filter((p) => {
            if (p.last_ip === userIp || p.ip === userIp || p.address === userIp)
                return true;
            return Object.values(p).some((val) => val === userIp);
        });

        const safeMatches = matches.map((p) => ({
            uuid: p.uuid,
            name: p.name,
            skin: p.skin,
            mob_kills: parseInt(p.mob_kills || 0),
            deaths: parseInt(p.deaths || 0),
            hours_played: parseFloat(p.hours_played || 0),
            player_kills: parseInt(p.player_kills || 0),
        }));

        const debugKeys =
            matches.length === 0 && players.length > 0
                ? Object.keys(players[0])
                : [];

        return new Response(
            JSON.stringify({
                ip: userIp,
                candidates: safeMatches,
                debug_keys: debugKeys,
            }),
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
