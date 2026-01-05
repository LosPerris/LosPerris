const helpCommands = {
    "⚙️ Moderación": [
        { name: "/ban", description: "❌ Prohíbe a un usuario del servidor" },
        { name: "/banlist", description: "📖 Muestra la lista de usuarios baneados" },
        { name: "/unban", description: "✅ Desbanea a un usuario por ID o nombre#tag" },
        { name: "/warn", description: "❌ Advierte a un usuario. A las 3 advertencias será baneado automáticamente" },
        { name: "/checkwarns", description: "📖 Muestra la cantidad de advertencias de un usuario" },
        { name: "/unwarn", description: "✅ Quita advertencias a un usuario" },
        { name: "/kick", description: "❌ Expulsa a un usuario del servidor" },
        { name: "/purge", description: "🚮 Elimina una cantidad de mensajes del canal (solo admins)" },
        { name: "/reportar", description: "✅ Envía un reporte al canal configurado" }
    ],
    "❓ Información": [
        { name: "/avatar", description: "📷 Muestra el avatar de un usuario" },
        { name: "/help", description: "⁉️ Muestra los comandos disponibles por categoría" },
        { name: "/serverinfo", description: "📊 Muestra información del servidor" },
        { name: "/tarjeta", description: "🖼️ Genera una tarjeta de perfil personalizada" },
        { name: "/usuario", description: "🔍 Muestra información detallada de un usuario" }
    ],
    "🔐 Seguridad": [
        { name: "/analizar_archivo", description: "📁 Escanea un archivo" },
        { name: "/analizar_url", description: "🔎 Escanea una URL con VirusTotal" },
        { name: "/generar_password", description: "🔐 Genera una contraseña segura" }
    ],
    "😂 Diversión": [
        { name: "/gato", description: "😺 Muestra una imagen aleatoria de un gato" },
        { name: "/saludo", description: "Saluda a un usuario del servidor" }
    ],
    "🛠️ Utilidad": [
        { name: "/factura", description: "🧾 Genera una factura y la envía al destinatario" },
        { name: "/ticket_panel", description: "📨 Crear panel de tickets" }
    ]
};

const gameCommands = {
    "🎮 Fortnite": [
        { name: "/fortnite_stats", description: "🖼️ Muestra las stats de Fortnite de un jugador" },
        { name: "/fortnite_tienda", description: "🛒 Muestra la tienda diaria de Fortnite con filtros" }
    ],
    "👑 League of Legends": [
        { name: "/lol_random_build", description: "❓ Recomienda un campeón con build y runas aleatorias oficiales según rol" },
        { name: "/lol_champion_info", description: "📖 Muestra información detallada de un campeón de LoL" },
        { name: "/lol_info", description: "📖 Obtener perfil y clasificación de invocador (Solo el servidor de Americas de momento)" },
        { name: "/lol_items", description: "🛡️ Muestra los objetos de League of Legends con filtro y paginación" }
    ],
    "🎯 Valorant": [
        { name: "/valorant_agente", description: "📖 Muestra información detallada de un agente de Valorant (en español si está disponible)" },
        { name: "/valorant_armas", description: "🔫 Muestra armas de Valorant con filtros y paginación" },
        { name: "/valorant_info", description: "📖 Muestra información detallada de un jugador de Valorant" },
        { name: "/valorant_mapas", description: "🗺️ Muestra los mapas de Valorant (En proceso)" }
    ],
    "🧱 Minecraft": [
        { name: "/minecraft_skin", description: "🧱 Muestra el skin de un jugador de Minecraft con distintas vistas" }
    ],
    "🎴 Otros Juegos": [
        { name: "/cartapokemontcg", description: "🎴 Busca cartas Pokémon TCG con filtros" },
        { name: "/dragonball", description: "🐉 Busca personajes de Dragon Ball con filtros" }
    ],
    "🛠️ Utilidades": [
        { name: "/feedback", description: "Reporta un error o sugiere una idea para el bot" },
        { name: "/twitch", description: "🎮 Consulta información de un canal de Twitch" }
    ]
};

function showHelpCommands() {
    showCategorizedModal('Comandos de LosPerrisHelp', helpCommands);
}

function showGameCommands() {
    showCategorizedModal('Comandos de LosPerrisGame', gameCommands);
}

function showCategorizedModal(title, commands) {
    const modal = document.getElementById('commands-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    if (!modal || !modalTitle || !modalBody) return;

    modalTitle.textContent = title;

    let content = '';
    for (const [category, commandList] of Object.entries(commands)) {
        content += `
            <div class="command-category">
                <h3 class="category-title">${category}</h3>
                <div class="command-list">
        `;

        commandList.forEach(command => {
            content += `
                <div class="command-item">
                    <div class="command-name">${command.name}</div>
                    <div class="command-description">${command.description}</div>
                </div>
            `;
        });

        content += `
                </div>
            </div>
        `;
    }

    modalBody.innerHTML = content;
    modal.style.display = 'block';

    setTimeout(() => {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.classList.add('fade-in-up');
        }
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('commands-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

window.addEventListener('click', (event) => {
    const modal = document.getElementById('commands-modal');
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
