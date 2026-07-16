// Interactive Cover & Sequential Typing Effect (3D Book Opening)
export function initLetterInteraction() {
  let isBookOpen = false;
  let stampTimeoutId: any = null;
  let textTimeoutId: any = null;
  let signatureTimeoutId: any = null;

  const wrapper = document.getElementById("book-wrapper");
  const cover = document.getElementById("diary-cover");
  const content = document.getElementById("diary-content");
  const cursor = document.getElementById("typing-cursor");
  const strap = document.getElementById("snap-strap");
  const closeStrap = document.getElementById("close-strap");

  // Elements to type
  const leftTitle = document.getElementById("left-title");
  const leftDate = document.getElementById("left-date");
  const leftDayBox = document.getElementById("left-day-box");
  const leftDay = document.getElementById("left-day");
  const msgText = document.getElementById("daily-message-text");
  const rightSignature = document.getElementById("right-signature");
  const rightSignatureLine = document.getElementById("right-signature-line");

  // Helper to type an element's data-text
  function typeElement(
    el: HTMLElement | null,
    speed: number = 30,
    variance: number = 50,
    callback?: () => void,
  ) {
    if (!el || !document.body.contains(el)) {
      if (callback) callback();
      return;
    }
    const text = el.getAttribute("data-text") || "";
    el.textContent = "";
    let i = 0;
    function type() {
      if (!isBookOpen) return; // Abort typing if book was closed
      if (i < text.length) {
        el!.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed + Math.random() * variance);
      } else {
        if (callback) callback();
      }
    }
    type();
  }

  // Set stamp texts immediately (No typing effect for stamps)
  [leftTitle, leftDate, leftDay].forEach((el) => {
    if (el) el.textContent = el.getAttribute("data-text") || "";
  });

  // Clear handwritten text on load for typing effect
  [msgText, rightSignature].forEach((el) => {
    if (el) el.textContent = "";
  });

  const stage = document.getElementById("maria-diary-stage");

  if (cover && content && wrapper && strap) {
    const openBook = () => {
      if (isBookOpen) return;
      isBookOpen = true;
      stage?.classList.add("is-open");

      // Slide the entire book container to the center
      wrapper.classList.remove("-translate-x-1/4", "-translate-x-[18%]");
      wrapper.classList.add("translate-x-0");

      // 3D book open effect
      cover.style.transform = "perspective(1200px) rotateY(-110deg)";
      cover.style.opacity = "0";
      cover.style.pointerEvents = "none";
      content.classList.remove("invisible");
      content.classList.remove("pointer-events-none");

      // Auto-scale text based on actual physical dimensions to guarantee it fits!
      const msgContainer = document.getElementById("message-container");
      const msgWrapper = document.getElementById("message-wrapper");
      if (msgText && msgContainer && msgWrapper) {
        const fullText = msgText.getAttribute("data-text") || "";
        msgText.textContent = fullText; // temporarily fill

        const isMobile = window.innerWidth < 768;
        // Esperar un frame para que .is-open aplique el nuevo tamaño
        requestAnimationFrame(() => {
          let currentSize = isMobile ? 18 : 28;
          const minSize = isMobile ? 12 : 14;
          msgText.style.fontSize = currentSize + "px";

          while (
            (msgWrapper.scrollHeight > msgContainer.clientHeight ||
              msgWrapper.scrollWidth > msgContainer.clientWidth) &&
            currentSize > minSize
          ) {
            currentSize -= 0.5;
            msgText.style.fontSize = currentSize + "px";
          }

          msgText.textContent = "";
        });
      } else if (msgText) {
        msgText.textContent = "";
      }

      // Show content and position cursor
      content.style.opacity = "1";
      if (cursor) cursor.style.opacity = "1";

      // Instantly reveal the day stamp box
      if (leftDayBox) leftDayBox.classList.remove("opacity-0");

      // Add stamps after cover opens (1500ms)
      stampTimeoutId = setTimeout(() => {
        document.querySelectorAll(".stamp-element").forEach((el) => {
          el.classList.add("animate-stamp");
        });
      }, 1500);

      // Start typing sequence for handwritten text after stamps finish (4000ms total)
      textTimeoutId = setTimeout(() => {
        // 1. Main Message (Right Page)
        typeElement(msgText, 25, 45, () => {
          signatureTimeoutId = setTimeout(() => {
            // 2. Signature
            typeElement(rightSignature, 40, 60, () => {
              if (rightSignatureLine)
                rightSignatureLine.classList.remove("opacity-0");
              if (cursor) cursor.style.display = "none";

              const turnPageBtn = document.getElementById("turn-page-btn");
              if (turnPageBtn) {
                turnPageBtn.classList.remove(
                  "opacity-0",
                  "pointer-events-none",
                );
              }
            });
          }, 500);
        });
      }, 4000);
    };

    strap.addEventListener("click", (e) => {
      e.stopPropagation();
      openBook();
    });

    // Móvil: tocar la portada también abre (el strap es chico)
    cover.addEventListener("click", (e) => {
      if (isBookOpen) return;
      if ((e.target as HTMLElement).closest("#snap-strap")) return;
      openBook();
    });
  }

  if (cover && content && wrapper && closeStrap) {
    closeStrap.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!isBookOpen) return;
      isBookOpen = false;
      stage?.classList.remove("is-open");

      // Cancel any ongoing timeouts
      clearTimeout(stampTimeoutId);
      clearTimeout(textTimeoutId);
      clearTimeout(signatureTimeoutId);

      // Reset DOM elements so reopening is clean
      document.querySelectorAll(".stamp-element").forEach((el) => {
        el.classList.remove("animate-stamp");
      });
      if (msgText) msgText.textContent = "";
      if (rightSignature) rightSignature.textContent = "";
      if (leftDayBox) leftDayBox.classList.add("opacity-0");
      if (rightSignatureLine) rightSignatureLine.classList.add("opacity-0");
      if (cursor) {
        cursor.style.display = "inline-block";
        cursor.style.opacity = "0";
      }

      const turnPageBtnEl = document.getElementById("turn-page-btn");
      if (turnPageBtnEl) {
        turnPageBtnEl.classList.add("opacity-0", "pointer-events-none");
      }

      const pageTurnerEl = document.getElementById("page-turner");
      const mobilePanel = document.getElementById("mobile-reasons-panel");
      if (mobilePanel) {
        mobilePanel.classList.remove("is-open");
        mobilePanel.setAttribute("aria-hidden", "true");
      }
      if (pageTurnerEl) {
        pageTurnerEl.style.opacity = "1";
        pageTurnerEl.style.pointerEvents = "auto";
        pageTurnerEl.style.transition = "";
        pageTurnerEl.style.transform = "rotateY(0deg)";
      }

      // Reverse 3D book open effect
      cover.style.transform = "perspective(1200px) rotateY(0deg)";
      cover.style.opacity = "1";
      cover.style.pointerEvents = "auto";
      content.classList.add("pointer-events-none");
      content.classList.add("invisible");
      content.style.opacity = "0"; // fade out content

      // Slide the entire book container back
      wrapper.classList.remove("translate-x-0");
      wrapper.classList.add(
        window.innerWidth < 768 ? "-translate-x-[18%]" : "-translate-x-1/4",
      );
    });
  }

  const turnPageBtn = document.getElementById("turn-page-btn");
  const pageTurner = document.getElementById("page-turner");
  const reasonTexts = document.querySelectorAll(".reason-text");
  const reasonNumbers = document.querySelectorAll(".reason-number");
  const reasonsTitle = document.getElementById("reasons-title");
  const reasonsTitleLine = document.getElementById("reasons-title-line");
  const mobileReasonsPanel = document.getElementById("mobile-reasons-panel");
  const mobileReasonsBack = document.getElementById("mobile-reasons-back");

  const isMobileViewport = () => window.innerWidth < 768;

  function showMobileReasonsPanel() {
    if (!mobileReasonsPanel || !isMobileViewport()) return;
    mobileReasonsPanel.classList.add("is-open");
    mobileReasonsPanel.setAttribute("aria-hidden", "false");
    const scroll = document.getElementById("mobile-reasons-scroll");
    if (scroll) scroll.scrollTop = 0;
  }

  function hideMobileReasonsPanel() {
    if (!mobileReasonsPanel) return;
    mobileReasonsPanel.classList.remove("is-open");
    mobileReasonsPanel.setAttribute("aria-hidden", "true");
  }

  // Clear reason texts on load so they don't appear before typing
  reasonTexts.forEach((el) => (el.textContent = ""));
  reasonNumbers.forEach((el) => (el.textContent = ""));
  if (reasonsTitle) reasonsTitle.textContent = "";

  /** Reduce tipografía de razones hasta que quepan (desktop / tablets). */
  function fitReasonsToPages() {
    if (isMobileViewport()) return; // móvil usa panel plano

    const lists = [
      document.getElementById("reasons-left-list"),
      document.getElementById("reasons-right-list"),
    ].filter(Boolean) as HTMLElement[];

    if (!lists.length) return;

    reasonTexts.forEach((el) => {
      const node = el as HTMLElement;
      node.textContent = node.getAttribute("data-text") || "";
    });
    reasonNumbers.forEach((el) => {
      const node = el as HTMLElement;
      node.textContent = node.getAttribute("data-text") || "";
    });
    if (reasonsTitle) {
      reasonsTitle.textContent = reasonsTitle.getAttribute("data-text") || "";
    }

    let size = 20;
    const minSize = 14;

    const applySize = (px: number) => {
      reasonTexts.forEach((el) => {
        (el as HTMLElement).style.fontSize = `${px}px`;
        (el as HTMLElement).style.lineHeight = "1.12";
      });
      reasonNumbers.forEach((el) => {
        (el as HTMLElement).style.fontSize = `${px}px`;
      });
    };

    applySize(size);
    while (
      size > minSize &&
      lists.some((list) => list.scrollHeight > list.clientHeight + 1)
    ) {
      size -= 0.5;
      applySize(size);
    }

    reasonTexts.forEach((el) => (el.textContent = ""));
    reasonNumbers.forEach((el) => (el.textContent = ""));
    if (reasonsTitle) reasonsTitle.textContent = "";
  }

  let reasonsTyped = false;

  if (turnPageBtn && pageTurner) {
    turnPageBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      turnPageBtn.classList.add("opacity-0", "pointer-events-none");

      if (isMobileViewport()) {
        // Safari/iOS: evitar leer texto dentro de rotateY (se corta).
        // Animación corta + panel plano scrolleable.
        pageTurner.style.transition = "opacity 400ms ease";
        pageTurner.style.opacity = "0";
        pageTurner.style.pointerEvents = "none";
        setTimeout(() => {
          showMobileReasonsPanel();
        }, 280);
        reasonsTyped = true;
        return;
      }

      // Desktop: flip 3D clásico
      pageTurner.style.transform = "rotateY(-180deg)";

      if (!reasonsTyped) {
        reasonsTyped = true;
        setTimeout(() => {
          fitReasonsToPages();

          typeElement(reasonsTitle, 30, 50, () => {
            if (reasonsTitleLine)
              reasonsTitleLine.classList.remove("opacity-0");

            setTimeout(() => {
              let index = 0;
              function typeNextReason() {
                if (index < reasonTexts.length) {
                  const numEl = reasonNumbers[index] as HTMLElement;
                  const textEl = reasonTexts[index] as HTMLElement;

                  typeElement(numEl, 30, 40, () => {
                    typeElement(textEl, 15, 20, () => {
                      index++;
                      setTimeout(typeNextReason, 300);
                    });
                  });
                }
              }
              typeNextReason();
            }, 500);
          });
        }, 1500);
      }
    });
  }

  const turnBackBtn = document.getElementById("turn-back-btn");
  function turnPageBack() {
    hideMobileReasonsPanel();

    if (pageTurner) {
      pageTurner.style.opacity = "1";
      pageTurner.style.pointerEvents = "auto";
      pageTurner.style.transition = "";
      pageTurner.style.transform = "rotateY(0deg)";
    }

    if (turnPageBtn) {
      setTimeout(
        () => {
          turnPageBtn.style.opacity = "1";
          turnPageBtn.style.pointerEvents = "auto";
          turnPageBtn.classList.remove("opacity-0", "pointer-events-none");
        },
        isMobileViewport() ? 200 : 1500,
      );
    }
  }

  if (turnBackBtn && pageTurner) {
    turnBackBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      turnPageBack();
    });
  }

  if (mobileReasonsBack) {
    mobileReasonsBack.addEventListener("click", (e) => {
      e.stopPropagation();
      turnPageBack();
    });
  }

  // Scroll reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("opacity-0", "translate-y-10");
          entry.target.classList.add("opacity-100", "translate-y-0");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  document
    .querySelectorAll("#reasons-section, #promise-section")
    .forEach((el) => {
      observer.observe(el);
    });
}

// Inicializar cuando el DOM esté listo o en Astro page load
initLetterInteraction();
