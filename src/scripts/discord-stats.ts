export {};

interface DiscordInviteResponse {
  approximate_member_count?: number;
  approximate_presence_count?: number;
}

function formatCount(n: number): string {
  return n > 1000 ? `${(n / 1000).toFixed(1)}k+` : n.toString();
}

function fillStats(root: ParentNode, members?: number, online?: number): void {
  if (members != null) {
    const formatted = formatCount(members);
    root.querySelectorAll("[data-stat='members']").forEach((el) => {
      el.textContent = formatted;
    });
  }
  if (online != null) {
    const formatted = formatCount(online);
    root.querySelectorAll("[data-stat='online']").forEach((el) => {
      el.textContent = formatted;
    });
  }
}

const setupDiscordStats = (): void => {
  const hero = document.querySelector<HTMLElement>("section[data-invite-code]");
  const staticZone = document.querySelector<HTMLElement>(
    "[data-discord-stats]",
  );
  if (!hero && !staticZone) return;

  const code =
    hero?.dataset.inviteCode || staticZone?.dataset.inviteCode || "PJbExZe7Tp";

  if (document.body.hasAttribute("data-discord-stats-loaded")) return;

  fetch(`https://discord.com/api/v9/invites/${code}?with_counts=true`)
    .then((res) => {
      if (!res.ok) throw new Error(`Discord API ${res.status}`);
      return res.json();
    })
    .then((data: DiscordInviteResponse) => {
      fillStats(
        document,
        data.approximate_member_count,
        data.approximate_presence_count,
      );

      document.body.setAttribute("data-discord-stats-loaded", "true");
    })
    .catch((e: Error) => console.error("Error fetching Discord stats:", e));
};

document.addEventListener("astro:page-load", setupDiscordStats);
