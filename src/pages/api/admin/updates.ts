import type { APIRoute } from "astro";
import {
  badRequest,
  getGithubToken,
  isAuthorized,
  normalizeEntry,
  readRepoJson,
  unauthorizedResponse,
  validateEntry,
  writeRepoJson,
  type UpdateEntryInput,
} from "../../../lib/updates/admin";
import {
  UPDATE_DATA_PATHS,
  type UpdateCollection,
  type UpdateEntryRaw,
  type UpdatesJsonFile,
} from "../../../lib/updates/types";

function sortEntries(entries: UpdateEntryRaw[]): UpdateEntryRaw[] {
  return [...entries].sort(
    (a: UpdateEntryRaw, b: UpdateEntryRaw) =>
      new Date(b.date).valueOf() - new Date(a.date).valueOf(),
  );
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function editableCollection(value: unknown): value is "manual" | "planned" {
  return value === "manual" || value === "planned";
}

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  if (!isAuthorized(request)) return unauthorizedResponse();

  const token = getGithubToken();
  if (!token) {
    return json(
      {
        error:
          "Falta UPDATES_ADMIN_GITHUB_TOKEN (o UPDATE_SYNC_TOKEN) en el entorno del servidor.",
      },
      500,
    );
  }

  try {
    const [manual, planned, github] = await Promise.all([
      readRepoJson<UpdatesJsonFile>(UPDATE_DATA_PATHS.manual, token),
      readRepoJson<UpdatesJsonFile>(UPDATE_DATA_PATHS.planned, token),
      readRepoJson<{ syncedAt: string | null; entries: unknown[] }>(
        UPDATE_DATA_PATHS.github,
        token,
      ),
    ]);

    return json({
      manual: manual.data,
      planned: planned.data,
      github: github.data,
    });
  } catch (error) {
    console.error("[admin/updates] GET", error);
    return json({ error: "No se pudieron cargar las novedades." }, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (!isAuthorized(request)) return unauthorizedResponse();

  const token = getGithubToken();
  if (!token)
    return json({ error: "Falta token de GitHub en el servidor." }, 500);

  try {
    const body = await request.json();
    const collection = body?.collection;
    const entry = body?.entry as UpdateEntryInput | undefined;

    if (!editableCollection(collection)) {
      return badRequest("collection debe ser manual o planned.");
    }
    if (!entry) return badRequest("Falta entry.");

    const validationError = validateEntry(entry, collection);
    if (validationError) return badRequest(validationError);

    const path = UPDATE_DATA_PATHS[collection];
    const { data, sha } = await readRepoJson<UpdatesJsonFile>(path, token);
    const normalized = normalizeEntry(entry, collection);

    if (data.entries.some((e: UpdateEntryRaw) => e.id === normalized.id)) {
      return badRequest("Ya existe una entrada con ese id.");
    }

    data.entries.push(normalized);
    data.entries = sortEntries(data.entries);

    await writeRepoJson(
      path,
      data,
      sha,
      token,
      `admin: crear novedad ${collection} — ${normalized.title}`,
    );

    return json({ ok: true, entry: normalized });
  } catch (error) {
    console.error("[admin/updates] POST", error);
    return json({ error: "No se pudo crear la entrada." }, 500);
  }
};

export const PUT: APIRoute = async ({ request }) => {
  if (!isAuthorized(request)) return unauthorizedResponse();

  const token = getGithubToken();
  if (!token)
    return json({ error: "Falta token de GitHub en el servidor." }, 500);

  try {
    const body = await request.json();
    const collection = body?.collection;
    const entry = body?.entry as UpdateEntryInput | undefined;

    if (!editableCollection(collection)) {
      return badRequest("collection debe ser manual o planned.");
    }
    if (!entry?.id) return badRequest("Falta id de la entrada.");

    const validationError = validateEntry(entry, collection);
    if (validationError) return badRequest(validationError);

    const path = UPDATE_DATA_PATHS[collection];
    const { data, sha } = await readRepoJson<UpdatesJsonFile>(path, token);
    const index = data.entries.findIndex(
      (e: UpdateEntryRaw) => e.id === entry.id,
    );

    if (index < 0) return badRequest("Entrada no encontrada.");

    const normalized = normalizeEntry({ ...entry, id: entry.id }, collection);
    data.entries[index] = normalized;
    data.entries = sortEntries(data.entries);

    await writeRepoJson(
      path,
      data,
      sha,
      token,
      `admin: editar novedad ${collection} — ${normalized.title}`,
    );

    return json({ ok: true, entry: normalized });
  } catch (error) {
    console.error("[admin/updates] PUT", error);
    return json({ error: "No se pudo guardar la entrada." }, 500);
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  if (!isAuthorized(request)) return unauthorizedResponse();

  const token = getGithubToken();
  if (!token)
    return json({ error: "Falta token de GitHub en el servidor." }, 500);

  try {
    const body = await request.json();
    const collection = body?.collection as UpdateCollection;
    const id = body?.id as string | undefined;

    if (!editableCollection(collection)) {
      return badRequest("Solo se puede borrar manual o planned.");
    }
    if (!id) return badRequest("Falta id.");

    const path = UPDATE_DATA_PATHS[collection];
    const { data, sha } = await readRepoJson<UpdatesJsonFile>(path, token);
    const before = data.entries.length;
    data.entries = data.entries.filter((e: UpdateEntryRaw) => e.id !== id);

    if (data.entries.length === before) {
      return badRequest("Entrada no encontrada.");
    }

    await writeRepoJson(
      path,
      data,
      sha,
      token,
      `admin: eliminar novedad ${collection} — ${id}`,
    );

    return json({ ok: true });
  } catch (error) {
    console.error("[admin/updates] DELETE", error);
    return json({ error: "No se pudo eliminar la entrada." }, 500);
  }
};
