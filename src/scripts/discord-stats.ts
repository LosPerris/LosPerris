export {};

interface DiscordInviteResponse {
  approximate_member_count?: number;
  approximate_presence_count?: number;
}

const setupDiscordStats = (): void => {
  const section = document.querySelector<HTMLElement>(
    "section[data-invite-code]",
  );
  if (!section) return;

  if (section.hasAttribute("data-stats-loaded")) return;

  const code = section.dataset.inviteCode || "JKPUVf9aeU";

  fetch(`https://discord.com/api/v9/invites/${code}?with_counts=true`)
    .then((res) => res.json())
    .then((data: DiscordInviteResponse) => {
      if (data.approximate_member_count) {
        const members = data.approximate_member_count;
        const formattedMembers =
          members > 1000
            ? (members / 1000).toFixed(1) + "k+"
            : members.toString();
        const memberEl = document.getElementById("member-count");
        if (memberEl) memberEl.innerText = formattedMembers;
      }
      if (data.approximate_presence_count) {
        const online = data.approximate_presence_count;
        const formattedOnline =
          online > 1000 ? (online / 1000).toFixed(1) + "k+" : online.toString();
        const onlineEl = document.getElementById("online-count");
        if (onlineEl) onlineEl.innerText = formattedOnline;
      }
      section.setAttribute("data-stats-loaded", "true");
    })
    .catch((e: Error) => console.error("Error fetching Discord stats:", e));
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupDiscordStats);
} else {
  setupDiscordStats();
}

document.addEventListener("astro:page-load", setupDiscordStats);
