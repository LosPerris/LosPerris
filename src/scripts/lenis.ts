import Lenis from "lenis";

let lenis: Lenis | null = null;
let rafId = 0;
let listenersBound = false;

/** Compensa el header fijo (h-16) */
const HEADER_OFFSET = -96;

function initLenis() {
  if (lenis) {
    lenis.destroy();
    cancelAnimationFrame(rafId);
  }

  lenis = new Lenis();

  const raf = (time: number) => {
    lenis?.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);
}

/** Scroll a un elemento por id (hash) o a Y=0. Una sola API para todo el sitio. */
export function scrollPageTo(
  target: number | string | HTMLElement,
  options: { immediate?: boolean } = {},
): boolean {
  const immediate = options.immediate ?? false;

  if (!lenis) {
    if (typeof target === "number") {
      window.scrollTo(0, target);
      return true;
    }
    const el =
      typeof target === "string" ? document.getElementById(target) : target;
    el?.scrollIntoView();
    return !!el;
  }

  if (typeof target === "number") {
    lenis.scrollTo(target, { immediate });
    return true;
  }

  const el =
    typeof target === "string" ? document.getElementById(target) : target;
  if (!el) return false;

  lenis.scrollTo(el, { offset: HEADER_OFFSET, immediate });
  return true;
}

/** Arriba del todo, o a la ancla de la URL si existe (#actualizaciones, #apis, …). */
export function scrollPageToTop(immediate = true) {
  const hash = window.location.hash;
  if (hash && hash !== "#") {
    const id = decodeURIComponent(hash.slice(1));
    if (scrollPageTo(id, { immediate })) return;
  }
  scrollPageTo(0, { immediate });
}

function isModifiedClick(e: MouseEvent): boolean {
  return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
}

/**
 * Anclas en la home: scroll con Lenis, sin View Transitions ni segundo clic.
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
  if (!onHome || !targetHome) return;

  if (url.hash) {
    const id = decodeURIComponent(url.hash.slice(1));
    if (!document.getElementById(id)) return;

    e.preventDefault();
    e.stopPropagation();
    history.pushState(null, "", url.hash);
    scrollPageTo(id, { immediate: false });
    return;
  }

  e.preventDefault();
  e.stopPropagation();
  history.pushState(null, "", "/");
  scrollPageTo(0, { immediate: false });
}

function onPageLoad() {
  initLenis();
  // Un frame: el DOM de la nueva página ya está listo (View Transitions)
  requestAnimationFrame(() => scrollPageToTop(true));
}

function bindListeners() {
  if (listenersBound) return;
  listenersBound = true;
  document.addEventListener("click", onNavClick, true);
  document.addEventListener("astro:page-load", onPageLoad);
}

bindListeners();
onPageLoad();
