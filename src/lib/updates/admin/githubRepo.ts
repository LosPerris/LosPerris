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
    throw new Error(
      `No se pudo guardar ${path} (${res.status})${body ? `: ${body.slice(0, 200)}` : ""}`,
    );
  }
}

export function getGithubToken() {
  return (
    import.meta.env.UPDATES_ADMIN_GITHUB_TOKEN ||
    import.meta.env.UPDATE_SYNC_TOKEN ||
    import.meta.env.GITHUB_TOKEN
  );
}
