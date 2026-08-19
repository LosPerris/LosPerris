type ToastVariant = "default" | "success" | "brand";

interface ToastOptions {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  icon?: string;
}

class ToastManager {
  private getContainer(): HTMLElement | null {
    return document.getElementById("toast-container");
  }

  show({ message, variant = "default", duration = 4000, icon }: ToastOptions) {
    const container = this.getContainer();
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast-item toast-enter ${variant}`;

    let defaultIcon = "";
    if (variant === "success") {
      defaultIcon = `<i class="fas fa-check-circle"></i>`;
    } else if (variant === "brand") {
      defaultIcon = `<i class="fas fa-bell"></i>`;
    } else {
      defaultIcon = `<i class="fas fa-info-circle text-zinc-500"></i>`;
    }

    toast.innerHTML = `
      <div class="toast-icon">
        ${icon || defaultIcon}
      </div>
      <div>${message}</div>
    `;

    container.appendChild(toast);

    // Remove logic
    const removeToast = () => {
      toast.classList.remove("toast-enter");
      toast.classList.add("toast-leave");

      toast.addEventListener("animationend", () => {
        toast.remove();
      });
    };

    // Auto remove
    let timeoutId = setTimeout(removeToast, duration);

    // Pause on hover
    toast.addEventListener("mouseenter", () => {
      clearTimeout(timeoutId);
    });

    toast.addEventListener("mouseleave", () => {
      timeoutId = setTimeout(removeToast, duration / 2);
    });
  }
}

// Global instance
export const toast = new ToastManager();

// Window type extension
declare global {
  interface Window {
    toast: ToastManager;
  }
}

// Attach to window so it can be called from inline scripts or anywhere
if (typeof window !== "undefined") {
  window.toast = toast;
}
