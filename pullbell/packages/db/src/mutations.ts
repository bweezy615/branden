import { and, eq } from "drizzle-orm";
import { getDb } from "./client";
import { brandFollows, brands, devices, productFollows, products, pushSubscriptions } from "./schema";
import type { PushSubscriptionInput } from "./shared";

export class NotFoundError extends Error {}

export async function createDevice(): Promise<string> {
  const [device] = await getDb().insert(devices).values({}).returning({ id: devices.id });
  return device.id;
}

export async function deviceExists(deviceId: string): Promise<boolean> {
  const rows = await getDb().select({ id: devices.id }).from(devices).where(eq(devices.id, deviceId));
  return rows.length === 1;
}

async function productId(slug: string): Promise<number> {
  const [row] = await getDb().select({ id: products.id }).from(products).where(eq(products.slug, slug));
  if (!row) throw new NotFoundError(`Unknown product: ${slug}`);
  return row.id;
}

async function brandId(slug: string): Promise<number> {
  const [row] = await getDb().select({ id: brands.id }).from(brands).where(eq(brands.slug, slug));
  if (!row) throw new NotFoundError(`Unknown brand: ${slug}`);
  return row.id;
}

export async function followProduct(deviceId: string, slug: string): Promise<void> {
  await getDb()
    .insert(productFollows)
    .values({ deviceId, productId: await productId(slug) })
    .onConflictDoNothing();
}

export async function unfollowProduct(deviceId: string, slug: string): Promise<void> {
  const id = await productId(slug);
  await getDb()
    .delete(productFollows)
    .where(and(eq(productFollows.deviceId, deviceId), eq(productFollows.productId, id)));
}

export async function followBrand(deviceId: string, slug: string): Promise<void> {
  await getDb()
    .insert(brandFollows)
    .values({ deviceId, brandId: await brandId(slug) })
    .onConflictDoNothing();
}

export async function unfollowBrand(deviceId: string, slug: string): Promise<void> {
  const id = await brandId(slug);
  await getDb().delete(brandFollows).where(and(eq(brandFollows.deviceId, deviceId), eq(brandFollows.brandId, id)));
}

export async function savePushSubscription(deviceId: string, input: PushSubscriptionInput): Promise<void> {
  const values =
    input.kind === "webpush"
      ? { deviceId, kind: input.kind, endpoint: input.endpoint, keys: input.keys }
      : { deviceId, kind: input.kind, endpoint: input.token, keys: null };
  // A browser or phone that changes hands (new device id) moves its subscription along.
  await getDb()
    .insert(pushSubscriptions)
    .values(values)
    .onConflictDoUpdate({ target: pushSubscriptions.endpoint, set: { deviceId, keys: values.keys } });
}

export async function deletePushSubscription(deviceId: string, endpoint: string): Promise<void> {
  await getDb()
    .delete(pushSubscriptions)
    .where(and(eq(pushSubscriptions.deviceId, deviceId), eq(pushSubscriptions.endpoint, endpoint)));
}
