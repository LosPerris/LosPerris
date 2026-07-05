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
        path: "/api/twitch/dashboard/clips",
        description: "Gestor y descargador de Clips en el panel.",
        example: `${siteUrl}/api/twitch/dashboard/clips`,
      },
      {
        method: "GET",
        path: "/api/twitch/create-clip",
        description: "Crea un clip vía comando de bot (Nightbot, etc.).",
        example: `${siteUrl}/api/twitch/create-clip?channel=canal&apiKey=TU_API_KEY`,
      },
    ],
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
    link: "https://vlr.losperris.dev/",
    linkText: "Visitar Web",
    baseUrl: "https://vlr.losperris.dev",
    endpoints: [
      {
        method: "GET",
        path: "/api/rank/:region/:name/:tag",
        description: "Obtiene el rango y ELO actual de un jugador.",
        example: "https://vlr.losperris.dev/api/rank/na/user/tag",
      },
      {
        method: "GET",
        path: "/api/match/last/:region/:name/:tag",
        description: "Última partida competitiva del jugador.",
        example: "https://vlr.losperris.dev/api/match/last/na/user/tag",
      },
    ],
  },
  {
    title: "Discord Transcripts",
    popular: false,
    private: true,
    description:
      "API privada para generar y visualizar transcripts de canales de Discord en HTML. Requiere API key.",
    icon: "fab fa-discord",
    color: "text-[#5865F2]",
    hoverColor: "group-hover:text-[#5865F2]",
    link: "https://dc.losperris.dev/",
    linkText: "Visitar Web",
    baseUrl: "https://dc.losperris.dev",
    endpoints: [
      {
        method: "POST",
        path: "/api/transcripts",
        description: "Genera un transcript del canal (API key).",
        example: "POST /api/transcripts",
      },
      {
        method: "GET",
        path: "/t/:guildId/:file",
        description: "Visualiza el transcript generado (público con el link).",
        example: "GET /t/guild/canal.html",
      },
    ],
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
  },
];
