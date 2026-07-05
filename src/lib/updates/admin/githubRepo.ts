const REPO = "Ponss17/LosPerris";

type GithubContentResponse = {
  content: string;
  sha: string;
};

function githubHeaders(token: string) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function readRepoJson<T>(path: string, token: string) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}`,
    { headers: githubHeaders(token) },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `No se pudo leer ${path} (${res.status})${body ? `: ${body.slice(0, 120)}` : ""}`,
    );
  }

  const data = (await res.json()) as GithubContentResponse;
  const text = Buffer.from(data.content, "base64").toString("utf8");
  return { data: JSON.parse(text) as T, sha: data.sha };
}

export async function writeRepoJson(
  path: string,
  payload: unknown,
  sha: string,
  token: string,
  message: string,
) {
  const content = Buffer.from(
    `${JSON.stringify(payload, null, 2)}\n`,
    "utf8",
  ).toString("base64");

  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        ...githubHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, content, sha }),
    },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const err = new Error(
      `No se pudo guardar ${path} (${res.status})${body ? `: ${body.slice(0, 200)}` : ""}`,
    ) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
}

/**
 * Lee → aplica cambios → escribe con sha actual.
 * Reintenta en 409 (otro proceso escribió primero): relee y vuelve a aplicar.
 */
export async function mutateRepoJson<T>(
  path: string,
  token: string,
  message: string,
  apply: (data: T) => void,
  maxAttempts = 3,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const { data, sha } = await readRepoJson<T>(path, token);
    const draft = structuredClone(data);
    apply(draft);

    try {
      await writeRepoJson(path, draft, sha, token, message);
      return draft;
    } catch (error) {
      const err = error as Error & { status?: number };
      lastError = err;
      if (err.status === 409 && attempt < maxAttempts) {
        await sleep(400 * attempt);
        continue;
      }
      throw err;
    }
  }

  throw lastError ?? new Error(`No se pudo guardar ${path}`);
}

export function getGithubToken() {
  return (
    import.meta.env.UPDATES_ADMIN_GITHUB_TOKEN ||
    import.meta.env.UPDATE_SYNC_TOKEN ||
    import.meta.env.GITHUB_TOKEN
  );
}
