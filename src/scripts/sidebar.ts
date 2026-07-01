export {};

const setupSidebar = (): void => {
  const triggers = document.querySelectorAll(".accordion-trigger");
  const toggleBtn = document.getElementById("toggle-sidebar");
  const nav = document.getElementById("sidebar-nav");

  if (!triggers.length && !toggleBtn) return;

  triggers.forEach((trigger) => {
    if (trigger.hasAttribute("data-has-listener")) return;
    trigger.setAttribute("data-has-listener", "true");

    trigger.addEventListener("click", () => {
      const category = trigger.getAttribute("data-category");
      const content = document.getElementById(`content-${category}`);
      const chevron = trigger.querySelector(".fa-chevron-right")?.parentElement;
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        if (content) {
          content.style.maxHeight = "0";
          content.style.opacity = "0";
        }
        chevron?.classList.remove("rotate-90");
        trigger.setAttribute("aria-expanded", "false");
      } else {
        if (content) {
          content.style.maxHeight = content.scrollHeight + "px";
          content.style.opacity = "100";
        }
        chevron?.classList.add("rotate-90");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  if (toggleBtn && nav) {
    if (!toggleBtn.hasAttribute("data-has-listener")) {
      toggleBtn.setAttribute("data-has-listener", "true");
      toggleBtn.addEventListener("click", () => {
        nav.classList.toggle("hidden");
      });
    }
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupSidebar);
} else {
  setupSidebar();
}

document.addEventListener("astro:page-load", setupSidebar);
