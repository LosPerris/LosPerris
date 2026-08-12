const TRIGGER_RATIO = 0.65;
const RESIZE_DEBOUNCE_MS = 150;
const DESKTOP_MIN = 768;

interface BridgeEntry {
  y1Doc: number;
  y2Doc: number;
  length: number;
  path: SVGPathElement;
}

interface BridgeSpec {
  d: string;
  y1Doc: number;
  y2Doc: number;
  maxY: number;
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
let layoutRafId: number | null = null;
let cachedBridgeKey = "";

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

function bridgePathD(x1: number, y1: number, x2: number, y2: number): string {
  const dy = y2 - y1;
  const lead = Math.min(72, Math.max(20, Math.abs(dy) * 0.22));
  const y1e = y1 + lead;
  const y2e = y2 - lead;
  const mid = (y1e + y2e) / 2;

  return `M ${x1} ${y1} L ${x1} ${y1e} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2e} L ${x2} ${y2}`;
}

function collectBridgeSpecs(): BridgeSpec[] {
  if (!zone) return [];

  const specs: BridgeSpec[] = [];
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

      const d = bridgePathD(x1, y1, top.x, top.y);
      specs.push({ d, y1Doc, y2Doc: top.yDoc, maxY: Math.max(y1, top.y) });
    }
  }

  for (let i = 0; i < lines.length - 1; i++) {
    const bottom = connectorPoint(lines[i], zone, "bottom");
    const top = connectorPoint(lines[i + 1], zone, "top");
    if (!bottom || !top) continue;

    const d = bridgePathD(bottom.x, bottom.y, top.x, top.y);
    specs.push({
      d,
      y1Doc: bottom.yDoc,
      y2Doc: top.yDoc,
      maxY: Math.max(bottom.y, top.y),
    });
  }

  return specs;
}

function bridgeGeometryKey(): string {
  if (!zone || window.innerWidth < DESKTOP_MIN) return "";

  const parts: string[] = [];
  const source = zone.querySelector<HTMLElement>(
    "[data-timeline-bridge-source]",
  );

  if (source && lines.length > 0) {
    const top = connectorPoint(lines[0], zone, "top");
    const s = source.getBoundingClientRect();
    if (top) {
      parts.push(
        `s:${Math.round(s.left)}:${Math.round(s.bottom)}:${Math.round(top.x)}:${Math.round(top.y)}`,
      );
    }
  }

  for (let i = 0; i < lines.length - 1; i++) {
    const bottom = connectorPoint(lines[i], zone, "bottom");
    const top = connectorPoint(lines[i + 1], zone, "top");
    if (!bottom || !top) continue;
    parts.push(
      `${i}:${Math.round(bottom.x)}:${Math.round(bottom.y)}:${Math.round(top.x)}:${Math.round(top.y)}`,
    );
  }

  return parts.join("|");
}

function spineHeight(specs: BridgeSpec[]): number {
  if (!specs.length) return 0;
  return Math.ceil(Math.max(...specs.map((s) => s.maxY)) + 64);
}

function syncSvgSize(svg: SVGSVGElement, width: number, height: number): void {
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
}

function applyBridgeSpecs(group: Element, specs: BridgeSpec[]): void {
  const needed = specs.length * 2;
  const existing = group.children;

  if (existing.length === needed) {
    bridges = [];
    for (let i = 0; i < specs.length; i++) {
      const spec = specs[i];
      const bg = existing[i * 2] as SVGPathElement;
      const path = existing[i * 2 + 1] as SVGPathElement;
      bg.setAttribute("d", spec.d);
      path.setAttribute("d", spec.d);
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      bridges.push({ y1Doc: spec.y1Doc, y2Doc: spec.y2Doc, length, path });
    }
    return;
  }

  group.replaceChildren();
  bridges = [];

  for (const spec of specs) {
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    bg.setAttribute("d", spec.d);
    bg.setAttribute("stroke", "#27272a");
    bg.setAttribute("stroke-width", "2");
    bg.setAttribute("stroke-linecap", "round");
    bg.setAttribute("stroke-linejoin", "round");
    bg.setAttribute("fill", "none");
    group.appendChild(bg);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", spec.d);
    path.setAttribute("stroke", "url(#bridge-gradient)");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("fill", "none");
    group.appendChild(path);

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    bridges.push({ y1Doc: spec.y1Doc, y2Doc: spec.y2Doc, length, path });
  }
}

function drawBridges(): void {
  const group = document.getElementById("bridges-group");
  const svg = document.getElementById(
    "timeline-bridges-svg",
  ) as SVGSVGElement | null;
  const container = document.getElementById("timeline-bridges-container");

  if (
    !group ||
    !svg ||
    !zone ||
    !container ||
    window.innerWidth < DESKTOP_MIN
  ) {
    bridges = [];
    group?.replaceChildren();
    return;
  }

  const specs = collectBridgeSpecs();
  const width = zone.offsetWidth;
  const height = spineHeight(specs);

  container.style.height = `${height}px`;
  syncSvgSize(svg, width, height);
  applyBridgeSpecs(group, specs);
  updateBridges();
  cachedBridgeKey = bridgeGeometryKey();
}

/** La línea del FAQ solo cubre los summaries; las respuestas abiertas no la estiran. */
function syncFaqLineHeight(): void {
  if (!zone || window.innerWidth < DESKTOP_MIN) return;

  const faqLine = zone.querySelector<HTMLElement>("#faq [data-timeline-line]");
  const track = faqLine?.closest<HTMLElement>("[data-timeline-track]");
  if (!faqLine || !track) return;

  const faqItems = track.querySelectorAll<HTMLElement>("[data-timeline-item]");
  if (!faqItems.length) return;

  const trackRect = track.getBoundingClientRect();
  const firstNode =
    faqItems[0].querySelector<HTMLElement>(".timeline-node") ?? faqItems[0];
  const lastSummary =
    faqItems[faqItems.length - 1].querySelector<HTMLElement>("summary") ??
    faqItems[faqItems.length - 1];

  const top = firstNode.getBoundingClientRect().top - trackRect.top;
  const bottom = lastSummary.getBoundingClientRect().bottom - trackRect.top;

  faqLine.style.top = `${Math.max(0, top)}px`;
  faqLine.style.height = `${Math.max(1, bottom - top)}px`;
  faqLine.style.bottom = "auto";
}

function resetFaqLineStyles(): void {
  zone
    ?.querySelectorAll<HTMLElement>("#faq [data-timeline-line]")
    .forEach((line) => {
      line.style.top = "";
      line.style.height = "";
      line.style.bottom = "";
    });
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

function runLayoutSync(): void {
  cacheElements();

  if (window.innerWidth < DESKTOP_MIN) {
    document.getElementById("bridges-group")?.replaceChildren();
    bridges = [];
    cachedBridgeKey = "";
    resetFaqLineStyles();
    items.forEach((item) => item.classList.remove("is-lit"));
    return;
  }

  syncFaqLineHeight();

  const key = bridgeGeometryKey();
  if (key !== cachedBridgeKey) {
    drawBridges();
  } else {
    onScroll();
  }
}

function syncLayout(debounce: boolean): void {
  if (debounce) {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => runLayoutSync(), RESIZE_DEBOUNCE_MS);
    return;
  }

  if (layoutRafId !== null) return;
  layoutRafId = requestAnimationFrame(() => {
    layoutRafId = null;
    runLayoutSync();
  });
}

function bindFaqToggles(): void {
  if (!zone) return;

  zone
    .querySelectorAll<HTMLDetailsElement>("#faq details")
    .forEach((details) => {
      details.addEventListener("toggle", () => {
        requestAnimationFrame(() => onScroll());
      });
    });
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
  if (layoutRafId !== null) {
    cancelAnimationFrame(layoutRafId);
    layoutRafId = null;
  }
  zone = null;
  bridges = [];
  lines = [];
  items = [];
  cachedBridgeKey = "";
}

function redraw(): void {
  cacheElements();
  syncFaqLineHeight();
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

  resizeListener = () => syncLayout(true);
  window.addEventListener("resize", resizeListener, { passive: true });

  resizeObserver = new ResizeObserver(() => syncLayout(false));
  zone
    .querySelectorAll<HTMLElement>("[data-timeline-section]:not(#faq)")
    .forEach((el) => {
      resizeObserver!.observe(el);
    });

  bindFaqToggles();

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
