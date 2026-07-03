import Lenis from "lenis";

let lenis: Lenis | null = null;
let rafId: number;

/** Compensa el header fijo (h-16) + un poco de aire */
const HEADER_OFFSET = -96;

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

function scrollToHash(immediate = true): boolean {
  const hash = window.location.hash;
  if (!hash || hash === "#") return false;

  const id = decodeURIComponent(hash.slice(1));
  const el = document.getElementById(id);
  if (!el || !lenis) return false;

  lenis.scrollTo(el, { offset: HEADER_OFFSET, immediate });
  return true;
}

function scrollToTop(immediate = true) {
  if (scrollToHash(immediate)) return;

  lenis?.scrollTo(0, { immediate });
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function isModifiedClick(e: MouseEvent): boolean {
  return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
}

/**
 * Intercepta anclas del mismo sitio antes que ClientRouter.
 * Evita la barra de carga y el “segundo clic” en /#updates, /#apis, etc.
 */
function onNavClick(e: MouseEvent) {
  if (isModifiedClick(e)) return;

  const anchor = (e.target as Element | null)?.closest?.("a[href]");
  if (!(anchor instanceof HTMLAnchorElement)) return;
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("http") || href.startsWith("mailto:")) return;

  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return;
  }

  if (url.origin !== window.location.origin) return;

  const onHome =
    window.location.pathname === "/" || window.location.pathname === "";
  const targetHome = url.pathname === "/" || url.pathname === "";

  // Ya en home + ancla → solo scroll (sin transición de página)
  if (onHome && targetHome && url.hash) {
    const id = decodeURIComponent(url.hash.slice(1));
    const el = document.getElementById(id);
    if (!el) return;

    e.preventDefault();
    e.stopPropagation();
    history.pushState(null, "", url.hash);
    lenis?.scrollTo(el, { offset: HEADER_OFFSET, immediate: false });
    return;
  }

  // Ya en home + Inicio (/) → subir arriba sin recargar
  if (onHome && targetHome && !url.hash) {
    e.preventDefault();
    e.stopPropagation();
    history.pushState(null, "", "/");
    lenis?.scrollTo(0, { immediate: false });
  }
}

// Inicializar en la carga principal
initLenis();
scrollToTop(true);
document.addEventListener("click", onNavClick, true);

// Re-inicializar con View Transitions
document.addEventListener("astro:page-load", () => {
  initLenis();
  // Esperar un frame: el DOM de la nueva página ya está montado
  requestAnimationFrame(() => {
    scrollToTop(true);
    // Segundo intento por si el hash apunta a contenido que pinta tarde
    if (window.location.hash) {
      requestAnimationFrame(() => scrollToHash(true));
    }
  });
});
