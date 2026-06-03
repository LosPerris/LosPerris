import emailjs from "@emailjs/browser";

const setupContactForm = (): void => {
  const form = document.getElementById("contactForm") as HTMLFormElement | null;

  // Inicializamos EmailJS con la clave pública
  emailjs.init(import.meta.env.PUBLIC_EMAILJS_KEY || "GMUaeNqA-ftlkGhwm");

  if (form) {
    if (form.hasAttribute("data-has-listener")) return;
    form.setAttribute("data-has-listener", "true");

    const inputs = form.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >("input, select, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", validateField as EventListener);
      input.addEventListener("input", clearErrors as EventListener);
    });

    form.addEventListener("submit", function (event: Event) {
      event.preventDefault();

      const btn = form.querySelector(
        'button[type="submit"]',
      ) as HTMLButtonElement | null;
      const originalText = btn ? btn.innerHTML : "";

      let isValid = true;
      inputs.forEach((input) => {
        if (!validateField({ target: input } as unknown as Event))
          isValid = false;
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
        from_name: (
          form.elements.namedItem("nombre") as HTMLInputElement
        ).value.trim(),
        from_email: (
          form.elements.namedItem("email") as HTMLInputElement
        ).value.trim(),
        subject: (
          form.elements.namedItem("asunto") as HTMLInputElement
        ).value.trim(),
        message: (
          form.elements.namedItem("mensaje") as HTMLTextAreaElement
        ).value.trim(),
        to_email: form.dataset.toEmail,
        sent_date: new Date().toLocaleString("es-ES"),
      };

      emailjs
        .send(
          import.meta.env.PUBLIC_EMAILJS_SERVICE_ID || "service_3hduvpa",
          import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID || "template_f4qyw0q",
          templateParams,
        )
        .then(function () {
          showNotification("¡Mensaje enviado correctamente!", "success");
          form.reset();
        })
        .catch(function (error) {
          console.error("FAILED...", error);
          showNotification("Error al enviar. Inténtalo de nuevo.", "error");
        })
        .finally(function () {
          if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
          }
        });
    });
  }

  function validateField(event: Event): boolean {
    const field = event.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
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

  function showFieldError(field: HTMLElement, message: string): void {
    const error = document.createElement("span");
    error.className = "field-error text-red-500 text-sm mt-1 block";
    error.innerText = message;
    field.style.borderColor = "#ef4444";
    if (field.parentElement) {
      field.parentElement.appendChild(error);
    }
  }

  function clearFieldError(field: HTMLElement): void {
    if (field.parentElement) {
      const error = field.parentElement.querySelector(".field-error");
      if (error) error.remove();
    }
    field.style.borderColor = "rgba(255, 255, 255, 0.1)";
  }

  function clearErrors(event: Event): void {
    clearFieldError(event.target as HTMLElement);
  }

  function showNotification(
    message: string,
    type: "info" | "success" | "error" = "info",
  ): void {
    const notification = document.createElement("div");
    notification.className = `fixed top-5 right-5 z-50 p-4 rounded-lg shadow-xl flex items-center gap-3 animate-[slideIn_0.3s_ease] border border-white/10 ${
      type === "success"
        ? "bg-green-900/90 text-green-100"
        : type === "error"
          ? "bg-red-900/90 text-red-100"
          : "bg-gray-800 text-white"
    }`;

    const icon = document.createElement("i");
    icon.className = `fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`;
    icon.setAttribute("aria-hidden", "true");

    const span = document.createElement("span");
    span.textContent = message;

    notification.appendChild(icon);
    notification.appendChild(span);

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
