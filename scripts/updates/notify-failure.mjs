#!/usr/bin/env node
/** Notifica fallo del sync de novedades (Discord webhook opcional). */
const webhook =
  process.env.UPDATES_ALERT_WEBHOOK ||
  process.env.DISCORD_WEBHOOK_URL ||
  "";

const reason = process.argv.slice(2).join(" ") || "El job sync-github-updates falló.";

async function main() {
  if (!webhook) {
    console.warn("[notify-sync] Sin UPDATES_ALERT_WEBHOOK; omitiendo Discord.");
    return;
  }

  const body = {
    content: `⚠️ **LosPerris — sync de novedades**\n${reason}\nRevisa: Actions → Sincronizar novedades desde repos privados`,
  };

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Discord webhook ${res.status}: ${text.slice(0, 120)}`);
  }
}

main().catch((err) => {
  console.error("[notify-sync]", err.message || err);
  process.exit(1);
});
