const helpChatMessages = [
  { type: "user", content: "/help" },
  {
    type: "bot",
    content:
      "¡Hola! Aquí tienes mis comandos organizados por categorías. ¿En qué puedo ayudarte?",
  },
  { type: "user", content: "/serverinfo" },
  {
    type: "bot",
    content:
      "📊 **Información del Servidor**\n👥 Miembros: 1,234\n📅 Creado: 15/03/2023\n🛡️ Nivel de verificación: Medio",
  },
  { type: "user", content: "/ban @usuario" },
  {
    type: "bot",
    content:
      "✅ Usuario baneado exitosamente. Razón: Violación de reglas del servidor.",
  },
];

const gameChatMessages = [
  { type: "user", content: "/valorant_agente Jett" },
  {
    type: "bot",
    content:
      "🎯 **Jett - Duelista**\n⚡ Habilidades: Dash, Smoke, Updraft\n🌟 Ultimate: Blade Storm\n💨 Especialidad: Movilidad y eliminaciones rápidas",
  },
  { type: "user", content: "/fortnite_stats Ninja" },
  {
    type: "bot",
    content:
      "🖼️ **Stats de Fortnite - Ninja**\n🏆 Victorias: 2,847\n💀 Eliminaciones: 45,231\n📊 K/D Ratio: 3.2\n⭐ Nivel: 1,000+",
  },
  { type: "user", content: "/lol_champion_info Yasuo" },
  {
    type: "bot",
    content:
      "👑 **Yasuo - El Imperdonable**\n⚔️ Rol: Asesino/Luchador\n💨 Pasiva: Camino del Errante\n🌪️ Ultimate: Último Aliento",
  },
];

function startHelpChat() {
  const chatContainer = document.getElementById("help-chat");
  const messagesContainer = document.getElementById("help-messages");

  if (!chatContainer || !messagesContainer) return;

  chatContainer.style.display = "block";
  messagesContainer.innerHTML = "";

  simulateChat(helpChatMessages, messagesContainer);
}

function startGameChat() {
  const chatContainer = document.getElementById("game-chat");
  const messagesContainer = document.getElementById("game-messages");

  if (!chatContainer || !messagesContainer) return;

  chatContainer.style.display = "block";
  messagesContainer.innerHTML = "";

  simulateChat(gameChatMessages, messagesContainer);
}

function simulateChat(messages, container) {
  let index = 0;

  function addMessage() {
    if (index < messages.length) {
      const message = messages[index];
      const messageDiv = document.createElement("div");
      messageDiv.className = `message ${message.type}`;
      messageDiv.innerHTML = message.content.replace(/\n/g, "<br>");

      container.appendChild(messageDiv);
      container.scrollTop = container.scrollHeight;

      index++;
      setTimeout(addMessage, 1500);
    }
  }

  addMessage();
}
