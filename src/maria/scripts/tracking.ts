// Usar variable de entorno para el Webhook por seguridad
import { sanitizeEmbedText } from "../../lib/rateLimit";

const DISCORD_WEBHOOK_URL = import.meta.env.DISCORD_WEBHOOK_URL || "";

export async function trackVisit(country: string | null) {
  if (!DISCORD_WEBHOOK_URL) return;

  try {
    const countryName = country || "Desconocido";
    const flag = getFlag(country);

    const message = {
      embeds: [
        {
          title: "🌻 Nueva visita en la página de María",
          description: `Se ha detectado un nuevo acceso a la página diaria de María.`,
          color: 0xfbbf24, // Color girasol
          fields: [
            {
              name: "País",
              value: `${flag} ${countryName}`,
              inline: true,
            },
            {
              name: "Fecha",
              value: new Date().toLocaleString("es-MX", {
                timeZone: "America/Mexico_City",
              }),
              inline: true,
            },
          ],
          footer: {
            text: "Los Perris Stats",
          },
        },
      ],
    };

    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error("Error tracking visit:", error);
  }
}

export async function trackResponse(answer: string, question: string) {
  if (!DISCORD_WEBHOOK_URL) return;

  try {
    const safeAnswer = sanitizeEmbedText(answer, 100);
    const safeQuestion = sanitizeEmbedText(question, 500);
    const isYes =
      answer.toLowerCase() === "sí" || answer.toLowerCase() === "si";
    const color = isYes ? 0x2ecc71 : 0xe74c3c; // Verde para sí, Rojo para no

    const message = {
      embeds: [
        {
          title: "💌 Nueva respuesta de María",
          description: `María ha respondido a la pregunta del día.`,
          color: color,
          fields: [
            {
              name: "Pregunta",
              value: safeQuestion,
            },
            {
              name: "Respuesta",
              value: `**${safeAnswer}**`,
              inline: true,
            },
            {
              name: "Fecha",
              value: new Date().toLocaleString("es-MX", {
                timeZone: "America/Mexico_City",
              }),
              inline: true,
            },
          ],
          footer: {
            text: "Los Perris Interaction System",
          },
        },
      ],
    };

    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error("Error tracking response:", error);
  }
}

function getFlag(countryCode: string | null): string {
  if (!countryCode) return "❓";

  // Convert ISO country code to Emoji Flag
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));

  try {
    return String.fromCodePoint(...codePoints);
  } catch {
    return "🌍";
  }
}
