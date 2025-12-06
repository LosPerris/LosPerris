
const filterButtons = document.querySelectorAll('.filter-btn');
const guideCards = document.querySelectorAll('.guide-card');
const searchInput = document.getElementById('searchInput');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        guideCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                card.classList.add('show');
            } else {
                card.style.display = 'none';
                card.classList.remove('show');
            }
        });
    });
});

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        guideCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

const guideContent = {
    'comandos-basicos': {
        title: 'Comandos Básicos - LosPerrisHelp',
        content: `
            <div class="space-y-6">
                <div>
                    <h3 class="text-xl font-bold text-white mb-4 border-b border-[#404040] pb-2 text-left flex items-center gap-2">❓ Información</h3>
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040]">
                        <ul class="space-y-3 m-0 list-none p-0">
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/avatar</code> <span>📷 - Muestra el avatar de un usuario</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/help</code> <span>⁉️ - Muestra los comandos disponibles por categoría</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/serverinfo</code> <span>📊 - Muestra información del servidor</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/tarjeta</code> <span>🖼️ - Genera una tarjeta de perfil personalizada</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/usuario</code> <span>🔍 - Muestra información detallada de un usuario</span></li>
                        </ul>
                    </div>
                </div>
                
                <div>
                    <h3 class="text-xl font-bold text-white mb-4 border-b border-[#404040] pb-2 text-left flex items-center gap-2">😂 Diversión</h3>
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040]">
                        <ul class="space-y-3 m-0 list-none p-0">
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/gato</code> <span>😺 - Muestra una imagen aleatoria de un gato</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/saludo</code> <span>- Saluda a un usuario del servidor</span></li>
                        </ul>
                    </div>
                </div>
                
                <div>
                    <h3 class="text-xl font-bold text-white mb-4 border-b border-[#404040] pb-2 text-left flex items-center gap-2">🔧 Utilidad</h3>
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040]">
                        <ul class="space-y-3 m-0 list-none p-0">
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/factura</code> <span>🧾 - Genera una factura y la envía al destinatario</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/ticket_panel</code> <span>📨 - Crear panel de tickets</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        `
    },
    'moderacion': {
        title: 'Funciones de Moderación - LosPerrisHelp',
        content: `
            <div class="space-y-6">
                <div>
                    <h3 class="text-xl font-bold text-white mb-4 border-b border-[#404040] pb-2 text-left flex items-center gap-2">⚙️ Moderación</h3>
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040] mb-4">
                        <h4 class="text-lg font-semibold text-white mb-3 text-left">Gestión de Usuarios</h4>
                        <ul class="space-y-3 m-0 list-none p-0">
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/ban</code> <span>❌ - Prohíbe a un usuario del servidor</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/banlist</code> <span>📖 - Muestra la lista de usuarios baneados</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/unban</code> <span>✅ - Desbanea a un usuario por ID o nombre#tag</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/kick</code> <span>❌ - Expulsa a un usuario del servidor</span></li>
                        </ul>
                    </div>
                
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040] mb-4">
                        <h4 class="text-lg font-semibold text-white mb-3 text-left">Sistema de Advertencias</h4>
                        <ul class="space-y-3 m-0 list-none p-0">
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/warn</code> <span>❌ - Advierte a un usuario. A las 3 advertencias será baneado automáticamente</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/checkwarns</code> <span>📖 - Muestra la cantidad de advertencias de un usuario</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/unwarn</code> <span>✅ - Quita advertencias a un usuario</span></li>
                        </ul>
                    </div>
                
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040]">
                        <h4 class="text-lg font-semibold text-white mb-3 text-left">Gestión de Mensajes</h4>
                        <ul class="space-y-3 m-0 list-none p-0">
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/purge</code> <span>🚮 - Elimina una cantidad de mensajes del canal (solo admins)</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/reportar</code> <span>✅ - Envía un reporte al canal configurado</span></li>
                        </ul>
                    </div>
                </div>
                
                <div>
                    <h3 class="text-xl font-bold text-white mb-4 border-b border-[#404040] pb-2 text-left flex items-center gap-2">🔐 Seguridad</h3>
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040]">
                        <ul class="space-y-3 m-0 list-none p-0">
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/analizar_archivo</code> <span>📁 - Escanea un archivo</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/analizar_url</code> <span>🔎 - Escanea una URL con VirusTotal</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/generar_password</code> <span>🔐 - Genera una contraseña segura</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        `
    },
    'comandos-gaming': {
        title: 'Comandos de Gaming - LosPerrisGame',
        content: `
            <div class="space-y-6">
                <div>
                    <h3 class="text-xl font-bold text-white mb-4 border-b border-[#404040] pb-2 text-left flex items-center gap-2">🎮 Fortnite</h3>
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040]">
                        <ul class="space-y-3 m-0 list-none p-0">
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/fortnite_stats</code> <span>🖼️ - Muestra las stats de Fortnite de un jugador</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/fortnite_tienda</code> <span>🛒 - Muestra la tienda diaria de Fortnite con filtros</span></li>
                        </ul>
                    </div>
                </div>
                
                <div>
                    <h3 class="text-xl font-bold text-white mb-4 border-b border-[#404040] pb-2 text-left flex items-center gap-2">🏆 League of Legends</h3>
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040]">
                        <ul class="space-y-3 m-0 list-none p-0">
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/lol_random_build</code> <span>❓ - Recomienda un campeón con build y runas aleatorias oficiales según rol</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/lol_champion_info</code> <span>📖 - Muestra información detallada de un campeón de LoL</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/lol_info</code> <span>📖 - Obtener perfil y clasificación de invocador (Solo el servidor de Americas de momento)</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/lol_items</code> <span>🛡️ - Muestra los objetos de League of Legends con filtro y paginación</span></li>
                        </ul>
                    </div>
                </div>
                
                <div>
                    <h3 class="text-xl font-bold text-white mb-4 border-b border-[#404040] pb-2 text-left flex items-center gap-2">🔫 Valorant</h3>
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040]">
                        <ul class="space-y-3 m-0 list-none p-0">
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/valorant_agente</code> <span>📖 - Muestra información detallada de un agente de Valorant (en español si está disponible)</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/valorant_armas</code> <span>🔫 - Muestra armas de Valorant con filtros y paginación</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/valorant_info</code> <span>📖 - Muestra información detallada de un jugador de Valorant</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/valorant_mapas</code> <span>🗺️ - Muestra los mapas de Valorant (En proceso)</span></li>
                        </ul>
                    </div>
                </div>
                
                <div>
                    <h3 class="text-xl font-bold text-white mb-4 border-b border-[#404040] pb-2 text-left flex items-center gap-2">🎲 Otros Juegos</h3>
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040]">
                        <ul class="space-y-3 m-0 list-none p-0">
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/minecraft_skin</code> <span>🧱 - Muestra el skin de un jugador de Minecraft con distintas vistas</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/cartapokemontcg</code> <span>🎴 - Busca cartas Pokémon TCG con filtros</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/dragonball</code> <span>🐉 - Busca personajes de Dragon Ball con filtros</span></li>
                        </ul>
                    </div>
                </div>
                
                <div>
                    <h3 class="text-xl font-bold text-white mb-4 border-b border-[#404040] pb-2 text-left flex items-center gap-2">📺 Entretenimiento</h3>
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040]">
                        <ul class="space-y-3 m-0 list-none p-0">
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/twitch</code> <span>🎮 - Consulta información de un canal de Twitch</span></li>
                            <li class="flex items-start gap-2 text-[#b0b0b0]"><code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040] whitespace-nowrap">/feedback</code> <span>- Reporta un error o sugiere una idea para el bot</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        `
    },
    'estadisticas-juegos': {
        title: 'Estadísticas de Juegos Detalladas',
        content: `
            <div class="space-y-6">
                <div>
                    <h3 class="text-xl font-bold text-white mb-4 border-b border-[#404040] pb-2 text-left flex items-center gap-2">📊 Cómo usar las estadísticas</h3>
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040] mb-4">
                        <h4 class="text-lg font-semibold text-white mb-3 text-left">Fortnite Stats</h4>
                        <p class="text-[#b0b0b0] mb-3">Usa <code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040]">/fortnite_stats [nombre_usuario]</code> para obtener:</p>
                        <ul class="space-y-2 m-0 list-disc ml-5 text-[#b0b0b0]">
                            <li>Estadísticas de Battle Royale</li>
                            <li>Wins, kills, K/D ratio</li>
                            <li>Tiempo jugado</li>
                            <li>Estadísticas por temporada</li>
                        </ul>
                    </div>
                
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040] mb-4">
                        <h4 class="text-lg font-semibold text-white mb-3 text-left">League of Legends</h4>
                        <p class="text-[#b0b0b0] mb-3">Usa <code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040]">/lol_info [nombre_invocador]</code> para ver:</p>
                        <ul class="space-y-2 m-0 list-disc ml-5 text-[#b0b0b0]">
                            <li>Rango actual en todas las colas</li>
                            <li>LP (League Points)</li>
                            <li>Winrate de la temporada</li>
                            <li>Campeones más jugados</li>
                        </ul>
                    </div>
                
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040]">
                        <h4 class="text-lg font-semibold text-white mb-3 text-left">Valorant</h4>
                        <p class="text-[#b0b0b0] mb-3">Usa <code class="bg-[#1a1a1a] text-[#5865F2] px-2 py-1 rounded font-mono text-sm border border-[#404040]">/valorant_info [nombre_usuario#tag]</code> para obtener:</p>
                        <ul class="space-y-2 m-0 list-disc ml-5 text-[#b0b0b0]">
                            <li>Rango competitivo actual</li>
                            <li>RR (Rank Rating)</li>
                            <li>Estadísticas de partidas recientes</li>
                            <li>Agentes más utilizados</li>
                        </ul>
                    </div>
                </div>
            </div>
        `
    },
    'configuracion-avanzada': {
        title: 'Configuración Avanzada del Sistema',
        content: `
            <div class="space-y-6">
                <div>
                    <h3 class="text-xl font-bold text-white mb-4 border-b border-[#404040] pb-2 text-left flex items-center gap-2">⚙️ Configuración del Servidor</h3>
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040] mb-4">
                        <h4 class="text-lg font-semibold text-white mb-3 text-left">Permisos Requeridos</h4>
                        <p class="text-[#b0b0b0] mb-3">Para usar todas las funciones, el bot necesita:</p>
                        <ul class="space-y-2 m-0 list-disc ml-5 text-[#b0b0b0]">
                            <li>Administrar mensajes</li>
                            <li>Banear miembros</li>
                            <li>Expulsar miembros</li>
                            <li>Gestionar roles</li>
                            <li>Ver canales</li>
                            <li>Enviar mensajes</li>
                        </ul>
                    </div>
                
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040] mb-4">
                        <h4 class="text-lg font-semibold text-white mb-3 text-left">Configuración de Canales</h4>
                        <ul class="space-y-2 m-0 list-disc ml-5 text-[#b0b0b0]">
                            <li>Canal de logs de moderación</li>
                            <li>Canal de reportes</li>
                            <li>Canal de bienvenidas</li>
                            <li>Canal de tickets</li>
                        </ul>
                    </div>
                
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border-l-4 border-[#5865F2] border-[#404040]">
                        <h4 class="text-lg font-semibold text-white mb-2 text-left">💡 Recomendaciones</h4>
                        <p class="text-[#b0b0b0] mb-1">• Crea roles específicos para moderadores</p>
                        <p class="text-[#b0b0b0] mb-1">• Configura canales privados para logs</p>
                        <p class="text-[#b0b0b0] mb-0">• Establece límites de rate para comandos</p>
                    </div>
                </div>
            </div>
        `
    },
    'configuracion-servidor': {
        title: 'Configuración del Servidor',
        content: `
            <div class="space-y-6">
                <div>
                    <h3 class="text-xl font-bold text-white mb-4 border-b border-[#404040] pb-2 text-left flex items-center gap-2">🔧 Configuración Inicial</h3>
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040] mb-4">
                        <h4 class="text-lg font-semibold text-white mb-3 text-left">Pasos para configurar</h4>
                        <ol class="space-y-2 m-0 list-decimal ml-5 text-[#b0b0b0]">
                            <li>Invita los bots a tu servidor</li>
                            <li>Asigna los permisos necesarios</li>
                            <li>Configura los canales de logs</li>
                            <li>Establece roles de moderación</li>
                            <li>Prueba los comandos básicos</li>
                        </ol>
                    </div>
                
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040]">
                        <h4 class="text-lg font-semibold text-white mb-3 text-left">Enlaces de Invitación</h4>
                        <p class="text-[#b0b0b0] mb-3">Usa estos enlaces para invitar los bots:</p>
                        <ul class="space-y-2 m-0 list-disc ml-5 text-[#b0b0b0]">
                            <li>LosPerrisHelp - Bot de moderación</li>
                            <li>LosPerrisGame - Bot de gaming</li>
                        </ul>
                    </div>
                </div>
            </div>
        `
    },
    'permisos-roles': {
        title: 'Gestión de Permisos y Roles',
        content: `
            <div class="space-y-6">
                <div>
                    <h3 class="text-xl font-bold text-white mb-4 border-b border-[#404040] pb-2 text-left flex items-center gap-2">👑 Sistema de Roles</h3>
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040] mb-4">
                        <h4 class="text-lg font-semibold text-white mb-3 text-left">Roles Recomendados</h4>
                        <ul class="space-y-2 m-0 list-none p-0">
                            <li class="text-[#b0b0b0] mb-2"><strong class="text-white">Administrador:</strong> Acceso completo a todos los comandos</li>
                            <li class="text-[#b0b0b0] mb-2"><strong class="text-white">Moderador:</strong> Comandos de moderación básica</li>
                            <li class="text-[#b0b0b0] mb-2"><strong class="text-white">Helper:</strong> Comandos de información y ayuda</li>
                            <li class="text-[#b0b0b0] mb-2"><strong class="text-white">Miembro:</strong> Comandos básicos y de entretenimiento</li>
                        </ul>
                    </div>
                
                    <div class="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040]">
                        <h4 class="text-lg font-semibold text-white mb-3 text-left">Configuración de Permisos</h4>
                        <p class="text-[#b0b0b0] mb-3">Asegúrate de que:</p>
                        <ul class="space-y-2 m-0 list-disc ml-5 text-[#b0b0b0]">
                            <li>Los bots tengan rol superior a los usuarios</li>
                            <li>Los permisos estén bien jerarquizados</li>
                            <li>Existan roles de respaldo</li>
                        </ul>
                    </div>
                </div>
            </div>
        `
    }
};

function openGuide(guideId) {
    const guide = guideContent[guideId];
    if (guide) {
        document.getElementById('modalTitle').textContent = guide.title;
        document.getElementById('modalBody').innerHTML = guide.content;
        document.getElementById('guideModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeGuide() {
    document.getElementById('guideModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('guideModal');
    if (e.target === modal) {
        closeGuide();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeGuide();
    }
});