import { siteUrl } from "./community";

export const apis = [
  {
    title: "Herramientas de Twitch",
    popular: true,
    description:
      "Suite completa para streamers: API de Followage y gestor de Clips. Todo en un solo lugar.",
    icon: "fab fa-twitch",
    iconId: "twitch",
    color: "text-[#9146FF]",
    hoverColor: "group-hover:text-[#9146FF]",
    link: "/api/twitch/",
    linkText: "Ir al Panel",
    endpoints: [
      {
        method: "GET",
        path: "/api/twitch/followage/:user/:channel",
        description: "API de tiempo de seguimiento (Followage).",
        example: `${siteUrl}/api/twitch/followage/usuario/canal`,
      },
      {
        method: "WEB",
        path: "/api/twitch/clips",
        description: "Gestor y descargador de Clips.",
        example: `${siteUrl}/api/twitch/clips`,
      },
    ],
    previewCode: `{
  "user": "elxokas",
  "channel": "ibai",
  "following": true,
  "follow_date": "2021-02-15T10:00:00Z",
  "duration": {
    "years": 3,
    "months": 4,
    "days": 12
  }
}`,
  },
  {
    title: "Valorant API",
    popular: true,
    description:
      "Obtén datos en tiempo real de Valorant: Rango, MMR, Historial de partidas y más. Respuestas en texto plano para fácil integración.",
    icon: "fas fa-crosshairs",
    iconId: "valorant",
    color: "text-[#FF4655]",
    hoverColor: "group-hover:text-[#FF4655]",
    link: "/api/valorant",
    linkText: "Visitar Web",
    endpoints: [
      {
        method: "GET",
        path: "/api/valorant/v1/mmr/:region/:name/:tag",
        description: "Obtiene el rango y ELO actual de un jugador.",
        example: `${siteUrl}/api/valorant/v1/mmr/na/user/tag`,
      },
      {
        method: "GET",
        path: "/valorant/v1/account/:name/:tag",
        description: "Información general de la cuenta (Nivel, tarjeta, etc).",
        example: `${siteUrl}/api/valorant/v1/account/nombre/tag`,
      },
    ],
    previewCode: `{
  "status": 200,
  "data": {
    "name": "TenZ",
    "tag": "SEN",
    "current_tier": 24,
    "current_tier_patched": "Radiant",
    "ranking_in_tier": 100,
    "mmr_change_to_last_game": 14,
    "elo": 2400
  }
}`,
  },
  {
    title: "Discord Transcripts",
    popular: false,
    description:
      "Genera, almacena y visualiza transcripciones de canales de Discord en formato HTML de manera rápida y sencilla.",
    icon: "fab fa-discord",
    color: "text-[#5865F2]",
    hoverColor: "group-hover:text-[#5865F2]",
    link: "/api/discord",
    linkText: "Documentación",
    endpoints: [
      {
        method: "POST",
        path: "/api/discord/transcripts",
        description:
          "Crea una nueva transcripción a partir de un JSON de mensajes de Discord.",
        example: `${siteUrl}/api/discord/transcripts`,
      },
      {
        method: "GET",
        path: "/api/discord/transcripts/:id",
        description: "Visualiza o recupera la transcripción generada.",
        example: `${siteUrl}/api/discord/transcripts/123456`,
      },
    ],
    previewCode: `{
  "success": true,
  "transcript_url": "https://losperris.com/t/abc123xyz",
  "metadata": {
    "channel_id": "10023456789",
    "message_count": 145,
    "participants": 4,
    "generated_at": "2026-06-21T18:45:00Z"
  }
}`,
  },
  {
    title: "Generador de Códigos QR",
    popular: false,
    description:
      "Herramienta visual profesional para crear códigos QR personalizados. Soporta estilos, logotipos, WiFi, VCard y descargas en alta resolución.",
    icon: "fas fa-qrcode",
    color: "text-[#22C55E]",
    hoverColor: "group-hover:text-[#22C55E]",
    link: "https://qr.losperris.dev/",
    linkText: "Crear QR",
    endpoints: [
      {
        method: "WEB",
        path: "https://qr.losperris.dev/",
        description: "Interfaz gráfica para generación de QR.",
        example: "https://qr.losperris.dev/",
      },
      {
        method: "POST",
        path: "https://qr.losperris.dev/api/generate",
        description: "Genera un código QR (imagen binaria).",
        example: "https://qr.losperris.dev/api/generate",
      },
    ],
    previewCode: `<!-- Preview Tool -->
<div class="qr-preview bg-white p-4 rounded-xl inline-block">
  <img src="/qr-example.png" alt="QR Code" width="120" height="120" loading="lazy" decoding="async"/>
</div>
<style>
  .qr-preview { border: 2px solid #22c55e; }
</style>
`,
  },
];
