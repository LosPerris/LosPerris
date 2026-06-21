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

// Inicializar en la carga principal
initLenis();

// Re-inicializar si Astro usa View Transitions
document.addEventListener("astro:page-load", () => {
  initLenis();
});
