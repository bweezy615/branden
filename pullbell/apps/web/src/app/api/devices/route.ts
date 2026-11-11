import { createDevice } from "@pullbell/db";
import { respond } from "@/lib/api";

// Anonymous identity: each browser / phone gets an id that owns its follows and push subscriptions.
export async function POST() {
  return respond(async () => ({ deviceId: await createDevice() }));
}
