import type { APIRoute } from "astro";
import {
  applySyncedEditMetadata,
  badRequest,
  buildRevertedSyncedEntry,
  checkAdminRateLimit,
  formatVisibleDate,
  getClientIp,
  getGithubToken,
  isAuthorized,
  isSyncedGithubEntry,
  logAdminAction,
  mutateRepoJson,
  normalizeEntry,
  publishedIdFromPlanned,
  readRepoJson,
  unauthorizedResponse,
  validateEntry,
  type UpdateEntryInput,
} from "../../../lib/updates/admin";
import { parseUpdateEntry } from "../../../lib/updates/schema";
import {
  UPDATE_DATA_PATHS,
  type PublishedUpdatesFile,
  type UpdateEntryRaw,
  type UpdatesJsonFile,
} from "../../../lib/updates/types";

function sortEntries(entries: UpdateEntryRaw[]): UpdateEntryRaw[] {
  return [...entries].sort(
    (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf(),
  );
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function editableCollection(value: unknown): value is "published" | "planned" {
  return value === "published" || value === "planned";
}

function guardAdmin(request: Request, action: string) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  const ip = getClientIp(request);
  if (!checkAdminRateLimit(`admin-updates:${ip}`)) {
    return json({ error: "Demasiadas solicitudes. Espera un minuto." }, 429);
  }

  logAdminAction(request, action);
  return null;
}

function assertValidStoredEntry(entry: UpdateEntryRaw): string | null {
  const parsed = parseUpdateEntry(entry);
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Entrada inválida.";
  }
  return null;
}

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const denied = guardAdmin(request, "GET");
  if (denied) return denied;

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
    const [published, planned] = await Promise.all([
      readRepoJson<PublishedUpdatesFile>(UPDATE_DATA_PATHS.published, token),
      readRepoJson<UpdatesJsonFile>(UPDATE_DATA_PATHS.planned, token),
    ]);

    return json({
      published: published.data,
      planned: planned.data,
    });
  } catch (error) {
    console.error("[admin/updates] GET", error);
    return json({ error: "No se pudieron cargar las novedades." }, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  const denied = guardAdmin(request, "POST");
  if (denied) return denied;

  const token = getGithubToken();
  if (!token)
    return json({ error: "Falta token de GitHub en el servidor." }, 500);

  try {
    const body = await request.json();

    if (body?.action === "promote") {
      logAdminAction(request, "promote", { id: body?.id });
      return promotePlanned(body?.id as string | undefined, token);
    }

    if (body?.action === "revert") {
      logAdminAction(request, "revert", { id: body?.id });
      return revertPublished(body?.id as string | undefined, token);
    }

    const collection = body?.collection;
    const entry = body?.entry as UpdateEntryInput | undefined;

    if (!editableCollection(collection)) {
      return badRequest("collection debe ser published o planned.");
    }
    if (!entry) return badRequest("Falta entry.");

    const validationError = validateEntry(entry);
    if (validationError) return badRequest(validationError);

    const normalized = normalizeEntry(entry, collection);
    const storedError = assertValidStoredEntry(normalized);
    if (storedError) return badRequest(storedError);

    let created = normalized;
    logAdminAction(request, "create", { collection, id: normalized.id });

    if (collection === "published") {
      await mutateRepoJson<PublishedUpdatesFile>(
        UPDATE_DATA_PATHS.published,
        token,
        `admin: crear novedad — ${normalized.title}`,
        (data: PublishedUpdatesFile) => {
          const existing = data.entries.find(
            (e: UpdateEntryRaw) => e.id === normalized.id,
          );
          if (existing) {
            created = existing;
            return;
          }
          data.entries.push(normalized);
          data.entries = sortEntries(data.entries);
        },
      );
    } else {
      await mutateRepoJson<UpdatesJsonFile>(
        UPDATE_DATA_PATHS.planned,
        token,
        `admin: crear planned — ${normalized.title}`,
        (data: UpdatesJsonFile) => {
          const existing = data.entries.find(
            (e: UpdateEntryRaw) => e.id === normalized.id,
          );
          if (existing) {
            created = existing;
            return;
          }
          data.entries.push(normalized);
          data.entries = sortEntries(data.entries);
        },
      );
    }

    return json({ ok: true, entry: created });
  } catch (error) {
    console.error("[admin/updates] POST", error);
    return json({ error: "No se pudo crear la entrada." }, 500);
  }
};

async function promotePlanned(id: string | undefined, token: string) {
  if (!id) return badRequest("Falta id de planned.");

  const { data: plannedFile } = await readRepoJson<UpdatesJsonFile>(
    UPDATE_DATA_PATHS.planned,
    token,
  );
  const planned = plannedFile.entries.find((e: UpdateEntryRaw) => e.id === id);
  if (!planned) return badRequest("Entrada planned no encontrada.");

  const pubId = publishedIdFromPlanned(id);
  const now = new Date();
  const publishedEntry: UpdateEntryRaw = {
    id: pubId,
    title: planned.title,
    description: planned.description,
    tag: planned.tag,
    api: planned.api,
    date: now.toISOString(),
    dateString: formatVisibleDate(now),
  };

  const storedError = assertValidStoredEntry(publishedEntry);
  if (storedError) return badRequest(storedError);

  await mutateRepoJson<PublishedUpdatesFile>(
    UPDATE_DATA_PATHS.published,
    token,
    `admin: publicar planned — ${planned.title}`,
    (store: PublishedUpdatesFile) => {
      if (!store.entries.some((e: UpdateEntryRaw) => e.id === pubId)) {
        store.entries.push(publishedEntry);
        store.entries = sortEntries(store.entries);
      }
    },
  );

  await mutateRepoJson<UpdatesJsonFile>(
    UPDATE_DATA_PATHS.planned,
    token,
    `admin: quitar planned tras publicar — ${id}`,
    (data: UpdatesJsonFile) => {
      data.entries = data.entries.filter((e: UpdateEntryRaw) => e.id !== id);
    },
  );

  return json({ ok: true, entry: publishedEntry, removedPlannedId: id });
}

async function revertPublished(id: string | undefined, token: string) {
  if (!id) return badRequest("Falta id.");
  if (!isSyncedGithubEntry(id)) {
    return badRequest("Solo se puede revertir entradas gh-* editadas.");
  }

  try {
    let reverted: UpdateEntryRaw | null = null;

    await mutateRepoJson<PublishedUpdatesFile>(
      UPDATE_DATA_PATHS.published,
      token,
      `admin: revertir edición — ${id}`,
      (data: PublishedUpdatesFile) => {
        const index = data.entries.findIndex(
          (e: UpdateEntryRaw) => e.id === id,
        );
        if (index < 0) throw new Error("NOT_FOUND");

        const entry = data.entries[index];
        const restored = buildRevertedSyncedEntry(entry);
        if (!restored) throw new Error("NOT_REVERTIBLE");

        data.entries[index] = restored;
        reverted = restored;
      },
    );

    return json({ ok: true, entry: reverted });
  } catch (error) {
    const msg = (error as Error).message;
    if (msg === "NOT_FOUND") return badRequest("Entrada no encontrada.");
    if (msg === "NOT_REVERTIBLE") {
      return badRequest("Esta entrada no tiene versión original guardada.");
    }
    console.error("[admin/updates] revert", error);
    return json({ error: "No se pudo revertir." }, 500);
  }
}

export const PUT: APIRoute = async ({ request }) => {
  const denied = guardAdmin(request, "PUT");
  if (denied) return denied;

  const token = getGithubToken();
  if (!token)
    return json({ error: "Falta token de GitHub en el servidor." }, 500);

  try {
    const body = await request.json();
    const collection = body?.collection;
    const entry = body?.entry as UpdateEntryInput | undefined;

    if (!editableCollection(collection)) {
      return badRequest("collection debe ser published o planned.");
    }
    if (!entry?.id) return badRequest("Falta id de la entrada.");

    const validationError = validateEntry(entry);
    if (validationError) return badRequest(validationError);

    const entryId = entry.id;
    let saved = normalizeEntry({ ...entry, id: entryId }, collection);
    logAdminAction(request, "update", { collection, id: entryId });

    if (collection === "published") {
      await mutateRepoJson<PublishedUpdatesFile>(
        UPDATE_DATA_PATHS.published,
        token,
        `admin: editar novedad — ${saved.title}`,
        (data: PublishedUpdatesFile) => {
          const index = data.entries.findIndex(
            (e: UpdateEntryRaw) => e.id === entryId,
          );
          if (index < 0) throw new Error("NOT_FOUND");

          const previous = data.entries[index];
          let normalized = normalizeEntry(
            { ...entry, id: entryId },
            collection,
          );

          if (isSyncedGithubEntry(entryId)) {
            normalized = applySyncedEditMetadata(previous, normalized);
          } else if (previous.commitSha) {
            normalized.commitSha = previous.commitSha;
          }

          const storedError = assertValidStoredEntry(normalized);
          if (storedError) throw new Error(`INVALID:${storedError}`);

          data.entries[index] = normalized;
          data.entries = sortEntries(data.entries);
          saved = normalized;
        },
      );
    } else {
      await mutateRepoJson<UpdatesJsonFile>(
        UPDATE_DATA_PATHS.planned,
        token,
        `admin: editar planned — ${saved.title}`,
        (data: UpdatesJsonFile) => {
          const index = data.entries.findIndex(
            (e: UpdateEntryRaw) => e.id === entryId,
          );
          if (index < 0) throw new Error("NOT_FOUND");

          const normalized = normalizeEntry(
            { ...entry, id: entryId },
            collection,
          );
          const storedError = assertValidStoredEntry(normalized);
          if (storedError) throw new Error(`INVALID:${storedError}`);

          data.entries[index] = normalized;
          data.entries = sortEntries(data.entries);
          saved = normalized;
        },
      );
    }

    return json({ ok: true, entry: saved });
  } catch (error) {
    const msg = (error as Error).message;
    if (msg === "NOT_FOUND") return badRequest("Entrada no encontrada.");
    if (msg.startsWith("INVALID:")) return badRequest(msg.slice(8));
    console.error("[admin/updates] PUT", error);
    return json({ error: "No se pudo guardar la entrada." }, 500);
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const denied = guardAdmin(request, "DELETE");
  if (denied) return denied;

  const token = getGithubToken();
  if (!token)
    return json({ error: "Falta token de GitHub en el servidor." }, 500);

  try {
    const body = await request.json();
    const collection = body?.collection;
    const id = body?.id as string | undefined;

    if (!editableCollection(collection)) {
      return badRequest("collection debe ser published o planned.");
    }
    if (!id) return badRequest("Falta id.");

    logAdminAction(request, "delete", { collection, id });

    if (collection === "published") {
      await mutateRepoJson<PublishedUpdatesFile>(
        UPDATE_DATA_PATHS.published,
        token,
        `admin: eliminar novedad — ${id}`,
        (data: PublishedUpdatesFile) => {
          const before = data.entries.length;
          data.entries = data.entries.filter(
            (e: UpdateEntryRaw) => e.id !== id,
          );
          if (data.entries.length === before) throw new Error("NOT_FOUND");

          if (isSyncedGithubEntry(id)) {
            data.suppressedIds = [
              ...new Set([...(data.suppressedIds ?? []), id]),
            ];
          }
        },
      );
    } else {
      await mutateRepoJson<UpdatesJsonFile>(
        UPDATE_DATA_PATHS.planned,
        token,
        `admin: eliminar planned — ${id}`,
        (data: UpdatesJsonFile) => {
          const before = data.entries.length;
          data.entries = data.entries.filter(
            (e: UpdateEntryRaw) => e.id !== id,
          );
          if (data.entries.length === before) throw new Error("NOT_FOUND");
        },
      );
    }

    return json({ ok: true });
  } catch (error) {
    if ((error as Error).message === "NOT_FOUND") {
      return badRequest("Entrada no encontrada.");
    }
    console.error("[admin/updates] DELETE", error);
    return json({ error: "No se pudo eliminar la entrada." }, 500);
  }
};
