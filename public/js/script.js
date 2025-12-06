const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const dropdowns = document.querySelectorAll('.dropdown');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('.nav-link');
        
        dropdownLink.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
                
                dropdown.classList.toggle('active');
            }
        });
    });

    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        });
    });

    navLinks.forEach(link => {
        if (!link.closest('.dropdown')) {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

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

const helpChatMessages = [
    { type: 'user', content: '/help' },
    { type: 'bot', content: '¡Hola! Aquí tienes mis comandos organizados por categorías. ¿En qué puedo ayudarte?' },
    { type: 'user', content: '/serverinfo' },
    { type: 'bot', content: '📊 **Información del Servidor**\n👥 Miembros: 1,234\n📅 Creado: 15/03/2023\n🛡️ Nivel de verificación: Medio' },
    { type: 'user', content: '/ban @usuario' },
    { type: 'bot', content: '✅ Usuario baneado exitosamente. Razón: Violación de reglas del servidor.' }
];

const gameChatMessages = [
    { type: 'user', content: '/valorant_agente Jett' },
    { type: 'bot', content: '🎯 **Jett - Duelista**\n⚡ Habilidades: Dash, Smoke, Updraft\n🌟 Ultimate: Blade Storm\n💨 Especialidad: Movilidad y eliminaciones rápidas' },
    { type: 'user', content: '/fortnite_stats Ninja' },
    { type: 'bot', content: '🖼️ **Stats de Fortnite - Ninja**\n🏆 Victorias: 2,847\n💀 Eliminaciones: 45,231\n📊 K/D Ratio: 3.2\n⭐ Nivel: 1,000+' },
    { type: 'user', content: '/lol_champion_info Yasuo' },
    { type: 'bot', content: '👑 **Yasuo - El Imperdonable**\n⚔️ Rol: Asesino/Luchador\n💨 Pasiva: Camino del Errante\n🌪️ Ultimate: Último Aliento' }
];

function startHelpChat() {
    const chatContainer = document.getElementById('help-chat');
    const messagesContainer = document.getElementById('help-messages');
    
    if (!chatContainer || !messagesContainer) return;
    
    chatContainer.style.display = 'block';
    messagesContainer.innerHTML = '';
    
    simulateChat(helpChatMessages, messagesContainer);
}

function startGameChat() {
    const chatContainer = document.getElementById('game-chat');
    const messagesContainer = document.getElementById('game-messages');
    
    if (!chatContainer || !messagesContainer) return;
    
    chatContainer.style.display = 'block';
    messagesContainer.innerHTML = '';
    
    simulateChat(gameChatMessages, messagesContainer);
}

function simulateChat(messages, container) {
    let index = 0;
    
    function addMessage() {
        if (index < messages.length) {
            const message = messages[index];
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${message.type}`;
            messageDiv.innerHTML = message.content.replace(/\n/g, '<br>');
            
            container.appendChild(messageDiv);
            container.scrollTop = container.scrollHeight;
            
            index++;
            setTimeout(addMessage, 1500);
        }
    }
    
    addMessage();
}

function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    const particleCount = window.innerWidth < 768 ? 60 : 100;
    
    particlesContainer.innerHTML = '';
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        const size = Math.random() * 3 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.opacity = Math.random() * 0.6 + 0.3;
        
        particlesContainer.appendChild(particle);
    }
}

let ticking = false;

function updateHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    if (window.scrollY > 100) {
        header.style.background = 'rgba(26, 26, 26, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        header.classList.add('scrolled');
    } else {
        header.style.background = 'rgba(26, 26, 26, 0.95)';
        header.style.boxShadow = 'none';
        header.classList.remove('scrolled');
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
    }
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('fade-in-up');
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    
    document.querySelectorAll('.feature-card, .game-card, .bot-header').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            createParticles();
        }, 250);
    });
});