/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly GITHUB_TOKEN?: string;
  readonly GITHUB_UPDATES_TOKEN?: string;
  readonly SKIP_GITHUB_UPDATES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
