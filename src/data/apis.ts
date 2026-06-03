import { siteUrl } from "./community";

export const apis = [
  {
    title: "Herramientas de Twitch",
    popular: true,
    description:
      "Suite completa para streamers: API de Followage y gestor de Clips. Todo en un solo lugar.",
    icon: "fab fa-twitch",
    color: "text-[#9146FF]",
    link: "/api/twitch/",
    linkText: "Ir al Panel",
    endpoints: [
      {
        method: "GET",
        path: "/api/followage/:user/:channel",
        description: "API de tiempo de seguimiento (Followage).",
        example: `${siteUrl}/api/followage/usuario/canal`,
      },
      {
        method: "WEB",
        path: "/api/clips",
        description: "Gestor y descargador de Clips.",
        example: `${siteUrl}/twitch/clips`,
      },
    ],
  },
  {
    title: "Valorant API",
    popular: true,
    description:
      "Obtén datos en tiempo real de Valorant: Rango, MMR, Historial de partidas y más. Respuestas en texto plano para fácil integración.",
    icon: "fas fa-crosshairs",
    color: "text-[#FF4655]",
    link: "/api/valorant",
    linkText: "Visitar Web",
    endpoints: [
      {
        method: "GET",
        path: "/valorant/v1/mmr/:region/:name/:tag",
        description: "Obtiene el rango y ELO actual de un jugador.",
        example: `${siteUrl}/valorant/v1/mmr/na/user/tag`,
      },
      {
        method: "GET",
        path: "/valorant/v1/account/:name/:tag",
        description: "Información general de la cuenta (Nivel, tarjeta, etc).",
        example: `${siteUrl}/api/valorant/v1/account/nombre/tag`,
      },
    ],
  },
  {
    title: "Discord Transcripts",
    popular: false,
    description:
      "Genera, almacena y visualiza transcripciones de canales de Discord en formato HTML de manera rápida y sencilla.",
    icon: "fab fa-discord",
    color: "text-[#f97316]",
    link: "/api/transcript",
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
  },
  {
    title: "Generador de Códigos QR",
    popular: false,
    description:
      "Herramienta visual profesional para crear códigos QR personalizados. Soporta estilos, logotipos, WiFi, VCard y descargas en alta resolución.",
    icon: "fas fa-qrcode",
    color: "text-[#FACC15]",
    link: "/api/qr",
    linkText: "Crear QR",
    endpoints: [
      {
        method: "WEB",
        path: "/api/qr",
        description: "Interfaz gráfica para generación de QR.",
        example: `${siteUrl}/api/qr`,
      },
    ],
  },
];
