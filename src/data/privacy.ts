import { discordLink } from "./community";

export const privacySections = [
  {
    title: "1. Información que Recopilamos",
    icon: "fas fa-user-shield",
    content: `
      Para proporcionar nuestros servicios, recopilamos la siguiente información limitada:
      <ul class="ml-8 mb-4 list-disc marker:text-white">
          <li class="mb-2"><strong class="text-white">Datos de Discord:</strong> ID de usuario, nombre de usuario, avatar y ID de los servidores donde se usan los bots.</li>
          <li class="mb-2"><strong class="text-white">Datos de Uso:</strong> Comandos ejecutados, configuraciones del servidor y logs de errores para depuración.</li>
          <li class="mb-2"><strong class="text-white">Mensajes:</strong> Procesamos el contenido de los mensajes solo cuando se invoca un comando o para funciones de moderación (automod), pero no almacenamos el contenido de los mensajes permanentemente a menos que sea necesario para registros de infracciones (warns/bans).</li>
      </ul>
    `,
  },
  {
    title: "2. Cómo Usamos la Información",
    icon: "fas fa-tasks",
    content: `
      Utilizamos la información recopilada para:
      <ul class="ml-8 mb-4 list-disc marker:text-white">
          <li class="mb-2">Proporcionar y mantener la funcionalidad de nuestros servicios (Bots y APIs).</li>
          <li class="mb-2">Gestionar las características de moderación (historial de sanciones).</li>
          <li class="mb-2">Personalizar la experiencia del usuario (perfiles de juego, niveles).</li>
          <li class="mb-2">Mejorar nuestros servicios y corregir errores técnicos.</li>
      </ul>
    `,
  },
  {
    title: "3. Compartir Información",
    icon: "fas fa-share-alt",
    content: `
      <p class="mb-4">No vendemos ni alquilamos tus datos personales a terceros.</p>
      <p class="mb-4">Solo compartimos información si:</p>
      <ul class="ml-8 mb-4 list-disc marker:text-white">
          <li class="mb-2">Es requerido por ley.</li>
          <li class="mb-2">Es necesario para proteger nuestros derechos o la seguridad de otros usuarios.</li>
          <li class="mb-2">Es necesario para el cumplimiento de los Términos de Servicio de Discord.</li>
      </ul>
    `,
  },
  {
    title: "4. Almacenamiento y Seguridad",
    icon: "fas fa-database",
    content: `
      <p class="mb-4">Tus datos se almacenan en bases de datos seguras con acceso restringido.</p>
      <p class="mb-4">Implementamos medidas de seguridad razonables para proteger tus datos contra acceso no autorizado, alteración o destrucción.</p>
      <p class="mb-4">Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro, por lo que no podemos garantizar seguridad absoluta.</p>
    `,
  },
  {
    title: "5. Tus Derechos",
    icon: "fas fa-user-check",
    content: `
      <p class="mb-4">Tienes derecho a:</p>
      <ul class="ml-8 mb-4 list-disc marker:text-white">
          <li class="mb-2">Solicitar una copia de los datos que tenemos sobre ti.</li>
          <li class="mb-2">Solicitar la corrección de datos inexactos.</li>
          <li class="mb-2">Solicitar la eliminación de tus datos ("Derecho al Olvido").</li>
      </ul>
      <p class="mb-4">Para ejercer estos derechos, por favor contáctanos a través de nuestro servidor de soporte.</p>
    `,
  },
  {
    title: "6. Cambios en la Política",
    icon: "fas fa-history",
    content: `
      <p class="mb-4">Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos sobre cambios significativos a través de nuestro servidor de Discord o actualizando la fecha en esta página.</p>
    `,
  },
  {
    title: "7. Contacto",
    icon: "fas fa-envelope",
    content: `
      <p class="mb-4">Si tienes preguntas sobre esta Política de Privacidad, contáctanos en:</p>
      <div class="mt-4">
          <div class="flex items-center gap-3 mb-3 p-3 bg-[#404040] rounded-xl border border-[#404040]">
              <i class="fab fa-discord text-white text-xl w-5"></i>
              <span>Servidor de Soporte: <a href="${discordLink}" target="_blank" class="text-white font-semibold no-underline hover:underline">Los Perris Community</a></span>
          </div>
      </div>
    `,
  },
];
