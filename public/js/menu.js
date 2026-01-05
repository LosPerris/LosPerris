const setupMobileMenu = () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const body = document.querySelector("body");
    const navLinks = document.querySelectorAll(".nav-link");
    const dropdownItems = document.querySelectorAll(".dropdown-item");
    const dropdowns = document.querySelectorAll(".dropdown");

    if (!hamburger || !navMenu || !body) return;

    if (hamburger.hasAttribute("data-has-listener")) return;
    hamburger.setAttribute("data-has-listener", "true");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("translate-x-full");
        navMenu.classList.toggle("translate-x-0");

        const bars = hamburger.querySelectorAll(".bar");
        if (hamburger.classList.contains("active")) {
            bars[0].classList.add("rotate-45", "translate-y-2");
            bars[1].classList.add("opacity-0");
            bars[2].classList.add("-rotate-45", "-translate-y-2");
            body.style.overflow = "hidden";
        } else {
            bars[0].classList.remove("rotate-45", "translate-y-2");
            bars[1].classList.remove("opacity-0");
            bars[2].classList.remove("-rotate-45", "-translate-y-2");
            body.style.overflow = "";
        }
    });

    dropdowns.forEach((dropdown) => {
        const button = dropdown.querySelector("button");
        const content = dropdown.querySelector(".dropdown-content");
        const icon = dropdown.querySelector(".fa-chevron-down");

        if (button && content) {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();

                content.classList.toggle("hidden");
                content.classList.toggle("flex");
                if (icon) icon.classList.toggle("rotate-180");
            });
        }
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (!link.closest(".dropdown")) {
                closeMenu();
            }
        });
    });

    dropdownItems.forEach((item) => {
        item.addEventListener("click", () => {
            closeMenu();
        });
    });

    function closeMenu() {
        hamburger?.classList.remove("active");
        navMenu?.classList.add("translate-x-full");
        navMenu?.classList.remove("translate-x-0");

        const bars = hamburger?.querySelectorAll(".bar");
        if (bars) {
            bars[0]?.classList.remove("rotate-45", "translate-y-2");
            bars[1]?.classList.remove("opacity-0");
            bars[2]?.classList.remove("-rotate-45", "-translate-y-2");
        }
        body.style.overflow = "";
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMobileMenu);
} else {
    setupMobileMenu();
}
document.addEventListener("astro:page-load", setupMobileMenu);
