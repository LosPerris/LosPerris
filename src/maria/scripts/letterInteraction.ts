// Interactive Cover & Sequential Typing Effect (3D Book Opening)
export function initLetterInteraction() {
  const wrapper = document.getElementById("book-wrapper");
  const cover = document.getElementById("diary-cover");
  const content = document.getElementById("diary-content");
  const cursor = document.getElementById("typing-cursor");
  const strap = document.getElementById("snap-strap");

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

  if (cover && content && wrapper && strap) {
    strap.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent bubbling

      // Slide the entire book container to the center
      wrapper.classList.remove("-translate-x-1/4");
      wrapper.classList.add("translate-x-0");

      // 3D book open effect
      cover.style.transform = "perspective(1200px) rotateY(-110deg)";
      cover.style.opacity = "0";
      cover.style.pointerEvents = "none";
      content.classList.remove("pointer-events-none");

      // Auto-scale text based on actual physical dimensions to guarantee it fits!
      const msgContainer = document.getElementById("message-container");
      const msgWrapper = document.getElementById("message-wrapper");
      if (msgText && msgContainer && msgWrapper) {
        const fullText = msgText.getAttribute("data-text") || "";
        msgText.textContent = fullText; // temporarily fill

        let currentSize = 28;
        msgText.style.fontSize = currentSize + "px";

        // Shrink until wrapper fits inside container, checking both height and width, with a minimum size of 14px
        while (
          (msgWrapper.scrollHeight > msgContainer.clientHeight ||
            msgWrapper.scrollWidth > msgContainer.clientWidth) &&
          currentSize > 14
        ) {
          currentSize -= 1;
          msgText.style.fontSize = currentSize + "px";
        }

        msgText.textContent = ""; // clear for typing effect
      }

      // Show content and position cursor
      content.style.opacity = "1";
      if (cursor) cursor.style.opacity = "1";

      // Instantly reveal the day stamp box
      if (leftDayBox) leftDayBox.classList.remove("opacity-0");

      // Add stamps after cover opens (1500ms)
      setTimeout(() => {
        document.querySelectorAll(".stamp-element").forEach((el) => {
          el.classList.add("animate-stamp");
        });
      }, 1500);

      // Start typing sequence for handwritten text after stamps finish (4000ms total)
      setTimeout(() => {
        // 1. Main Message (Right Page)
        typeElement(msgText, 25, 45, () => {
          setTimeout(() => {
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
    });
  }

  const turnPageBtn = document.getElementById("turn-page-btn");
  const pageTurner = document.getElementById("page-turner");
  const reasonTexts = document.querySelectorAll(".reason-text");
  const reasonNumbers = document.querySelectorAll(".reason-number");
  const reasonsTitle = document.getElementById("reasons-title");
  const reasonsTitleLine = document.getElementById("reasons-title-line");

  // Clear reason texts on load so they don't appear before typing
  reasonTexts.forEach((el) => (el.textContent = ""));
  reasonNumbers.forEach((el) => (el.textContent = ""));
  if (reasonsTitle) reasonsTitle.textContent = "";

  let reasonsTyped = false;

  if (turnPageBtn && pageTurner) {
    turnPageBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      turnPageBtn.classList.add("opacity-0", "pointer-events-none");

      // Rotate the page
      pageTurner.style.transform = "rotateY(-180deg)";

      if (!reasonsTyped) {
        reasonsTyped = true;
        // Start typing the reasons sequentially after the animation completes (1500ms)
        setTimeout(() => {
          // 1. First type the title
          typeElement(reasonsTitle, 30, 50, () => {
            if (reasonsTitleLine)
              reasonsTitleLine.classList.remove("opacity-0");

            // 2. Then start the loop for reasons
            setTimeout(() => {
              let index = 0;
              function typeNextReason() {
                if (index < reasonTexts.length) {
                  const numEl = reasonNumbers[index] as HTMLElement;
                  const textEl = reasonTexts[index] as HTMLElement;

                  // First type the number
                  typeElement(numEl, 30, 40, () => {
                    // Then type the reason text
                    typeElement(textEl, 15, 20, () => {
                      index++;
                      // Short pause before the next reason starts typing
                      setTimeout(typeNextReason, 300);
                    });
                  });
                }
              }
              typeNextReason();
            }, 500); // Wait half a second after title
          });
        }, 1500);
      }
    });
  }

  const turnBackBtn = document.getElementById("turn-back-btn");
  if (turnBackBtn && pageTurner) {
    turnBackBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      // Rotate the page back to the front
      pageTurner.style.transform = "rotateY(0deg)";

      // Show the folded corner again after animation
      if (turnPageBtn) {
        setTimeout(() => {
          turnPageBtn.style.opacity = "1";
          turnPageBtn.style.pointerEvents = "auto";
        }, 1500);
      }
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
