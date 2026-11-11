// Web Push: service worker registration and subscription.
import { api } from "./client";

export type PushStatus = "unsupported" | "needs-install" | "denied" | "off" | "on";

function vapidKey(): Uint8Array<ArrayBuffer> {
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!key) throw new Error("NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set");
  const base64 = (key + "=".repeat((4 - (key.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

function isIos(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isStandalone(): boolean {
  return window.matchMedia("(display-mode: standalone)").matches;
}

async function registration(): Promise<ServiceWorkerRegistration> {
  await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
  return navigator.serviceWorker.ready;
}

export async function pushStatus(): Promise<PushStatus> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    // iOS only exposes Web Push to apps added to the Home Screen
    return isIos() && !isStandalone() ? "needs-install" : "unsupported";
  }
  if (Notification.permission === "denied") return "denied";
  const sub = await (await registration()).pushManager.getSubscription();
  return sub ? "on" : "off";
}

// Must be called from a user gesture (click) so the browser shows the permission prompt.
export async function enablePush(): Promise<PushStatus> {
  const reg = await registration();
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return permission === "denied" ? "denied" : "off";
  const sub =
    (await reg.pushManager.getSubscription()) ??
    (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: vapidKey() }));
  await api.savePush(sub.toJSON());
  return "on";
}

export async function disablePush(): Promise<PushStatus> {
  const sub = await (await registration()).pushManager.getSubscription();
  if (sub) {
    await api.deletePush(sub.endpoint);
    await sub.unsubscribe();
  }
  return "off";
}
