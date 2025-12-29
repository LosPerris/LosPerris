export const apis = [
    {
        title: 'Herramientas de Twitch',
        description: 'Suite completa para streamers: API de Followage y gestor de Clips. Todo en un solo lugar.',
        icon: 'fab fa-twitch',
        color: 'text-[#9146FF]',
        link: '/twitch/',
        linkText: 'Ir al Panel',
        endpoints: [
            {
                method: 'GET',
                path: '/api/followage/:user/:channel',
                description: 'API de tiempo de seguimiento (Followage).',
                example: 'https://www.losperris.site/api/followage/usuario/canal'
            },
            {
                method: 'WEB',
                path: '/api/clips',
                description: 'Gestor y descargador de Clips.',
                example: 'https://www.losperris.site/twitch/clips'
            }
        ]
    },
    {
        title: 'Valorant API',
        description: 'Obtén datos en tiempo real de Valorant: Rango, MMR, Historial de partidas y más. Respuestas en texto plano para fácil integración.',
        icon: 'fas fa-crosshairs',
        color: 'text-[#FF4655]',
        link: '/api/valorant',
        linkText: 'Visitar Web',
        endpoints: [
            {
                method: 'GET',
                path: '/valorant/v1/mmr/:region/:name/:tag',
                description: 'Obtiene el rango y ELO actual de un jugador.',
                example: 'https://api.henrikdev.xyz/valorant/v1/mmr/na/user/tag'
            },
            {
                method: 'GET',
                path: '/valorant/v1/account/:name/:tag',
                description: 'Información general de la cuenta (Nivel, tarjeta, etc).',
                example: 'https://api.henrikdev.xyz/valorant/v1/account/user/tag'
            }
        ]
    },
    {
        title: 'Generador de Códigos QR',
        description: 'Herramienta visual profesional para crear códigos QR personalizados. Soporta estilos, logotipos, WiFi, VCard y descargas en alta resolución.',
        icon: 'fas fa-qrcode',
        color: 'text-[#FACC15]',
        link: '/api/qr',
        linkText: 'Crear QR',
        endpoints: [
            {
                method: 'WEB',
                path: '/api/qr',
                description: 'Interfaz gráfica para generación de QR.',
                example: 'https://www.losperris.site/api/qr'
            }
        ]
    }
];
