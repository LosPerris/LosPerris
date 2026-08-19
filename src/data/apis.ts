export const apis = [
  {
    slug: "twitch",
    title: "Herramientas de Twitch",
    description:
      "Suite completa para streamers: API de Followage y gestor de Clips. Todo en un solo lugar.",
    longDescription: `
      Nuestra Suite de Twitch es un ecosistema completo de herramientas gratuitas, diseñado específicamente para potenciar tu canal sin depender de suscripciones de pago ni configuraciones complejas.
      
      Integra comandos en tiempo real directamente en Nightbot o StreamElements. Además, desde nuestro panel centralizado podrás explorar, descargar y gestionar todos tus clips en alta resolución sin marcas de agua, dándote todo lo que necesitas para escalar tu contenido a TikTok o YouTube Shorts en segundos.
    `,
    icon: "fab fa-twitch",
    iconId: "twitch",
    color: "text-[#9146FF]",
    link: "https://ttv.losperris.dev/",
    linkText: "Ir al Panel",
    baseUrl: "https://ttv.losperris.dev",
    features: [
      {
        title: "Integración Directa",
        description:
          "Conéctate fácilmente con Nightbot o StreamElements mediante peticiones simples (urlfetch) para dar mayor interactividad a tu chat.",
        icon: "fas fa-plug",
      },
      {
        title: "100% Gratis y Abierto",
        description:
          "Un proyecto creado para ayudar a la comunidad. Siempre será gratuito y estamos abiertos a escuchar ideas para nuevas funciones.",
        icon: "fas fa-heart",
      },
      {
        title: "Alta Disponibilidad",
        description:
          "Arquitectura moderna y estable para garantizar que tus comandos y herramientas funcionen sin caídas en pleno stream.",
        icon: "fas fa-server",
      },
    ],
    integrations: [
      { name: "TypeScript", id: "typescript" },
      { name: "Node.js", id: "nodedotjs" },
      { name: "Astro", id: "astro" },
      { name: "Express", id: "express" },
      { name: "Supabase", id: "supabase" },
      { name: "Zod", id: "zod" },
    ],
    endpoints: [
      {
        method: "GET",
        path: "/api/followage/:user/:channel",
        description:
          "Devuelve texto plano con el tiempo de seguimiento. Ideal para comandos de chat: $(urlfetch https://ttv...)",
        example: `https://ttv.losperris.dev/api/followage/usuario/canal`,
      },
      {
        method: "WEB",
        path: "https://ttv.losperris.dev/dashboard/clips",
        description:
          "Gestor visual interactivo para explorar, filtrar y descargar los clips más populares de tu canal.",
        example: `https://ttv.losperris.dev/dashboard/clips`,
      },
      {
        method: "GET",
        path: "/api/create-clip",
        description:
          "Permite a tus moderadores o VIPs crear clips automáticamente con un comando en el chat.",
        example: `https://ttv.losperris.dev/api/create-clip?channel=canal&apiKey=TU_API_KEY`,
      },
    ],
  },
  {
    slug: "valorant",
    title: "Valorant API",
    description:
      "Obtén datos en tiempo real de Valorant: Rango, MMR, Historial de partidas y más. Respuestas en texto plano para fácil integración.",
    longDescription: `
      La API de Valorant resuelve el problema número uno de los streamers competitivos: mantener a la audiencia informada sobre el rango actual sin tener que actualizar el título del stream manualmente.
      
      Nuestros endpoints se conectan directamente con la API oficial no oficial, extrayendo los datos en tiempo real y devolviéndolos en texto plano ultraligero para que Nightbot pueda leerlo al instante sin retrasos.
    `,
    icon: "fas fa-crosshairs",
    iconId: "valorant",
    color: "text-[#FF4655]",
    link: "https://vlr.losperris.dev/",
    linkText: "Visitar Web",
    baseUrl: "https://vlr.losperris.dev",
    features: [
      {
        title: "Rango en Tiempo Real",
        description:
          "Devuelve el rango actual y los puntos exactos para subir de elo.",
        icon: "fas fa-trophy",
      },
      {
        title: "Historial de Partidas",
        description:
          "Comandos para saber si ganaste o perdiste la última partida y con qué KDA.",
        icon: "fas fa-history",
      },
      {
        title: "Baja Latencia",
        description:
          "Respuestas en texto plano diseñadas específicamente para no ahogar el chat.",
        icon: "fas fa-gauge-high",
      },
    ],
    integrations: [
      { name: "Valorant", id: "valorant" },
      { name: "Upstash", id: "upstash" },
      { name: "TypeScript", id: "typescript" },
      { name: "React", id: "react" },
      { name: "Vercel", id: "vercel" },
      { name: "Tailwind CSS", id: "tailwindcss" },
    ],
    endpoints: [
      {
        method: "GET",
        path: "/api/rank/:region/:name/:tag",
        description:
          "Obtiene el rango actual (Ej. 'Inmortal 3') y los puntos de ELO acumulados. Perfecto para el comando !rango.",
        example: "https://vlr.losperris.dev/api/rank/na/user/tag",
      },
      {
        method: "GET",
        path: "/api/match/last/:region/:name/:tag",
        description:
          "Devuelve los resultados de la última partida competitiva (Victoria/Derrota, KDA y cambio de MMR).",
        example: "https://vlr.losperris.dev/api/match/last/na/user/tag",
      },
    ],
  },
  {
    slug: "qr",
    title: "Generador de Códigos QR",
    description:
      "Herramienta visual profesional para crear códigos QR personalizados. Soporta estilos, logotipos, WiFi, VCard y descargas en alta resolución.",
    longDescription: `
      Nuestro generador no es solo una simple API, es una suite visual completa. Puedes generar códigos para redes sociales, conexión rápida a WiFi o tarjetas de contacto VCard.
      
      La herramienta permite personalizar colores, añadir tu propio logotipo en el centro, modificar el estilo de los puntos (cuadrados, redondos, fluidos) y exportar el resultado final en formatos vectoriales (SVG) o imágenes de alta densidad (PNG, WebP) ideales para impresión.
    `,
    icon: "fas fa-qrcode",
    color: "text-[#22C55E]",
    link: "https://qr.losperris.dev/",
    linkText: "Crear QR",
    baseUrl: "https://qr.losperris.dev",
    features: [
      {
        title: "Alta Resolución",
        description:
          "Exporta en PNG o SVG para impresión profesional sin perder calidad.",
        icon: "fas fa-image",
      },
      {
        title: "Diseño Personalizado",
        description:
          "Cambia el color, estilo de los puntos y bordes para que coincida con tu marca.",
        icon: "fas fa-palette",
      },
      {
        title: "Logotipos",
        description:
          "Sube tu propio logo para incrustarlo en el centro del código de forma segura.",
        icon: "fas fa-icons",
      },
    ],
    integrations: [
      { name: "React", id: "react" },
      { name: "Zod", id: "zod" },
      { name: "Astro", id: "astro" },
      { name: "Tailwind CSS", id: "tailwindcss" },
      { name: "Node.js", id: "nodedotjs" },
      { name: "Express", id: "express" },
    ],
    endpoints: [
      {
        method: "WEB",
        path: "https://qr.losperris.dev/",
        description:
          "Accede al generador visual completo con todas las opciones de personalización.",
        example: "https://qr.losperris.dev/",
      },
      {
        method: "POST",
        path: "https://qr.losperris.dev/api/generate",
        description:
          "Genera un código QR dinámicamente pasando un payload JSON. Devuelve la imagen binaria o base64.",
        example: "https://qr.losperris.dev/api/generate",
      },
    ],
  },
];
