document.addEventListener('astro:page-load', () => {
    const contentArea = document.getElementById("content-area");

    const elements = {
        badge: document.getElementById("guide-badge"),
        time: document.getElementById("guide-time"),
        title: document.getElementById("guide-title"),
        desc: document.getElementById("guide-desc"),
        body: document.getElementById("guide-body"),
    };

    window.switchGuide = (id) => {
        if (!window.GUIDES_DATA) {
            console.error("Guides data not loaded");
            return;
        }

        const guide = window.GUIDES_DATA.find((g) => g.id === id);
        if (!guide || !contentArea) return;

        contentArea.style.opacity = "0";
        contentArea.style.transform = "translateY(10px)";
        contentArea.style.transition = "all 0.3s ease-out";

        setTimeout(() => {
            if (elements.badge) {
                elements.badge.className = `${guide.difficultyColor} ${guide.difficultyTextColor} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide`;
                elements.badge.textContent = guide.difficulty;
            }
            if (elements.time) elements.time.textContent = guide.time;
            if (elements.title) elements.title.textContent = guide.contentTitle;
            if (elements.desc) elements.desc.textContent = guide.description;

            if (elements.body) {
                elements.body.innerHTML = renderGuideSections(guide.sections);
            }

            contentArea.style.opacity = "1";
            contentArea.style.transform = "translateY(0)";
        }, 300);

        document.querySelectorAll(".guide-btn").forEach((btn) => {
            if (btn.dataset.id === id) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        const sidebar = document.getElementById("sidebar-nav");
        if (window.innerWidth < 1024 && sidebar) {
            sidebar.classList.add("hidden");
        }
    };
});

function renderGuideSections(sections) {
    if (!sections) return "";
    return sections.map(section => `
        <div class="section-block">
            <h3 class="text-2xl font-bold text-white mb-5 flex items-center gap-3 border-b border-[#2A2A2A] pb-3">
                <span class="text-3xl">${section.icon || ""}</span> ${section.title}
            </h3>
            
            ${section.content ? `<div class="mb-6 text-gray-300 leading-relaxed">${section.content}</div>` : ""}
            
            ${section.commands ? `
                <div class="grid gap-4">
                    ${section.commands.map(cmd => `
                        <div class="group bg-[#151515] hover:bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#404040] rounded-xl p-4 transition-all duration-300">
                            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div class="shrink-0">
                                    <code class="px-3 py-1.5 rounded-lg bg-[#202020] text-[#5865F2] font-mono text-sm font-bold border border-[#303030] shadow-sm group-hover:shadow-[0_0_10px_rgba(88,101,242,0.15)] transition-shadow">
                                        ${cmd.name}
                                    </code>
                                </div>
                                <div class="flex items-center gap-3 text-gray-400 group-hover:text-gray-200 transition-colors">
                                    ${cmd.emoji ? `<span class="text-lg">${cmd.emoji}</span>` : ""}
                                    <span class="text-sm sm:text-base font-medium">${cmd.description}</span>
                                </div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            ` : ""}
        </div>
    `).join("");
}
