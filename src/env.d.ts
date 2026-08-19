interface ImportMetaEnv {
  readonly GITHUB_TOKEN?: string;
  readonly SKIP_GITHUB_UPDATES?: string;
  readonly UPDATE_SYNC_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
