// Browser-side API access. Every request carries this browser's anonymous device id.
import { DEVICE_HEADER, type FeedItem, type Following } from "@pullbell/db/shared";

const DEVICE_KEY = "pullbell.deviceId";

let devicePromise: Promise<string> | null = null;

function deviceId(): Promise<string> {
  devicePromise ??= (async () => {
    const stored = localStorage.getItem(DEVICE_KEY);
    if (stored) return stored;
    const res = await fetch("/api/devices", { method: "POST" });
    if (!res.ok) throw new Error(`Could not register device: HTTP ${res.status}`);
    const { deviceId: id } = (await res.json()) as { deviceId: string };
    localStorage.setItem(DEVICE_KEY, id);
    return id;
  })();
  return devicePromise;
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "content-type": "application/json", [DEVICE_HEADER]: await deviceId(), ...init.headers },
  });
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} failed: HTTP ${res.status}`);
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export const api = {
  following: () => call<Following>("/api/following"),
  setFollow: (kind: "products" | "brands", slug: string, follow: boolean) =>
    call<void>(`/api/following/${kind}/${slug}`, { method: follow ? "PUT" : "DELETE" }),
  feed: (following: boolean) => call<FeedItem[]>(`/api/feed${following ? "?following=1" : ""}`),
  savePush: (subscription: PushSubscriptionJSON) =>
    call<void>("/api/push", {
      method: "POST",
      body: JSON.stringify({ kind: "webpush", endpoint: subscription.endpoint, keys: subscription.keys }),
    }),
  deletePush: (endpoint: string) => call<void>("/api/push", { method: "DELETE", body: JSON.stringify({ endpoint }) }),
};
