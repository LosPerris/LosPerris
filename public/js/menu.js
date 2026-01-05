const setupMobileMenu = () => {
    const hamburger = document.getElementById("mobile-menu-btn");
    const navMenu = document.getElementById("mobile-menu");
    const body = document.querySelector("body");

    const hamburgerEl = hamburger || document.querySelector(".hamburger");
    const navMenuEl = navMenu || document.querySelector(".nav-menu");

    if (!hamburgerEl || !navMenuEl || !body) {
        console.warn("Mobile menu elements not found");
        return;
    }

    if (hamburgerEl.hasAttribute("data-has-listener")) return;
    hamburgerEl.setAttribute("data-has-listener", "true");

    hamburgerEl.addEventListener("click", () => {
        hamburgerEl.classList.toggle("active");
        navMenuEl.classList.toggle("translate-x-full");
        navMenuEl.classList.toggle("translate-x-0");

        if (navMenuEl.classList.contains("translate-x-0")) {
            navMenuEl.style.visibility = "visible";
            body.style.overflow = "hidden";
        } else {
            setTimeout(() => {
                if (navMenuEl.classList.contains("translate-x-full")) {
                    navMenuEl.style.visibility = "hidden";
                }
            }, 300);
            body.style.overflow = "";
        }

        const bars = hamburgerEl.querySelectorAll(".bar");
        if (hamburgerEl.classList.contains("active")) {
            bars[0].classList.add("rotate-45", "translate-y-2");
            bars[1].classList.add("opacity-0");
            bars[2].classList.add("-rotate-45", "-translate-y-2");
        } else {
            bars[0].classList.remove("rotate-45", "translate-y-2");
            bars[1].classList.remove("opacity-0");
            bars[2].classList.remove("-rotate-45", "-translate-y-2");
        }
    });

    const dropdowns = document.querySelectorAll(".dropdown");
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

    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (!link.closest(".dropdown")) {
                closeMenu(hamburgerEl, navMenuEl, body);
            }
        });
    });
};

function closeMenu(hamburger, navMenu, body) {
    if (!hamburger || !navMenu) return;

    hamburger.classList.remove("active");
    navMenu.classList.add("translate-x-full");
    navMenu.classList.remove("translate-x-0");
    navMenu.style.visibility = "hidden";

    const bars = hamburger.querySelectorAll(".bar");
    if (bars && bars.length === 3) {
        bars[0].classList.remove("rotate-45", "translate-y-2");
        bars[1].classList.remove("opacity-0");
        bars[2].classList.remove("-rotate-45", "-translate-y-2");
    }
    body.style.overflow = "";
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMobileMenu);
} else {
    setupMobileMenu();
}

document.addEventListener("astro:page-load", setupMobileMenu);
