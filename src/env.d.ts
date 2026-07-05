/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly GITHUB_TOKEN?: string;
  readonly SKIP_GITHUB_UPDATES?: string;
  readonly UPDATES_ADMIN_SECRET?: string;
  readonly UPDATES_ADMIN_GITHUB_TOKEN?: string;
  readonly UPDATE_SYNC_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
