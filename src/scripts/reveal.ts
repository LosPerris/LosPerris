function initReveal() {
  const sections = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
  );

  sections.forEach((el) => {
    el.classList.add("reveal-hidden");
    observer.observe(el);
  });
}

document.addEventListener("astro:page-load", initReveal);
