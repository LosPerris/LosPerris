interface ImportMetaEnv {
  readonly GITHUB_TOKEN?: string;
  readonly SKIP_GITHUB_UPDATES?: string;
  readonly UPDATE_SYNC_TOKEN?: string;
  readonly PUBLIC_BOT_HELP_CLIENT_ID?: string;
  readonly PUBLIC_BOT_GAME_CLIENT_ID?: string;
  readonly DISCORD_WEBHOOK_URL?: string;
  readonly UPDATES_ALERT_WEBHOOK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
