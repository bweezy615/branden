import { deletePushSubscription, savePushSubscription, type PushSubscriptionInput } from "@pullbell/db";
import { HttpError, requireDevice, respond } from "@/lib/api";

function parseSubscription(body: unknown): PushSubscriptionInput {
  const b = body as Record<string, unknown> | null;
  if (b?.kind === "expo" && typeof b.token === "string") return { kind: "expo", token: b.token };
  const keys = b?.keys as Record<string, unknown> | undefined;
  if (
    b?.kind === "webpush" &&
    typeof b.endpoint === "string" &&
    typeof keys?.p256dh === "string" &&
    typeof keys?.auth === "string"
  ) {
    return { kind: "webpush", endpoint: b.endpoint, keys: { p256dh: keys.p256dh, auth: keys.auth } };
  }
  throw new HttpError(400, 'Expected { kind: "expo", token } or { kind: "webpush", endpoint, keys: { p256dh, auth } }');
}

// POST /api/push: register this device's Web Push subscription or Expo push token
export async function POST(request: Request) {
  return respond(async () => savePushSubscription(await requireDevice(request), parseSubscription(await request.json())));
}

// DELETE /api/push { endpoint } (the Web Push endpoint or the Expo token)
export async function DELETE(request: Request) {
  return respond(async () => {
    const deviceId = await requireDevice(request);
    const { endpoint } = (await request.json()) as { endpoint?: unknown };
    if (typeof endpoint !== "string") throw new HttpError(400, "Expected { endpoint }");
    return deletePushSubscription(deviceId, endpoint);
  });
}
