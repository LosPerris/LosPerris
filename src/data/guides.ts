import { commandsData, type GuideSection } from './commands';

export interface Guide {
    id: string;
    title: string;
    category: 'bot-ayuda' | 'bot-gaming' | 'configuracion';
    description: string;
    icon: string;
    difficulty: 'Fácil' | 'Intermedio' | 'Avanzado';
    difficultyColor: 'bg-green-400' | 'bg-yellow-400' | 'bg-red-500';
    difficultyTextColor: 'text-black' | 'text-white';
    time: string;
    contentTitle: string;
    sections: GuideSection[];
}

export const guides: Guide[] = [
    {
        id: 'comandos-basicos',
        title: 'Comandos Básicos',
        category: 'bot-ayuda',
        description: 'Aprende los comandos esenciales del Bot Ayuda',
        icon: 'fas fa-robot',
        difficulty: 'Fácil',
        difficultyColor: 'bg-green-400',
        difficultyTextColor: 'text-black',
        time: '5 min',
        contentTitle: 'Comandos Básicos - LosPerrisHelp',
        sections: commandsData['comandos-basicos']
    },
    {
        id: 'moderacion',
        title: 'Moderación',
        category: 'bot-ayuda',
        description: 'Configura y usa las funciones de moderación',
        icon: 'fas fa-shield-alt',
        difficulty: 'Intermedio',
        difficultyColor: 'bg-yellow-400',
        difficultyTextColor: 'text-black',
        time: '10 min',
        contentTitle: 'Funciones de Moderación - LosPerrisHelp',
        sections: commandsData['moderacion']
    },
    {
        id: 'configuracion-avanzada',
        title: 'Configuración Avanzada',
        category: 'bot-ayuda',
        description: 'Personaliza el bot según tus necesidades',
        icon: 'fas fa-cog',
        difficulty: 'Avanzado',
        difficultyColor: 'bg-red-500',
        difficultyTextColor: 'text-white',
        time: '15 min',
        contentTitle: 'Configuración Avanzada del Sistema',
        sections: commandsData['configuracion-avanzada']
    },
    {
        id: 'comandos-gaming',
        title: 'Comandos de Gaming',
        category: 'bot-gaming',
        description: 'Descubre todos los comandos de juegos disponibles',
        icon: 'fas fa-gamepad',
        difficulty: 'Fácil',
        difficultyColor: 'bg-green-400',
        difficultyTextColor: 'text-black',
        time: '7 min',
        contentTitle: 'Comandos de Gaming - LosPerrisGame',
        sections: commandsData['comandos-gaming']
    },
    {
        id: 'estadisticas-juegos',
        title: 'Estadísticas de Juegos',
        category: 'bot-gaming',
        description: 'Consulta stats de Fortnite, LoL, Valorant y más',
        icon: 'fas fa-trophy',
        difficulty: 'Intermedio',
        difficultyColor: 'bg-yellow-400',
        difficultyTextColor: 'text-black',
        time: '12 min',
        contentTitle: 'Estadísticas de Juegos Detalladas',
        sections: commandsData['estadisticas-juegos']
    },
    {
        id: 'configuracion-servidor',
        title: 'Configuración del Servidor',
        category: 'configuracion',
        description: 'Configura tu servidor para usar los bots',
        icon: 'fas fa-server',
        difficulty: 'Intermedio',
        difficultyColor: 'bg-yellow-400',
        difficultyTextColor: 'text-black',
        time: '8 min',
        contentTitle: 'Configuración del Servidor',
        sections: commandsData['configuracion-servidor']
    },
    {
        id: 'permisos-roles',
        title: 'Permisos y Roles',
        category: 'configuracion',
        description: 'Gestiona permisos y roles correctamente',
        icon: 'fas fa-key',
        difficulty: 'Avanzado',
        difficultyColor: 'bg-red-500',
        difficultyTextColor: 'text-white',
        time: '18 min',
        contentTitle: 'Gestión de Permisos y Roles',
        sections: commandsData['permisos-roles']
    }
];
