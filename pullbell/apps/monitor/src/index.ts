// Restock monitor: checks every listing, records restocks and sends push alerts.
// Usage: npm start            (loops every CHECK_INTERVAL_SECONDS, default 60)
//        npm start -- --once  (one pass, for cron-style schedulers)
import { getDb, schema } from "@pullbell/db";
import { asc, eq, sql } from "drizzle-orm";
import { checkListing, type ListingToCheck } from "./check";
import { notifyRestock } from "./notify";

// Pause between two requests to the same retailer, to stay polite and avoid rate limits.
const SAME_RETAILER_DELAY_MS = 1_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function loadListings(): Promise<Map<string, ListingToCheck[]>> {
  const { listings, products, retailers } = schema;
  const rows = await getDb()
    .select({
      id: listings.id,
      url: listings.url,
      inStock: listings.inStock,
      adapter: retailers.adapter,
      retailerSlug: retailers.slug,
      retailerName: retailers.name,
      productId: products.id,
      productSlug: products.slug,
      productName: products.name,
      productImageUrl: products.imageUrl,
      brandId: products.brandId,
    })
    .from(listings)
    .innerJoin(retailers, eq(listings.retailerId, retailers.id))
    .innerJoin(products, eq(listings.productId, products.id))
    .orderBy(sql`${listings.lastCheckedAt} asc nulls first`, asc(listings.id));

  const byRetailer = new Map<string, ListingToCheck[]>();
  for (const { retailerSlug, ...listing } of rows) {
    byRetailer.set(retailerSlug, [...(byRetailer.get(retailerSlug) ?? []), listing]);
  }
  return byRetailer;
}

async function runPass(): Promise<void> {
  const started = Date.now();
  const byRetailer = await loadListings();
  let checked = 0;
  let restocks = 0;
  // Retailers are checked in parallel, listings of one retailer one after another.
  await Promise.all(
    [...byRetailer.values()].map(async (group) => {
      for (const [i, listing] of group.entries()) {
        if (i > 0) await sleep(SAME_RETAILER_DELAY_MS);
        const restock = await checkListing(listing);
        checked += 1;
        if (restock) {
          restocks += 1;
          await notifyRestock(restock);
        }
      }
    }),
  );
  console.log(`[monitor] checked ${checked} listings, ${restocks} restocks, ${Date.now() - started}ms`);
}

const intervalSeconds = Number(process.env.CHECK_INTERVAL_SECONDS ?? 60);
if (!Number.isFinite(intervalSeconds) || intervalSeconds <= 0) {
  throw new Error(`CHECK_INTERVAL_SECONDS must be a positive number, got ${process.env.CHECK_INTERVAL_SECONDS}`);
}

if (process.argv.includes("--once")) {
  await runPass();
  process.exit(0);
}

for (;;) {
  await runPass();
  await sleep(intervalSeconds * 1000);
}
