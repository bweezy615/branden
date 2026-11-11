import { schema, getDb } from "@pullbell/db";
import { eq } from "drizzle-orm";
import { adapters, type StockState } from "./adapters";

export type ListingToCheck = {
  id: number;
  url: string;
  inStock: boolean | null;
  adapter: "shopify" | "jsonld";
  retailerName: string;
  productId: number;
  productSlug: string;
  productName: string;
  productImageUrl: string | null;
  brandId: number;
};

export type Restock = { listing: ListingToCheck; priceCents: number | null };

const USER_AGENT = "PullbellMonitor/0.1";

// Only a sold-out -> in-stock change is a restock. The first check (previous === null)
// just records a baseline, so seeding the catalog never fires a wave of alerts.
export function isRestock(previous: boolean | null, next: boolean): boolean {
  return previous === false && next;
}

export async function fetchStock(listing: Pick<ListingToCheck, "url" | "adapter">): Promise<StockState> {
  const adapter = adapters[listing.adapter];
  const response = await fetch(adapter.sourceUrl(listing.url), {
    headers: { "user-agent": USER_AGENT, accept: "application/json,text/html" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return adapter.parse(await response.text());
}

// Checks one listing, stores the result and returns the restock if one happened.
export async function checkListing(listing: ListingToCheck): Promise<Restock | null> {
  const db = getDb();
  const checkedAt = new Date();
  let state: StockState;
  try {
    state = await fetchStock(listing);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await db
      .update(schema.listings)
      .set({ lastCheckedAt: checkedAt, lastError: message })
      .where(eq(schema.listings.id, listing.id));
    console.error(`[check] ${listing.url}: ${message}`);
    return null;
  }

  const restocked = isRestock(listing.inStock, state.inStock);
  await db.transaction(async (tx) => {
    await tx
      .update(schema.listings)
      .set({ inStock: state.inStock, priceCents: state.priceCents, lastCheckedAt: checkedAt, lastError: null })
      .where(eq(schema.listings.id, listing.id));
    if (restocked) {
      await tx
        .insert(schema.restockEvents)
        .values({ listingId: listing.id, priceCents: state.priceCents, detectedAt: checkedAt });
    }
  });
  return restocked ? { listing, priceCents: state.priceCents } : null;
}
