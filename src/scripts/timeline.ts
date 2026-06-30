const TRIGGER_RATIO = 0.65;
const RESIZE_DEBOUNCE_MS = 150;
const DESKTOP_MIN = 768;

interface BridgeEntry {
  y1Doc: number;
  y2Doc: number;
  length: number;
  path: SVGPathElement;
}

interface ZonePoint {
  x: number;
  y: number;
  yDoc: number;
}

let rafId: number | null = null;
let resizeTimer: ReturnType<typeof setTimeout> | null = null;
let resizeObserver: ResizeObserver | null = null;
let zone: HTMLElement | null = null;
let bridges: BridgeEntry[] = [];
let lines: HTMLElement[] = [];
let items: HTMLElement[] = [];
let scrollListener: (() => void) | null = null;
let resizeListener: (() => void) | null = null;

function scrollTop(): number {
  return window.scrollY || document.documentElement.scrollTop;
}

function triggerY(): number {
  return window.innerHeight * TRIGGER_RATIO;
}

function getItemAnchorY(item: HTMLElement): number {
  const node = item.querySelector<HTMLElement>(".timeline-node");
  if (node && node.offsetParent !== null) {
    const rect = node.getBoundingClientRect();
    return rect.top + rect.height / 2;
  }
  const rect = item.getBoundingClientRect();
  return rect.top + rect.height * 0.4;
}

function updateItems(): void {
  if (window.innerWidth < DESKTOP_MIN) return;
  const y = triggerY();
  for (const item of items) {
    item.classList.toggle("is-lit", y >= getItemAnchorY(item));
  }
}

function updateLines(): void {
  if (window.innerWidth < DESKTOP_MIN) return;
  const y = triggerY();
  for (const line of lines) {
    const bar = line.querySelector<HTMLElement>(
      "[data-timeline-line-progress]",
    );
    if (!bar) continue;
    const { top, height } = line.getBoundingClientRect();
    if (height < 1) continue;
    const progress = Math.max(0, Math.min(1, (y - top) / height));
    bar.style.transform = `scaleY(${progress})`;
  }
}

function updateBridges(): void {
  if (!bridges.length || window.innerWidth < DESKTOP_MIN) return;
  const currentY = scrollTop() + triggerY();
  for (const bridge of bridges) {
    if (currentY <= bridge.y1Doc) {
      bridge.path.style.strokeDashoffset = `${bridge.length}`;
    } else if (currentY >= bridge.y2Doc) {
      bridge.path.style.strokeDashoffset = "0";
    } else {
      const t = (currentY - bridge.y1Doc) / (bridge.y2Doc - bridge.y1Doc);
      bridge.path.style.strokeDashoffset = `${bridge.length * (1 - t)}`;
    }
  }
}

function tick(): void {
  rafId = null;
  updateItems();
  updateLines();
  updateBridges();
}

function onScroll(): void {
  if (!zone || rafId !== null) return;
  rafId = requestAnimationFrame(tick);
}

/**
 * Punto de conexión: X de la línea, Y del borde del track (sin extensiones artificiales).
 */
function connectorPoint(
  line: HTMLElement,
  zoneEl: HTMLElement,
  edge: "top" | "bottom",
): ZonePoint | null {
  const track = line.closest<HTMLElement>("[data-timeline-track]");
  if (!track) return null;

  const zoneRect = zoneEl.getBoundingClientRect();
  const lineRect = line.getBoundingClientRect();
  const trackRect = track.getBoundingClientRect();
  const zoneTopDoc = zoneRect.top + scrollTop();

  const x = lineRect.left - zoneRect.left + lineRect.width / 2;
  const yDoc =
    edge === "top"
      ? trackRect.top + scrollTop()
      : trackRect.bottom + scrollTop();

  return { x, y: yDoc - zoneTopDoc, yDoc };
}

/** S-curve clásica: baja vertical, curva horizontal, sube vertical. */
function bridgePathD(x1: number, y1: number, x2: number, y2: number): string {
  const dy = y2 - y1;
  const lead = Math.min(72, Math.max(20, Math.abs(dy) * 0.22));
  const y1e = y1 + lead;
  const y2e = y2 - lead;
  const mid = (y1e + y2e) / 2;

  return `M ${x1} ${y1} L ${x1} ${y1e} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2e} L ${x2} ${y2}`;
}

function appendBridge(
  group: Element,
  d: string,
  y1Doc: number,
  y2Doc: number,
): BridgeEntry {
  const bg = document.createElementNS("http://www.w3.org/2000/svg", "path");
  bg.setAttribute("d", d);
  bg.setAttribute("stroke", "#27272a");
  bg.setAttribute("stroke-width", "2");
  bg.setAttribute("stroke-linecap", "round");
  bg.setAttribute("stroke-linejoin", "round");
  bg.setAttribute("fill", "none");
  group.appendChild(bg);

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  path.setAttribute("stroke", "url(#bridge-gradient)");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  path.setAttribute("fill", "none");
  group.appendChild(path);

  const length = path.getTotalLength();
  path.style.strokeDasharray = `${length}`;
  path.style.strokeDashoffset = `${length}`;

  return { y1Doc, y2Doc, length, path };
}

function syncSvgSize(svg: SVGSVGElement, zoneEl: HTMLElement): void {
  const w = zoneEl.offsetWidth;
  const h = zoneEl.offsetHeight;
  svg.setAttribute("width", String(w));
  svg.setAttribute("height", String(h));
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
}

function drawBridges(): void {
  const group = document.getElementById("bridges-group");
  const svg = document.getElementById(
    "timeline-bridges-svg",
  ) as SVGSVGElement | null;

  if (!group || !svg || !zone || window.innerWidth < DESKTOP_MIN) {
    bridges = [];
    group?.replaceChildren();
    return;
  }

  syncSvgSize(svg, zone);
  group.replaceChildren();
  bridges = [];

  const source = zone.querySelector<HTMLElement>(
    "[data-timeline-bridge-source]",
  );

  if (source && lines.length > 0) {
    const zoneRect = zone.getBoundingClientRect();
    const zoneTopDoc = zoneRect.top + scrollTop();
    const zoneLeft = zoneRect.left;
    const s = source.getBoundingClientRect();
    const top = connectorPoint(lines[0], zone, "top");

    if (top) {
      let x1 = s.left - zoneLeft + s.width / 2;
      let y1Doc = s.bottom + scrollTop();
      let y1 = y1Doc - zoneTopDoc;

      if (y1 < 0) {
        const t = (top.y - 0) / (top.y - y1);
        x1 = x1 + (top.x - x1) * t;
        y1Doc = zoneTopDoc;
        y1 = 0;
      }

      bridges.push(
        appendBridge(group, bridgePathD(x1, y1, top.x, top.y), y1Doc, top.yDoc),
      );
    }
  }

  for (let i = 0; i < lines.length - 1; i++) {
    const bottom = connectorPoint(lines[i], zone, "bottom");
    const top = connectorPoint(lines[i + 1], zone, "top");
    if (!bottom || !top) continue;

    bridges.push(
      appendBridge(
        group,
        bridgePathD(bottom.x, bottom.y, top.x, top.y),
        bottom.yDoc,
        top.yDoc,
      ),
    );
  }

  updateBridges();
}

function cacheElements(): void {
  if (!zone) return;
  lines = Array.from(
    zone.querySelectorAll<HTMLElement>("[data-timeline-line]"),
  );
  items = Array.from(
    zone.querySelectorAll<HTMLElement>("[data-timeline-item]"),
  );
}

function destroy(): void {
  if (scrollListener) {
    window.removeEventListener("scroll", scrollListener);
    scrollListener = null;
  }
  if (resizeListener) {
    window.removeEventListener("resize", resizeListener);
    resizeListener = null;
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (resizeTimer) {
    clearTimeout(resizeTimer);
    resizeTimer = null;
  }
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  zone = null;
  bridges = [];
  lines = [];
  items = [];
}

function scheduleRedraw(): void {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    cacheElements();
    if (window.innerWidth < DESKTOP_MIN) {
      document.getElementById("bridges-group")?.replaceChildren();
      bridges = [];
      items.forEach((item) => item.classList.remove("is-lit"));
      return;
    }
    drawBridges();
    onScroll();
  }, RESIZE_DEBOUNCE_MS);
}

function redraw(): void {
  cacheElements();
  drawBridges();
  onScroll();
}

function init(): void {
  const nextZone = document.querySelector<HTMLElement>("[data-timeline-zone]");
  if (!nextZone?.querySelector("[data-timeline-line]")) return;

  destroy();
  zone = nextZone;
  cacheElements();

  scrollListener = onScroll;
  window.addEventListener("scroll", scrollListener, { passive: true });

  resizeListener = scheduleRedraw;
  window.addEventListener("resize", resizeListener, { passive: true });

  resizeObserver = new ResizeObserver(scheduleRedraw);
  resizeObserver.observe(zone);
  zone
    .querySelectorAll("[data-timeline-section], [data-timeline-track]")
    .forEach((el) => {
      resizeObserver!.observe(el);
    });

  requestAnimationFrame(() => {
    requestAnimationFrame(redraw);
  });

  window.addEventListener("load", redraw, { once: true });
  document.fonts?.ready?.then(redraw);
}

document.addEventListener("astro:before-swap", destroy);
document.addEventListener("astro:page-load", init);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
