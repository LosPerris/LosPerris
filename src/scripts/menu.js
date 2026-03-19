document.addEventListener("astro:page-load", () => {
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const closeBtn = document.getElementById("close-menu");
  const menuLinks = mobileMenu?.querySelectorAll("a");

  if (!menuBtn || !mobileMenu) return;

  const toggleMenu = (show) => {
    if (show) {
      mobileMenu.classList.remove("translate-x-full");
      document.body.style.overflow = "hidden";
      menuBtn.setAttribute("aria-expanded", "true");
    } else {
      mobileMenu.classList.add("translate-x-full");
      document.body.style.overflow = "";
      menuBtn.setAttribute("aria-expanded", "false");
    }
  };

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu(true);
  });

  closeBtn?.addEventListener("click", () => toggleMenu(false));

  menuLinks?.forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  document.addEventListener("click", (e) => {
    if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
      toggleMenu(false);
    }
  });

  const mobileDropdowns = mobileMenu.querySelectorAll(".mobile-dropdown-btn");
  mobileDropdowns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const content = btn.nextElementSibling;
      const icon = btn.querySelector("i");

      content.classList.toggle("hidden");
      if (icon) icon.classList.toggle("rotate-180");
    });
  });
});
