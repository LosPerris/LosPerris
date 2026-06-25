import realImg from "../assets/img/Real.webp";
import gamerImg from "../assets/img/gamer.webp";

export const helpBotData = {
  id: "help-bot",
  botName: "LosPerrisHelp",
  description:
    "Bot especializado en moderación y utilidades para servidores de Discord",
  imageSrc: realImg,
  tags: ["🛡️ Moderación Avanzada", "🔒 Seguridad Total", "💾 Base de Datos"],
  backgroundColor: "bg-[#2d2d2d]",
  inviteLink: `https://discord.com/api/oauth2/authorize?client_id=${import.meta.env.PUBLIC_BOT_HELP_CLIENT_ID || "TU_CLIENT_ID_HELP"}&permissions=84992&scope=bot`,
  features: [
    {
      icon: "fas fa-shield-alt",
      title: "Moderación",
      description:
        "Sistema completo de moderación con ban, kick, warn y más. Incluye sistema automático de advertencias y gestión de usuarios problemáticos con historial persistente.",
      list: [
        "Ban/Unban automático",
        "Sistema de advertencias persistente",
        "Purga de mensajes",
        "Reportes de usuarios",
      ],
    },
    {
      icon: "fas fa-info-circle",
      title: "Información",
      description:
        "Comandos informativos sobre usuarios y servidor. Obtén datos detallados y estadísticas completas de tu comunidad.",
      list: [
        "Perfiles de usuario",
        "Información del servidor",
        "Avatares y tarjetas",
        "Estadísticas detalladas",
      ],
    },
    {
      icon: "fas fa-lock",
      title: "Seguridad",
      description:
        "Análisis de archivos y URLs para mantener tu servidor seguro. Protección contra malware y enlaces maliciosos.",
      list: [
        "Escaneo de archivos",
        "Análisis de URLs",
        "Generador de contraseñas",
        "Detección de amenazas",
      ],
    },
    {
      icon: "fas fa-smile",
      title: "Diversión",
      description:
        "Comandos divertidos para animar tu servidor. Mantén a tu comunidad entretenida con contenido variado.",
      list: [
        "Imágenes de gatos",
        "Sistema de saludos",
        "Comandos interactivos",
        "Entretenimiento variado",
      ],
    },
  ],
};

export const gameBotData = {
  id: "game-bot",
  botName: "LosPerrisGame",
  description:
    "Bot gaming con estadísticas y información de múltiples juegos populares",
  imageSrc: gamerImg,
  tags: [
    "🎮 Multi-Juego",
    "📊 Stats Persistentes",
    "🔄 Actualizaciones Diarias",
  ],
  backgroundColor: "bg-[#1a1a1a]",
  inviteLink: `https://discord.com/api/oauth2/authorize?client_id=${import.meta.env.PUBLIC_BOT_GAME_CLIENT_ID || "TU_CLIENT_ID_GAME"}&permissions=84992&scope=bot`,
  features: [
    {
      icon: "fas fa-gamepad",
      title: "Fortnite",
      description: "Stats completas de jugadores y tienda diaria actualizada",
      list: [
        "Estadísticas de jugador",
        "Tienda diaria",
        "Historial de partidas",
      ],
    },
    {
      icon: "fas fa-crown",
      title: "League of Legends",
      description: "Info completa de campeones, builds optimizados y perfiles",
      list: ["160+ Campeones", "Builds aleatorios", "Perfiles de invocador"],
    },
    {
      icon: "fas fa-crosshairs",
      title: "Valorant",
      description: "Agentes detallados, arsenal completo y estadísticas",
      list: ["20+ Agentes", "Arsenal completo", "Stats de jugador"],
    },
    {
      icon: "fas fa-cube",
      title: "Minecraft",
      description: "Visualización de skins con múltiples vistas y detalles",
      list: ["Skins de jugadores", "Múltiples vistas", "Historial de cambios"],
    },
    {
      icon: "fas fa-dragon",
      title: "Más Juegos",
      description: "Pokémon TCG, Dragon Ball y contenido en expansión",
      list: [
        "Cartas Pokémon TCG",
        "Personajes Dragon Ball",
        "Twitch integration",
      ],
    },
  ],
};
