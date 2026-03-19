const setupContactForm = () => {
  const form = document.getElementById("contactForm");

  if (window.emailjs && !window.emailjs.isInitialized) {
    emailjs.init("GMUaeNqA-ftlkGhwm");
    window.emailjs.isInitialized = true;
  }

  if (form) {
    if (form.hasAttribute("data-has-listener")) return;
    form.setAttribute("data-has-listener", "true");

    const inputs = form.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", validateField);
      input.addEventListener("input", clearErrors);
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;

      let isValid = true;
      inputs.forEach((input) => {
        if (!validateField({ target: input })) isValid = false;
      });

      if (!isValid) {
        showNotification("Por favor corrige los errores.", "error");
        return;
      }

      if (btn) {
        btn.innerHTML =
          '<i class="fas fa-spinner fa-spin mr-2"></i> Enviando...';
        btn.disabled = true;
      }

      const templateParams = {
        from_name: form.nombre.value.trim(),
        from_email: form.email.value.trim(),
        subject: form.asunto.value.trim(),
        message: form.mensaje.value.trim(),
        to_email: form.dataset.toEmail,
        sent_date: new Date().toLocaleString("es-ES"),
      };

      if (window.emailjs) {
        emailjs
          .send("service_3hduvpa", "template_f4qyw0q", templateParams)
          .then(function (response) {
            showNotification("¡Mensaje enviado correctamente!", "success");
            form.reset();
          })
          .catch(function (error) {
            console.error("FAILED...", error);
            showNotification("Error al enviar. Inténtalo de nuevo.", "error");
          })
          .finally(function () {
            btn.innerHTML = originalText;
            btn.disabled = false;
          });
      } else {
        console.error("EmailJS not loaded");
        showNotification("Error: Sistema de correo no disponible.", "error");
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  }

  function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    clearFieldError(field);

    if (field.hasAttribute("required") && !value) {
      showFieldError(field, "Este campo es obligatorio");
      return false;
    }

    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showFieldError(field, "Email inválido");
        return false;
      }
    }
    return true;
  }

  function showFieldError(field, message) {
    const error = document.createElement("span");
    error.className = "field-error text-red-500 text-sm mt-1 block";
    error.innerText = message;
    field.style.borderColor = "#ef4444";
    field.parentElement.appendChild(error);
  }

  function clearFieldError(field) {
    const error = field.parentElement.querySelector(".field-error");
    if (error) error.remove();
    field.style.borderColor = "rgba(255, 255, 255, 0.1)";
  }

  function clearErrors(event) {
    clearFieldError(event.target);
  }

  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `fixed top-5 right-5 z-50 p-4 rounded-lg shadow-xl flex items-center gap-3 animate-[slideIn_0.3s_ease] border border-white/10 ${
      type === "success"
        ? "bg-green-900/90 text-green-100"
        : type === "error"
          ? "bg-red-900/90 text-red-100"
          : "bg-gray-800 text-white"
    }`;

    notification.innerHTML = `
            <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
            <span>${message}</span>
        `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupContactForm);
} else {
  setupContactForm();
}

document.addEventListener("astro:page-load", setupContactForm);
