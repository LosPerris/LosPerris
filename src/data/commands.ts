export interface Command {
  name: string;
  description: string;
  emoji: string;
}

export interface GuideSection {
  title: string;
  icon?: string;
  commands?: Command[];
  content?: string;
  list?: string[];
}

export const commandsData: Record<string, GuideSection[]> = {
  "comandos-basicos": [
    {
      title: "Diversión",
      icon: "🎈",
      content: `
        <div class="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#27272a] rounded-xl p-6 relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-32 h-32 bg-pink-500 opacity-5 blur-3xl rounded-full pointer-events-none group-hover:opacity-10 transition-opacity"></div>
            <p class="text-gray-400 text-sm leading-relaxed mb-4">Comandos de entretenimiento e interacción entre los miembros para mantener tu servidor activo y divertido.</p>
            <div class="flex items-center gap-2 text-sm text-gray-300 bg-white/[0.02] border border-white/5 p-2 rounded-lg w-fit">
                <i class="fas fa-lightbulb text-pink-400"></i> Tip: Las confesiones son muy populares
            </div>
        </div>
      `,
      commands: [
        {
          name: "/confesar",
          emoji: "🤫",
          description: "Haz una confesión de forma anónima o pública.",
        },
        {
          name: "/gato",
          emoji: "😺",
          description: "Muestra una imagen aleatoria y linda de un gato.",
        },
        {
          name: "/hug",
          emoji: "🫂",
          description: "Manda un abrazo a otro usuario con un GIF.",
        },
        {
          name: "/kiss",
          emoji: "💋",
          description: "Manda un beso a otro usuario con un GIF.",
        },
        {
          name: "/saludo",
          emoji: "👋",
          description:
            "Saluda a alguien con un botón interactivo para que te devuelvan el saludo.",
        },
      ],
    },
    {
      title: "Información",
      icon: "ℹ️",
      content: `
        <div class="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#27272a] rounded-xl p-6 relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-5 blur-3xl rounded-full pointer-events-none group-hover:opacity-10 transition-opacity"></div>
            <p class="text-gray-400 text-sm leading-relaxed mb-4">Herramientas esenciales para obtener datos precisos y útiles sobre los usuarios, roles o el servidor en general.</p>
            <div class="flex items-center gap-2 text-sm text-gray-300 bg-white/[0.02] border border-white/5 p-2 rounded-lg w-fit">
                <i class="fas fa-search text-blue-400"></i> Útil para la moderación
            </div>
        </div>
      `,
      commands: [
        {
          name: "/avatar",
          emoji: "📷",
          description:
            "Muestra la foto de perfil en alta calidad de un usuario.",
        },
        {
          name: "/help",
          emoji: "📋",
          description:
            "Muestra el panel interactivo de ayuda con todos los comandos.",
        },
        {
          name: "/ping",
          emoji: "🏓",
          description: "Muestra la velocidad de respuesta (latencia) del bot.",
        },
        {
          name: "/roleinfo",
          emoji: "🏷️",
          description:
            "Muestra toda la información detallada sobre un rol específico.",
        },
        {
          name: "/serverinfo",
          emoji: "📊",
          description:
            "Muestra las estadísticas, fecha de creación y dueños del servidor.",
        },
        {
          name: "/userinfo",
          emoji: "👤",
          description:
            "Muestra la información de un usuario (fecha de ingreso, ID, roles).",
        },
      ],
    },
  ],
  moderacion: [
    {
      title: "Moderación",
      icon: "🛡️",
      content: `
        <div class="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#27272a] rounded-xl p-6 relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-32 h-32 bg-red-500 opacity-5 blur-3xl rounded-full pointer-events-none group-hover:opacity-10 transition-opacity"></div>
            <p class="text-gray-400 text-sm leading-relaxed mb-4">Herramientas estrictas y eficientes para mantener el servidor seguro y castigar a los infractores. Úsese con precaución.</p>
            <div class="flex items-center gap-2 text-sm text-gray-300 bg-white/[0.02] border border-white/5 p-2 rounded-lg w-fit">
                <i class="fas fa-exclamation-triangle text-red-400"></i> Requiere permisos elevados
            </div>
        </div>
      `,
      commands: [
        {
          name: "/analyze_users",
          emoji: "🔍",
          description: "Analiza el comportamiento general de los usuarios.",
        },
        {
          name: "/ban",
          emoji: "🔨",
          description: "Banea a un usuario permanentemente del servidor.",
        },
        {
          name: "/banlist",
          emoji: "📋",
          description: "Muestra la lista de todos los usuarios baneados.",
        },
        {
          name: "/checkwarns",
          emoji: "⚠️",
          description:
            "Revisa cuántas advertencias tiene acumuladas un usuario.",
        },
        {
          name: "/kick",
          emoji: "🥾",
          description:
            "Expulsa a un usuario (puede volver a entrar con invitación).",
        },
        {
          name: "/modstats",
          emoji: "📈",
          description: "Muestra las estadísticas del equipo de moderación.",
        },
        {
          name: "/nuke",
          emoji: "☢️",
          description:
            "Elimina todos los mensajes de un canal clonándolo desde cero.",
        },
        {
          name: "/purge",
          emoji: "🧹",
          description: "Borra una cantidad masiva de mensajes rápidamente.",
        },
        {
          name: "/setconfessions",
          emoji: "⚙️",
          description:
            "(Admin) Configura a qué canal se enviarán las confesiones.",
        },
        {
          name: "/setlogs",
          emoji: "⚙️",
          description:
            "(Admin) Configura el canal donde se registrarán todas las auditorías.",
        },
        {
          name: "/temprole",
          emoji: "⏳",
          description:
            "Otorga un rol temporal a un usuario que se quitará solo.",
        },
        {
          name: "/timeout",
          emoji: "🔇",
          description:
            "Aísla (silencia) a un usuario para que no pueda hablar temporalmente.",
        },
        {
          name: "/unban",
          emoji: "🔓",
          description: "Remueve el ban de un usuario.",
        },
        {
          name: "/unwarn",
          emoji: "✅",
          description: "Quita una advertencia (warn) a un usuario.",
        },
        {
          name: "/warn",
          emoji: "⚠️",
          description:
            "Da una advertencia formal a un usuario por romper las reglas.",
        },
      ],
    },
    {
      title: "Utilidad",
      icon: "🛠️",
      content: `
        <div class="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#27272a] rounded-xl p-6 relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-32 h-32 bg-green-500 opacity-5 blur-3xl rounded-full pointer-events-none group-hover:opacity-10 transition-opacity"></div>
            <p class="text-gray-400 text-sm leading-relaxed mb-4">Sistemas avanzados para mejorar la calidad de vida de tu comunidad, automatizar tareas y facilitar la comunicación.</p>
            <div class="flex items-center gap-2 text-sm text-gray-300 bg-white/[0.02] border border-white/5 p-2 rounded-lg w-fit">
                <i class="fas fa-ticket-alt text-green-400"></i> Sistema de Tickets y Sorteos
            </div>
        </div>
      `,
      commands: [
        {
          name: "/embed",
          emoji: "📝",
          description:
            "Abre el Constructor Avanzado de Embeds v2 (Autor, Título, Campos, Timestamp).",
        },
        { name: "/giveaway", emoji: "🎉", description: "Sistema de Sorteos." },
        {
          name: "/giveaway start",
          emoji: "▶️",
          description: "Inicia un nuevo sorteo.",
        },
        {
          name: "/giveaway end",
          emoji: "⏹️",
          description: "Termina un sorteo en curso de inmediato.",
        },
        {
          name: "/giveaway reroll",
          emoji: "🔄",
          description: "Elige a un nuevo ganador de un sorteo ya terminado.",
        },
        {
          name: "/poll",
          emoji: "📊",
          description: "Crea una encuesta interactiva y visual con botones.",
        },
        {
          name: "/remind",
          emoji: "⏰",
          description:
            "Programa al bot para que te recuerde algo en el futuro.",
        },
        {
          name: "/setup_tempvoice",
          emoji: "🔊",
          description:
            '(Admin) Configura el creador automático de "Canales de Voz Temporales".',
        },
        {
          name: "/ticket_list",
          emoji: "📋",
          description:
            "Muestra todos los tickets de soporte que están activos.",
        },
        {
          name: "/ticket_panel",
          emoji: "📨",
          description:
            "Crea un panel visual donde los usuarios pueden abrir un Ticket de soporte.",
        },
        {
          name: "/translate",
          emoji: "🌍",
          description: "Traduce cualquier texto a múltiples idiomas.",
        },
      ],
    },
  ],
  seguridad: [
    {
      title: "Seguridad",
      icon: "🔒",
      content: `
        <div class="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#27272a] rounded-xl p-6 relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-32 h-32 bg-yellow-500 opacity-5 blur-3xl rounded-full pointer-events-none group-hover:opacity-10 transition-opacity"></div>
            <p class="text-gray-400 text-sm leading-relaxed mb-4">Comandos de protección avanzada y escaneo antivirus para proteger a tus usuarios contra enlaces maliciosos y phishing.</p>
            <div class="flex items-center gap-2 text-sm text-gray-300 bg-white/[0.02] border border-white/5 p-2 rounded-lg w-fit">
                <i class="fas fa-shield-virus text-yellow-500"></i> Powered by VirusTotal API
            </div>
        </div>
      `,
      commands: [
        {
          name: "/analyze_file",
          emoji: "🔍",
          description: "Escanea archivos adjuntos en busca de virus o malware.",
        },
        {
          name: "/analyze_url",
          emoji: "🔗",
          description:
            "Escanea un enlace (URL) para comprobar si es malicioso (Phishing).",
        },
        {
          name: "/generate_password",
          emoji: "🔐",
          description: "Genera una contraseña súper segura al azar por MD.",
        },
        {
          name: "/setup_verification",
          emoji: "🛡️",
          description:
            "(Admin) Configura el sistema de verificación (Captcha / Botón) para evitar incursiones de bots o cuentas falsas.",
        },
      ],
    },
  ],
  "voz-tts": [
    {
      title: "Voz y TTS",
      icon: "🗣️",
      content: `
        <div class="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#27272a] rounded-xl p-6 relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-5 blur-3xl rounded-full pointer-events-none group-hover:opacity-10 transition-opacity"></div>
            <p class="text-gray-400 text-sm leading-relaxed mb-4">Sistema de lectura de mensajes automáticos (Text-To-Speech) con Inteligencia Artificial. Haz que el bot lea el chat por ti.</p>
            <div class="flex items-center gap-2 text-sm text-gray-300 bg-white/[0.02] border border-white/5 p-2 rounded-lg w-fit">
                <i class="fas fa-robot text-purple-400"></i> Multitud de voces hispanas
            </div>
        </div>
      `,
      commands: [
        {
          name: "/join",
          emoji: "🎤",
          description:
            "Hace que el bot entre al canal de voz y comience a escuchar.",
        },
        {
          name: "/leave",
          emoji: "🚪",
          description: "Desconecta al bot del canal de voz de forma manual.",
        },
        {
          name: "/voz",
          emoji: "⚙️",
          description: "Configuraciones de usuario.",
        },
        {
          name: "/voz locutor",
          emoji: "🗣️",
          description:
            "Elige la voz personal (Dalia, Jorge, Elvira, Paloma, etc) con la que el bot leerá tus mensajes.",
        },
        {
          name: "/voz apodo",
          emoji: "🏷️",
          description:
            "Pon un apodo para que el bot lo diga en lugar de tu nombre de Discord.",
        },
        {
          name: "/voz_admin",
          emoji: "👑",
          description: "(Admin) Configuraciones del Servidor.",
        },
        {
          name: "/voz_admin canal_texto",
          emoji: "📝",
          description: "Define qué canal de texto va a leer el bot.",
        },
        {
          name: "/voz_admin canal_voz",
          emoji: "🔊",
          description:
            "Define a qué canal de voz se va a conectar el bot automáticamente.",
        },
      ],
    },
  ],
  "comandos-gaming": [
    {
      title: "Fortnite",
      icon: "🎮",
      commands: [
        {
          name: "/fortnite_stats",
          emoji: "🖼️",
          description: "Muestra las stats de Fortnite de un jugador",
        },
        {
          name: "/fortnite_tienda",
          emoji: "🛒",
          description: "Muestra la tienda diaria de Fortnite con filtros",
        },
      ],
    },
    {
      title: "League of Legends",
      icon: "🏆",
      commands: [
        {
          name: "/lol_random_build",
          emoji: "❓",
          description:
            "Recomienda un campeón con build y runas aleatorias oficiales según rol",
        },
        {
          name: "/lol_champion_info",
          emoji: "📖",
          description: "Muestra información detallada de un campeón de LoL",
        },
        {
          name: "/lol_info",
          emoji: "📖",
          description:
            "Obtener perfil y clasificación de invocador (Solo el servidor de Americas de momento)",
        },
        {
          name: "/lol_items",
          emoji: "🛡️",
          description:
            "Muestra los objetos de League of Legends con filtro y paginación",
        },
      ],
    },
    {
      title: "Valorant",
      icon: "🔫",
      commands: [
        {
          name: "/valorant_agente",
          emoji: "📖",
          description:
            "Muestra información detallada de un agente de Valorant (en español si está disponible)",
        },
        {
          name: "/valorant_armas",
          emoji: "🔫",
          description: "Muestra armas de Valorant con filtros y paginación",
        },
        {
          name: "/valorant_info",
          emoji: "📖",
          description:
            "Muestra información detallada de un jugador de Valorant",
        },
        {
          name: "/valorant_mapas",
          emoji: "🗺️",
          description: "Muestra los mapas de Valorant (En proceso)",
        },
      ],
    },
    {
      title: "Otros Juegos",
      icon: "🎲",
      commands: [
        {
          name: "/minecraft_skin",
          emoji: "🧱",
          description:
            "Muestra el skin de un jugador de Minecraft con distintas vistas",
        },
        {
          name: "/cartapokemontcg",
          emoji: "🎴",
          description: "Busca cartas Pokémon TCG con filtros",
        },
        {
          name: "/dragonball",
          emoji: "🐉",
          description: "Busca personajes de Dragon Ball con filtros",
        },
      ],
    },
    {
      title: "Entretenimiento",
      icon: "📺",
      commands: [
        {
          name: "/twitch",
          emoji: "🎮",
          description: "Consulta información de un canal de Twitch",
        },
        {
          name: "/feedback",
          emoji: "",
          description: "Reporta un error o sugiere una idea para el bot",
        },
      ],
    },
  ],
  "estadisticas-juegos": [
    {
      title: "Cómo usar las estadísticas",
      icon: "📊",
      content: `
                <div class="space-y-6">
                    <div class="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#27272a] rounded-xl p-6 relative overflow-hidden group">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-5 blur-3xl rounded-full pointer-events-none group-hover:opacity-10 transition-opacity"></div>
                        <h4 class="text-xl font-bold text-white mb-3 flex items-center gap-2">
                            <i class="fas fa-parachute-box text-blue-400"></i> Fortnite
                        </h4>
                        <p class="text-gray-400 mb-4 text-sm leading-relaxed">Ejecuta <code class="px-2 py-0.5 rounded bg-[#111] text-blue-400 font-mono text-xs border border-[#333]">/fortnite_stats [usuario]</code> para obtener una tarjeta detallada con:</p>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="flex items-center gap-2 text-sm text-gray-300 bg-white/[0.02] border border-white/5 p-2 rounded-lg">
                                <i class="fas fa-trophy text-yellow-500 w-4 text-center"></i> Victorias (Wins)
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-300 bg-white/[0.02] border border-white/5 p-2 rounded-lg">
                                <i class="fas fa-crosshairs text-red-400 w-4 text-center"></i> Kills & K/D Ratio
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-300 bg-white/[0.02] border border-white/5 p-2 rounded-lg">
                                <i class="fas fa-clock text-blue-400 w-4 text-center"></i> Tiempo Jugado
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-300 bg-white/[0.02] border border-white/5 p-2 rounded-lg">
                                <i class="fas fa-chart-line text-green-400 w-4 text-center"></i> Historial de Temporada
                            </div>
                        </div>
                    </div>
                
                    <div class="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#27272a] rounded-xl p-6 relative overflow-hidden group">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-yellow-500 opacity-5 blur-3xl rounded-full pointer-events-none group-hover:opacity-10 transition-opacity"></div>
                        <h4 class="text-xl font-bold text-white mb-3 flex items-center gap-2">
                            <i class="fas fa-crown text-yellow-500"></i> League of Legends
                        </h4>
                        <p class="text-gray-400 mb-4 text-sm leading-relaxed">Ejecuta <code class="px-2 py-0.5 rounded bg-[#111] text-yellow-500 font-mono text-xs border border-[#333]">/lol_info [invocador]</code> para consultar el perfil oficial:</p>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="flex items-center gap-2 text-sm text-gray-300 bg-white/[0.02] border border-white/5 p-2 rounded-lg">
                                <i class="fas fa-medal text-blue-400 w-4 text-center"></i> Rango (Solo/Duo & Flex)
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-300 bg-white/[0.02] border border-white/5 p-2 rounded-lg">
                                <i class="fas fa-star text-yellow-500 w-4 text-center"></i> League Points (LP)
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-300 bg-white/[0.02] border border-white/5 p-2 rounded-lg">
                                <i class="fas fa-percentage text-green-400 w-4 text-center"></i> Winrate Global
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-300 bg-white/[0.02] border border-white/5 p-2 rounded-lg">
                                <i class="fas fa-fire text-orange-500 w-4 text-center"></i> Campeones Principales
                            </div>
                        </div>
                    </div>
                
                    <div class="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#27272a] rounded-xl p-6 relative overflow-hidden group">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-red-500 opacity-5 blur-3xl rounded-full pointer-events-none group-hover:opacity-10 transition-opacity"></div>
                        <h4 class="text-xl font-bold text-white mb-3 flex items-center gap-2">
                            <i class="fas fa-crosshairs text-red-500"></i> Valorant
                        </h4>
                        <p class="text-gray-400 mb-4 text-sm leading-relaxed">Ejecuta <code class="px-2 py-0.5 rounded bg-[#111] text-red-400 font-mono text-xs border border-[#333]">/valorant_info [usuario#tag]</code> para ver tu historial de Riot:</p>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="flex items-center gap-2 text-sm text-gray-300 bg-white/[0.02] border border-white/5 p-2 rounded-lg">
                                <i class="fas fa-gem text-purple-400 w-4 text-center"></i> Rango Competitivo
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-300 bg-white/[0.02] border border-white/5 p-2 rounded-lg">
                                <i class="fas fa-level-up-alt text-green-400 w-4 text-center"></i> Rank Rating (RR)
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-300 bg-white/[0.02] border border-white/5 p-2 rounded-lg">
                                <i class="fas fa-history text-blue-400 w-4 text-center"></i> Partidas Recientes
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-300 bg-white/[0.02] border border-white/5 p-2 rounded-lg">
                                <i class="fas fa-user-ninja text-red-400 w-4 text-center"></i> Agentes Favoritos
                            </div>
                        </div>
                    </div>
                </div>
            `,
    },
  ],
  "configuracion-servidor": [
    {
      title: "Configuración Inicial del Servidor",
      icon: "🔧",
      content: `
                <div class="space-y-6">
                    <div class="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#27272a] rounded-xl p-6 relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-[#f97316] opacity-[0.03] blur-3xl rounded-full pointer-events-none"></div>
                        <h4 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <i class="fas fa-list-ol text-[#f97316]"></i> Pasos Esenciales
                        </h4>
                        <div class="space-y-4">
                            <div class="flex gap-4">
                                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center text-[#f97316] font-bold">1</div>
                                <div>
                                    <h5 class="text-white font-semibold mb-1">Invita a los Bots</h5>
                                    <p class="text-gray-400 text-sm leading-relaxed">Asegúrate de invitar tanto a <strong>LosPerrisHelp</strong> como a <strong>LosPerrisGame</strong> con los permisos de Administrador predeterminados para evitar conflictos futuros.</p>
                                </div>
                            </div>
                            <div class="flex gap-4">
                                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center text-[#f97316] font-bold">2</div>
                                <div>
                                    <h5 class="text-white font-semibold mb-1">Ajusta la Jerarquía de Roles</h5>
                                    <p class="text-gray-400 text-sm leading-relaxed">Ve a Configuración del Servidor > Roles. Mueve el rol de LosPerris lo más arriba posible, justo por debajo de los roles de Dueño o Admins supremos. Esto permite al bot moderar eficientemente.</p>
                                </div>
                            </div>
                            <div class="flex gap-4">
                                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center text-[#f97316] font-bold">3</div>
                                <div>
                                    <h5 class="text-white font-semibold mb-1">Configura los Canales Principales</h5>
                                    <p class="text-gray-400 text-sm leading-relaxed">Usa comandos como <code class="px-2 py-0.5 rounded bg-[#f97316]/10 text-[#f97316] font-mono text-xs border border-[#f97316]/30">/setlogs</code> para definir dónde se registrarán las auditorías, y <code class="px-2 py-0.5 rounded bg-[#f97316]/10 text-[#f97316] font-mono text-xs border border-[#f97316]/30">/setup_verification</code> para la puerta de seguridad.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-[#f97316]/5 border border-[#f97316]/20 rounded-xl p-5 flex gap-4 items-start">
                        <i class="fas fa-lightbulb text-[#f97316] mt-1"></i>
                        <div>
                            <h5 class="text-[#f97316] font-bold mb-1">Pro Tip</h5>
                            <p class="text-gray-400 text-sm">Ejecuta <code class="px-2 py-0.5 rounded bg-[#111] text-white font-mono text-xs border border-[#333]">/help</code> dentro de tu servidor para obtener un panel interactivo con la lista completa de configuraciones disponibles según los módulos activos.</p>
                        </div>
                    </div>
                </div>
            `,
    },
  ],
  "permisos-roles": [
    {
      title: "Jerarquía y Permisos de Roles",
      icon: "👑",
      content: `
                <div class="space-y-6">
                    <div class="bg-[#0a0a0a] border border-[#27272a] rounded-xl overflow-hidden">
                        <div class="p-5 border-b border-[#27272a] bg-[#111]">
                            <h4 class="text-lg font-bold text-white flex items-center gap-2">
                                <i class="fas fa-sitemap text-[#f97316]"></i> Estructura de Moderación Recomendada
                            </h4>
                        </div>
                        <div class="p-5 space-y-5">
                            <div class="flex items-start gap-3">
                                <i class="fas fa-crown text-yellow-500 mt-1 w-5 text-center"></i>
                                <div>
                                    <h5 class="text-white font-bold mb-1">Administrador <span class="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded ml-2">Peligro Alto</span></h5>
                                    <p class="text-gray-400 text-sm mb-2">Tiene acceso irrestricto a <code class="px-1.5 py-0.5 bg-[#222] rounded text-gray-300">/nuke</code>, <code class="px-1.5 py-0.5 bg-[#222] rounded text-gray-300">/setlogs</code> y configuraciones de voz.</p>
                                    <p class="text-xs text-gray-500">Permiso requerido: <span class="font-mono text-zinc-300">ADMINISTRATOR</span></p>
                                </div>
                            </div>
                            
                            <div class="w-full h-px bg-gradient-to-r from-transparent via-[#27272a] to-transparent"></div>

                            <div class="flex items-start gap-3">
                                <i class="fas fa-shield-alt text-blue-400 mt-1 w-5 text-center"></i>
                                <div>
                                    <h5 class="text-white font-bold mb-1">Moderador <span class="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded ml-2">Peligro Medio</span></h5>
                                    <p class="text-gray-400 text-sm mb-2">Puede usar <code class="px-1.5 py-0.5 bg-[#222] rounded text-gray-300">/ban</code>, <code class="px-1.5 py-0.5 bg-[#222] rounded text-gray-300">/kick</code>, <code class="px-1.5 py-0.5 bg-[#222] rounded text-gray-300">/timeout</code>, y <code class="px-1.5 py-0.5 bg-[#222] rounded text-gray-300">/purge</code>.</p>
                                    <p class="text-xs text-gray-500">Permisos requeridos: <span class="font-mono text-zinc-300">BAN_MEMBERS</span>, <span class="font-mono text-zinc-300">MANAGE_MESSAGES</span></p>
                                </div>
                            </div>

                            <div class="w-full h-px bg-gradient-to-r from-transparent via-[#27272a] to-transparent"></div>

                            <div class="flex items-start gap-3">
                                <i class="fas fa-hands-helping text-green-400 mt-1 w-5 text-center"></i>
                                <div>
                                    <h5 class="text-white font-bold mb-1">Helper / Soporte <span class="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded ml-2">Seguro</span></h5>
                                    <p class="text-gray-400 text-sm mb-2">Acceso a lectura de tickets y uso de comandos informativos como <code class="px-1.5 py-0.5 bg-[#222] rounded text-gray-300">/userinfo</code> y <code class="px-1.5 py-0.5 bg-[#222] rounded text-gray-300">/checkwarns</code>.</p>
                                    <p class="text-xs text-gray-500">Permisos requeridos: <span class="font-mono text-zinc-300">MANAGE_CHANNELS</span> (Solo en categoría de tickets)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-red-500/5 border border-red-500/20 rounded-xl p-5 flex gap-4 items-start">
                        <i class="fas fa-exclamation-triangle text-red-500 mt-1"></i>
                        <div>
                            <h5 class="text-red-500 font-bold mb-1">Advertencia de Jerarquía</h5>
                            <p class="text-gray-400 text-sm">Discord prohíbe que un bot modifique roles o banee usuarios que estén por encima de él en la lista de roles. ¡Recuerda mantener el rol de LosPerris arriba del todo!</p>
                        </div>
                    </div>
                </div>
            `,
    },
  ],
};
