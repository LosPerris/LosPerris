/** Repos privados: los commits se sincronizan con GitHub Actions → github-updates-cache.json */
export interface UpdateRepoConfig {
  id: string;
  owner: string;
  repo: string;
  branch: string;
  api: "Twitch" | "Valorant" | "Transcripts" | "Códigos QR" | "General";
  /** Si false, no se consulta (p. ej. repo privado sin token). */
  enabled?: boolean;
}

export const UPDATE_REPOS: UpdateRepoConfig[] = [
  {
    id: "valorant",
    owner: "Ponss17",
    repo: "LosPerrisValorantApi",
    branch: "main",
    api: "Valorant",
  },
  {
    id: "qr",
    owner: "Ponss17",
    repo: "GeneradorQR",
    branch: "main",
    api: "Códigos QR",
  },
  {
    id: "transcripts",
    owner: "Ponss17",
    repo: "transcripts",
    branch: "main",
    api: "Transcripts",
  },
  // Activa cuando tengas el repo en GitHub (owner/repo/branch):
  // {
  //   id: "twitch",
  //   owner: "Ponss17",
  //   repo: "twitch-api-modern",
  //   branch: "main",
  //   api: "Twitch",
  // },
];

/** Días hacia atrás y máximo por repo (evita inundar la página). */
export const GITHUB_UPDATES_MAX_AGE_DAYS = 90;
export const GITHUB_UPDATES_MAX_PER_REPO = 12;
