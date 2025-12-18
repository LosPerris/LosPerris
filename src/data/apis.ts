export const apis = [
    {
        title: 'Twitch Followage API',
        description: 'API gratuita para consultar el tiempo de seguimiento (followage) entre un usuario y un canal. Ideal para comandos de bots (!followage).',
        icon: 'fab fa-twitch',
        color: 'text-[#9146FF]',
        link: 'https://www.losperris.site/followage',
        linkText: 'Visitar Demo',
        endpoints: [
            {
                method: 'GET',
                path: '/api/followage/:user/:channel',
                description: 'Devuelve textualmente el tiempo que lleva siguiendo el usuario al canal.',
                example: 'https://www.losperris.site/api/followage/usuario/canal'
            }
        ]
    },
    {
        title: 'Valorant API',
        description: 'Obtén datos en tiempo real de Valorant: Rango, MMR, Historial de partidas y más. Respuestas en texto plano para fácil integración.',
        icon: 'fas fa-crosshairs',
        color: 'text-[#FF4655]',
        link: 'https://www.losperris.site/valorantapi',
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
        link: '/qr',
        linkText: 'Crear QR',
        endpoints: [
            {
                method: 'WEB',
                path: '/qr',
                description: 'Interfaz gráfica para generación de QR.',
                example: 'https://www.losperris.site/qr'
            }
        ]
    }
];
