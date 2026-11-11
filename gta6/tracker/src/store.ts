import type { Progress } from "./types";

export function emptyProgress(): Progress {
  return { version: 1, done: {}, owned: [] };
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

export function parseProgress(json: string): Progress {
  const data: unknown = JSON.parse(json);
  if (typeof data !== "object" || data === null) throw new Error("Progress must be an object");
  const { version, done, owned } = data as Record<string, unknown>;
  if (version !== 1) throw new Error(`Unsupported progress version: ${String(version)}`);
  if (typeof done !== "object" || done === null || Array.isArray(done)) throw new Error("Progress.done must be an object");
  for (const [listId, ids] of Object.entries(done)) {
    if (!isStringArray(ids)) throw new Error(`Progress.done.${listId} must be a list of ids`);
  }
  if (!isStringArray(owned)) throw new Error("Progress.owned must be a list of ids");
  return { version: 1, done: done as Record<string, string[]>, owned };
}

function toggle(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}

export function toggleDone(progress: Progress, listId: string, itemId: string): Progress {
  const current = progress.done[listId] ?? [];
  return { ...progress, done: { ...progress.done, [listId]: toggle(current, itemId) } };
}

export function toggleOwned(progress: Progress, vehicleId: string): Progress {
  return { ...progress, owned: toggle(progress.owned, vehicleId) };
}

export function toCode(progress: Progress): string {
  const bytes = new TextEncoder().encode(JSON.stringify(progress));
  return btoa(String.fromCharCode(...bytes));
}

export function fromCode(code: string): Progress {
  const binary = atob(code.trim());
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return parseProgress(new TextDecoder().decode(bytes));
}
