// Client for the Pullbell API (served by the web app). Every request carries this phone's device id.
import {
  DEVICE_HEADER,
  type BrandDetail,
  type BrandWithCount,
  type FeedItem,
  type Following,
  type ProductCard,
  type ProductDetail,
} from "@pullbell/db/shared";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
if (!API_URL) throw new Error("EXPO_PUBLIC_API_URL is not set (see apps/mobile/.env.example)");

const DEVICE_KEY = "pullbell.deviceId";
let devicePromise: Promise<string> | null = null;

function deviceId(): Promise<string> {
  devicePromise ??= (async () => {
    const stored = await SecureStore.getItemAsync(DEVICE_KEY);
    if (stored) return stored;
    const res = await fetch(`${API_URL}/api/devices`, { method: "POST" });
    if (!res.ok) throw new Error(`Could not register device: HTTP ${res.status}`);
    const { deviceId: id } = (await res.json()) as { deviceId: string };
    await SecureStore.setItemAsync(DEVICE_KEY, id);
    return id;
  })();
  return devicePromise;
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "content-type": "application/json", [DEVICE_HEADER]: await deviceId() },
  });
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} failed: HTTP ${res.status}`);
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export const api = {
  feed: (options: { brand?: string; following?: boolean } = {}) => {
    const params = new URLSearchParams();
    if (options.brand) params.set("brand", options.brand);
    if (options.following) params.set("following", "1");
    return call<FeedItem[]>(`/api/feed?${params}`);
  },
  products: (query: string) => call<ProductCard[]>(`/api/products?q=${encodeURIComponent(query)}`),
  product: (slug: string) => call<ProductDetail>(`/api/products/${slug}`),
  brands: () => call<BrandWithCount[]>("/api/brands"),
  brand: (slug: string) => call<BrandDetail>(`/api/brands/${slug}`),
  following: () => call<Following>("/api/following"),
  setFollow: (kind: "products" | "brands", slug: string, follow: boolean) =>
    call<void>(`/api/following/${kind}/${slug}`, { method: follow ? "PUT" : "DELETE" }),
  savePushToken: (token: string) => call<void>("/api/push", { method: "POST", body: JSON.stringify({ kind: "expo", token }) }),
};
