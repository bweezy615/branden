import { formatPrice, getDb, schema } from "@pullbell/db";
import { eq, inArray, or } from "drizzle-orm";
import { Expo, type ExpoPushMessage } from "expo-server-sdk";
import { sendNotification, setVapidDetails, WebPushError } from "web-push";
import type { Restock } from "./check";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

setVapidDetails(requireEnv("VAPID_SUBJECT"), requireEnv("VAPID_PUBLIC_KEY"), requireEnv("VAPID_PRIVATE_KEY"));
// EXPO_ACCESS_TOKEN is only needed when "enhanced push security" is turned on in the Expo project.
const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

export type Alert = { title: string; body: string; url: string; productSlug: string; imageUrl: string | null };

export function buildAlert({ listing, priceCents }: Restock): Alert {
  return {
    title: `${listing.productName} is back in stock`,
    body: `${listing.retailerName} · ${formatPrice(priceCents)} · Tap to buy`,
    url: listing.url,
    productSlug: listing.productSlug,
    imageUrl: listing.productImageUrl,
  };
}

async function subscribersOf(restock: Restock) {
  const { productFollows, brandFollows, pushSubscriptions } = schema;
  const db = getDb();
  return db
    .select({ id: pushSubscriptions.id, kind: pushSubscriptions.kind, endpoint: pushSubscriptions.endpoint, keys: pushSubscriptions.keys })
    .from(pushSubscriptions)
    .where(
      or(
        inArray(
          pushSubscriptions.deviceId,
          db
            .select({ id: productFollows.deviceId })
            .from(productFollows)
            .where(eq(productFollows.productId, restock.listing.productId)),
        ),
        inArray(
          pushSubscriptions.deviceId,
          db.select({ id: brandFollows.deviceId }).from(brandFollows).where(eq(brandFollows.brandId, restock.listing.brandId)),
        ),
      ),
    );
}

async function removeSubscriptions(ids: number[]) {
  if (ids.length === 0) return;
  await getDb().delete(schema.pushSubscriptions).where(inArray(schema.pushSubscriptions.id, ids));
}

export async function notifyRestock(restock: Restock): Promise<void> {
  const alert = buildAlert(restock);
  const subscribers = await subscribersOf(restock);
  const expired: number[] = [];
  let delivered = 0;

  const webPush = subscribers.filter((s) => s.kind === "webpush");
  await Promise.all(
    webPush.map(async (s) => {
      if (!s.keys) throw new Error(`Web Push subscription ${s.id} has no keys`);
      try {
        await sendNotification({ endpoint: s.endpoint, keys: s.keys }, JSON.stringify(alert));
        delivered += 1;
      } catch (error) {
        // 404/410: the browser dropped the subscription
        if (error instanceof WebPushError && (error.statusCode === 404 || error.statusCode === 410)) {
          expired.push(s.id);
        } else {
          console.error(`[notify] web push to subscription ${s.id} failed`, error);
        }
      }
    }),
  );

  const native = subscribers.filter((s) => s.kind === "expo");
  const messages: ExpoPushMessage[] = native.map((s) => ({
    to: s.endpoint,
    title: alert.title,
    body: alert.body,
    sound: "default",
    data: { url: alert.url, productSlug: alert.productSlug },
    ...(alert.imageUrl ? { richContent: { image: alert.imageUrl } } : {}),
  }));
  for (const chunk of expo.chunkPushNotifications(messages)) {
    let tickets;
    try {
      tickets = await expo.sendPushNotificationsAsync(chunk);
    } catch (error) {
      // Expo service unreachable: log and keep going so one failed batch doesn't stop the monitor
      console.error(`[notify] expo push batch of ${chunk.length} failed`, error);
      continue;
    }
    tickets.forEach((ticket, i) => {
      if (ticket.status === "ok") {
        delivered += 1;
        return;
      }
      if (ticket.details?.error === "DeviceNotRegistered") {
        expired.push(native.find((s) => s.endpoint === chunk[i].to)!.id);
      } else {
        console.error(`[notify] expo push to ${chunk[i].to} failed: ${ticket.message}`);
      }
    });
  }

  await removeSubscriptions(expired);
  console.log(
    `[notify] ${alert.title}: ${delivered}/${subscribers.length} delivered (${webPush.length} web, ${native.length} native), ${expired.length} expired removed`,
  );
}
