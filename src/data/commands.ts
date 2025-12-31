export interface Command {
    name: string;
    description: string;
    emoji: string;
}

export interface GuideSection {
    title: string;
    icon?: string;
    commands?: Command[];
    content?: string; // For custom HTML paragraphs if needed
    list?: string[]; // For bullet points
}

export const commandsData: Record<string, GuideSection[]> = {
    'comandos-basicos': [
        {
            title: 'Información',
            icon: '❓',
            commands: [
                { name: '/avatar', emoji: '📷', description: 'Muestra el avatar de un usuario' },
                { name: '/help', emoji: '⁉️', description: 'Muestra los comandos disponibles por categoría' },
                { name: '/serverinfo', emoji: '📊', description: 'Muestra información del servidor' },
                { name: '/tarjeta', emoji: '🖼️', description: 'Genera una tarjeta de perfil personalizada' },
                { name: '/usuario', emoji: '🔍', description: 'Muestra información detallada de un usuario' }
            ]
        },
        {
            title: 'Diversión',
            icon: '😂',
            commands: [
                { name: '/gato', emoji: '😺', description: 'Muestra una imagen aleatoria de un gato' },
                { name: '/saludo', emoji: '', description: 'Saluda a un usuario del servidor' }
            ]
        },
        {
            title: 'Utilidad',
            icon: '🔧',
            commands: [
                { name: '/factura', emoji: '🧾', description: 'Genera una factura y la envía al destinatario' },
                { name: '/ticket_panel', emoji: '📨', description: 'Crear panel de tickets' }
            ]
        }
    ],
    'moderacion': [
        {
            title: 'Moderación',
            icon: '⚙️',
            content: 'Funciones principales para mantener el orden en tu servidor.',
            commands: [
                { name: '/ban', emoji: '❌', description: 'Prohíbe a un usuario del servidor' },
                { name: '/banlist', emoji: '📖', description: 'Muestra la lista de usuarios baneados' },
                { name: '/unban', emoji: '✅', description: 'Desbanea a un usuario por ID o nombre#tag' },
                { name: '/kick', emoji: '❌', description: 'Expulsa a un usuario del servidor' }
            ]
        },
        {
            title: 'Sistema de Advertencias',
            commands: [
                { name: '/warn', emoji: '❌', description: 'Advierte a un usuario. A las 3 advertencias será baneado automáticamente' },
                { name: '/checkwarns', emoji: '📖', description: 'Muestra la cantidad de advertencias de un usuario' },
                { name: '/unwarn', emoji: '✅', description: 'Quita advertencias a un usuario' }
            ]
        },
        {
            title: 'Gestión de Mensajes',
            commands: [
                { name: '/purge', emoji: '🚮', description: 'Elimina una cantidad de mensajes del canal (solo admins)' },
                { name: '/reportar', emoji: '✅', description: 'Envía un reporte al canal configurado' }
            ]
        },
        {
            title: 'Seguridad',
            icon: '🔐',
            commands: [
                { name: '/analizar_archivo', emoji: '📁', description: 'Escanea un archivo' },
                { name: '/analizar_url', emoji: '🔎', description: 'Escanea una URL con VirusTotal' },
                { name: '/generar_password', emoji: '🔐', description: 'Genera una contraseña segura' }
            ]
        }
    ],
    'comandos-gaming': [
        {
            title: 'Fortnite',
            icon: '🎮',
            commands: [
                { name: '/fortnite_stats', emoji: '🖼️', description: 'Muestra las stats de Fortnite de un jugador' },
                { name: '/fortnite_tienda', emoji: '🛒', description: 'Muestra la tienda diaria de Fortnite con filtros' }
            ]
        },
        {
            title: 'League of Legends',
            icon: '🏆',
            commands: [
                { name: '/lol_random_build', emoji: '❓', description: 'Recomienda un campeón con build y runas aleatorias oficiales según rol' },
                { name: '/lol_champion_info', emoji: '📖', description: 'Muestra información detallada de un campeón de LoL' },
                { name: '/lol_info', emoji: '📖', description: 'Obtener perfil y clasificación de invocador (Solo el servidor de Americas de momento)' },
                { name: '/lol_items', emoji: '🛡️', description: 'Muestra los objetos de League of Legends con filtro y paginación' }
            ]
        },
        {
            title: 'Valorant',
            icon: '🔫',
            commands: [
                { name: '/valorant_agente', emoji: '📖', description: 'Muestra información detallada de un agente de Valorant (en español si está disponible)' },
                { name: '/valorant_armas', emoji: '🔫', description: 'Muestra armas de Valorant con filtros y paginación' },
                { name: '/valorant_info', emoji: '📖', description: 'Muestra información detallada de un jugador de Valorant' },
                { name: '/valorant_mapas', emoji: '🗺️', description: 'Muestra los mapas de Valorant (En proceso)' }
            ]
        },
        {
            title: 'Otros Juegos',
            icon: '🎲',
            commands: [
                { name: '/minecraft_skin', emoji: '🧱', description: 'Muestra el skin de un jugador de Minecraft con distintas vistas' },
                { name: '/cartapokemontcg', emoji: '🎴', description: 'Busca cartas Pokémon TCG con filtros' },
                { name: '/dragonball', emoji: '🐉', description: 'Busca personajes de Dragon Ball con filtros' }
            ]
        },
        {
            title: 'Entretenimiento',
            icon: '📺',
            commands: [
                { name: '/twitch', emoji: '🎮', description: 'Consulta información de un canal de Twitch' },
                { name: '/feedback', emoji: '', description: 'Reporta un error o sugiere una idea para el bot' }
            ]
        }
    ],
    'estadisticas-juegos': [
        {
            title: 'Cómo usar las estadísticas',
            icon: '📊',
            content: `
                <div class="space-y-4">
                    <div class="bg-primary rounded-lg p-5 border border-[#333]">
                        <h4 class="text-lg font-bold text-white mb-3">Fortnite Stats</h4>
                        <p class="text-gray-400 mb-3 text-sm">Usa <code class="bg-secondary text-[#5865F2] px-2 py-1 rounded font-mono text-xs border border-[#404040]">/fortnite_stats [nombre_usuario]</code> para obtener:</p>
                        <ul class="space-y-1.5 list-disc ml-5 text-gray-400 text-sm">
                            <li>Estadísticas de Battle Royale</li>
                            <li>Wins, kills, K/D ratio</li>
                            <li>Tiempo jugado</li>
                            <li>Estadísticas por temporada</li>
                        </ul>
                    </div>
                
                    <div class="bg-primary rounded-lg p-5 border border-[#333]">
                        <h4 class="text-lg font-bold text-white mb-3">League of Legends</h4>
                        <p class="text-gray-400 mb-3 text-sm">Usa <code class="bg-secondary text-[#5865F2] px-2 py-1 rounded font-mono text-xs border border-[#404040]">/lol_info [nombre_invocador]</code> para ver:</p>
                        <ul class="space-y-1.5 list-disc ml-5 text-gray-400 text-sm">
                            <li>Rango actual en todas las colas</li>
                            <li>LP (League Points)</li>
                            <li>Winrate de la temporada</li>
                            <li>Campeones más jugados</li>
                        </ul>
                    </div>
                
                    <div class="bg-primary rounded-lg p-5 border border-[#333]">
                        <h4 class="text-lg font-bold text-white mb-3">Valorant</h4>
                        <p class="text-gray-400 mb-3 text-sm">Usa <code class="bg-secondary text-[#5865F2] px-2 py-1 rounded font-mono text-xs border border-[#404040]">/valorant_info [nombre_usuario#tag]</code> para obtener:</p>
                        <ul class="space-y-1.5 list-disc ml-5 text-gray-400 text-sm">
                            <li>Rango competitivo actual</li>
                            <li>RR (Rank Rating)</li>
                            <li>Estadísticas de partidas recientes</li>
                            <li>Agentes más utilizados</li>
                        </ul>
                    </div>
                </div>
            `
        }
    ],
    'configuracion-servidor': [
        {
            title: 'Configuración Inicial',
            icon: '🔧',
            content: `
                <div class="space-y-4">
                    <div class="bg-primary rounded-lg p-5 border border-[#333]">
                        <h4 class="text-lg font-bold text-white mb-3">Pasos para configurar</h4>
                        <ol class="space-y-2 list-decimal ml-5 text-gray-400 text-sm">
                            <li>Invita los bots a tu servidor</li>
                            <li>Asigna los permisos necesarios</li>
                            <li>Configura los canales de logs</li>
                            <li>Establece roles de moderación</li>
                            <li>Prueba los comandos básicos</li>
                        </ol>
                    </div>
                    <div class="bg-primary rounded-lg p-5 border border-[#333]">
                        <h4 class="text-lg font-bold text-white mb-3">Enlaces de Invitación</h4>
                        <ul class="space-y-2 list-disc ml-5 text-gray-400 text-sm">
                            <li>LosPerrisHelp - Bot de moderación</li>
                            <li>LosPerrisGame - Bot de gaming</li>
                        </ul>
                    </div>
                </div>
            `
        }
    ],
    'configuracion-avanzada': [
        {
            title: 'Configuración del Servidor',
            icon: '⚙️',
            content: `
                 <div class="space-y-4">
                    <div class="bg-primary rounded-lg p-5 border border-[#333]">
                        <h4 class="text-lg font-bold text-white mb-3">Permisos Requeridos</h4>
                        <ul class="space-y-2 list-disc ml-5 text-gray-400 text-sm">
                            <li>Administrar mensajes</li>
                            <li>Banear miembros</li>
                            <li>Expulsar miembros</li>
                            <li>Gestionar roles</li>
                            <li>Ver canales</li>
                            <li>Enviar mensajes</li>
                        </ul>
                    </div>
                    
                     <div class="bg-primary rounded-lg p-5 border border-[#333]">
                        <h4 class="text-lg font-bold text-white mb-3">Configuración de Canales</h4>
                        <ul class="space-y-2 list-disc ml-5 text-gray-400 text-sm">
                            <li>Canal de logs de moderación</li>
                            <li>Canal de reportes</li>
                            <li>Canal de bienvenidas</li>
                            <li>Canal de tickets</li>
                        </ul>
                    </div>

                    <div class="bg-[#5865F2]/10 rounded-lg p-5 border border-[#5865F2]/20">
                        <h4 class="text-lg font-bold text-white mb-2">💡 Recomendaciones</h4>
                         <ul class="space-y-1 text-gray-400 text-sm list-none">
                            <li>• Crea roles específicos para moderadores</li>
                            <li>• Configura canales privados para logs</li>
                            <li>• Establece límites de rate para comandos</li>
                        </ul>
                    </div>
                 </div>
            `
        }
    ],
    'permisos-roles': [
        {
            title: 'Sistema de Roles',
            icon: '👑',
            content: `
                <div class="space-y-4">
                    <div class="bg-primary rounded-lg p-5 border border-[#333]">
                        <h4 class="text-lg font-bold text-white mb-3">Roles Recomendados</h4>
                        <ul class="space-y-2 list-none p-0 text-sm">
                            <li class="text-gray-400 mb-2"><strong class="text-white">Administrador:</strong> Acceso completo a todos los comandos</li>
                            <li class="text-gray-400 mb-2"><strong class="text-white">Moderador:</strong> Comandos de moderación básica</li>
                            <li class="text-gray-400 mb-2"><strong class="text-white">Helper:</strong> Comandos de información y ayuda</li>
                            <li class="text-gray-400 mb-2"><strong class="text-white">Miembro:</strong> Comandos básicos y de entretenimiento</li>
                        </ul>
                    </div>
                     <div class="bg-primary rounded-lg p-5 border border-[#333]">
                        <h4 class="text-lg font-bold text-white mb-3">Configuración de Permisos</h4>
                         <ul class="space-y-2 list-disc ml-5 text-gray-400 text-sm">
                            <li>Los bots tengan rol superior a los usuarios</li>
                            <li>Los permisos estén bien jerarquizados</li>
                            <li>Existan roles de respaldo</li>
                        </ul>
                    </div>
                </div>
            `
        }
    ]
};
