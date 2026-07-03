import Lenis from "lenis";

let lenis: Lenis | null = null;
let rafId: number;

function initLenis() {
  if (lenis) {
    lenis.destroy();
    cancelAnimationFrame(rafId);
  }

  lenis = new Lenis();

  function raf(time: number) {
    lenis?.raf(time);
    rafId = requestAnimationFrame(raf);
  }

  rafId = requestAnimationFrame(raf);
}

function scrollToTop() {
  lenis?.scrollTo(0, { immediate: true });
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

// Inicializar en la carga principal
initLenis();
scrollToTop();

// Re-inicializar si Astro usa View Transitions (y subir al inicio de la página)
document.addEventListener("astro:page-load", () => {
  initLenis();
  scrollToTop();
});
