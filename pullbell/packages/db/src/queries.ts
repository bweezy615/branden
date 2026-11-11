import { and, asc, count, desc, eq, gt, gte, ilike, inArray, lt, max, ne, or, sql, type SQL } from "drizzle-orm";
import { getDb } from "./client";
import { brandFollows, brands, listings, productFollows, products, restockEvents, retailers } from "./schema";
import {
  percentOff,
  type Brand,
  type BrandDetail,
  type BrandWithCount,
  type Category,
  type Deal,
  type FeedItem,
  type Following,
  type Listing,
  type ProductCard,
  type ProductDetail,
  type Retailer,
  type TrendingItem,
} from "./shared";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const productColumns = {
  id: products.id,
  slug: products.slug,
  name: products.name,
  imageUrl: products.imageUrl,
  msrpCents: products.msrpCents,
  brand: { slug: brands.slug, name: brands.name },
};

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  imageUrl: string | null;
  msrpCents: number | null;
  brand: Brand;
};

async function toCards(rows: ProductRow[]): Promise<ProductCard[]> {
  if (rows.length === 0) return [];
  const inStock = await getDb()
    .select({ productId: listings.productId, slug: retailers.slug, name: retailers.name })
    .from(listings)
    .innerJoin(retailers, eq(listings.retailerId, retailers.id))
    .where(and(inArray(listings.productId, rows.map((r) => r.id)), eq(listings.inStock, true)))
    .orderBy(asc(retailers.name));
  return rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    imageUrl: row.imageUrl,
    msrpCents: row.msrpCents,
    brand: row.brand,
    inStockAt: inStock.filter((l) => l.productId === row.id).map(({ slug, name }) => ({ slug, name })),
  }));
}

function feedQuery(where: SQL | undefined, limit: number) {
  return getDb()
    .select({
      id: restockEvents.id,
      detectedAt: restockEvents.detectedAt,
      priceCents: restockEvents.priceCents,
      url: listings.url,
      retailer: { slug: retailers.slug, name: retailers.name },
      product: { slug: products.slug, name: products.name, imageUrl: products.imageUrl },
      brand: { slug: brands.slug, name: brands.name },
    })
    .from(restockEvents)
    .innerJoin(listings, eq(restockEvents.listingId, listings.id))
    .innerJoin(retailers, eq(listings.retailerId, retailers.id))
    .innerJoin(products, eq(listings.productId, products.id))
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(where)
    .orderBy(desc(restockEvents.id))
    .limit(limit)
    .then((rows) => rows.map((r): FeedItem => ({ ...r, detectedAt: r.detectedAt.toISOString() })));
}

export async function getFeed(options: {
  brandSlug?: string;
  category?: Category;
  followingDeviceId?: string;
  beforeId?: number;
  limit?: number;
}): Promise<FeedItem[]> {
  const db = getDb();
  const filters: (SQL | undefined)[] = [];
  if (options.brandSlug) filters.push(eq(brands.slug, options.brandSlug));
  if (options.category) filters.push(eq(brands.category, options.category));
  if (options.beforeId) filters.push(lt(restockEvents.id, options.beforeId));
  if (options.followingDeviceId) {
    const deviceId = options.followingDeviceId;
    filters.push(
      or(
        inArray(
          products.id,
          db.select({ id: productFollows.productId }).from(productFollows).where(eq(productFollows.deviceId, deviceId)),
        ),
        inArray(
          brands.id,
          db.select({ id: brandFollows.brandId }).from(brandFollows).where(eq(brandFollows.deviceId, deviceId)),
        ),
      ),
    );
  }
  return feedQuery(and(...filters), options.limit ?? 30);
}

export async function listProducts(options: {
  query?: string;
  brandSlug?: string;
  category?: Category;
  sort: "newest" | "name";
  limit?: number;
}): Promise<ProductCard[]> {
  const filters: SQL[] = [];
  if (options.query) filters.push(ilike(products.name, `%${options.query}%`));
  if (options.brandSlug) filters.push(eq(brands.slug, options.brandSlug));
  if (options.category) filters.push(eq(brands.category, options.category));
  const rows = await getDb()
    .select(productColumns)
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(and(...filters))
    .orderBy(options.sort === "newest" ? desc(products.createdAt) : asc(products.name))
    .limit(options.limit ?? 60);
  return toCards(rows);
}

export async function getProduct(slug: string): Promise<ProductDetail | null> {
  const db = getDb();
  const [row] = await db
    .select({ ...productColumns, brandId: products.brandId })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(eq(products.slug, slug));
  if (!row) return null;
  const { brandId, ...productRow } = row;

  const listingRows = await db
    .select({
      retailer: { slug: retailers.slug, name: retailers.name },
      url: listings.url,
      inStock: listings.inStock,
      priceCents: listings.priceCents,
      lastCheckedAt: listings.lastCheckedAt,
      lastRestockAt: max(restockEvents.detectedAt),
    })
    .from(listings)
    .innerJoin(retailers, eq(listings.retailerId, retailers.id))
    .leftJoin(restockEvents, eq(restockEvents.listingId, listings.id))
    .where(eq(listings.productId, row.id))
    .groupBy(listings.id, retailers.id)
    .orderBy(asc(retailers.name));

  const relatedRows = await db
    .select(productColumns)
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(and(eq(products.brandId, brandId), ne(products.id, row.id)))
    .orderBy(desc(products.createdAt))
    .limit(10);

  const [[product], related, recentEvents] = await Promise.all([
    toCards([productRow]),
    toCards(relatedRows),
    feedQuery(
      and(eq(products.id, row.id), gte(restockEvents.detectedAt, new Date(Date.now() - WEEK_MS))),
      200,
    ),
  ]);

  return {
    product,
    listings: listingRows.map(
      (l): Listing => ({
        ...l,
        lastCheckedAt: l.lastCheckedAt?.toISOString() ?? null,
        lastRestockAt: l.lastRestockAt?.toISOString() ?? null,
      }),
    ),
    recentEvents,
    related,
  };
}

export async function listBrands(): Promise<BrandWithCount[]> {
  return getDb()
    .select({ slug: brands.slug, name: brands.name, category: brands.category, productCount: count(products.id) })
    .from(brands)
    .leftJoin(products, eq(products.brandId, brands.id))
    .groupBy(brands.id)
    .orderBy(asc(brands.name));
}

export async function getBrand(slug: string): Promise<BrandDetail | null> {
  const [brand] = await getDb().select({ slug: brands.slug, name: brands.name }).from(brands).where(eq(brands.slug, slug));
  if (!brand) return null;
  const [productCards, recentEvents] = await Promise.all([
    listProducts({ brandSlug: slug, sort: "newest", limit: 200 }),
    getFeed({ brandSlug: slug, limit: 20 }),
  ]);
  return { brand, products: productCards, recentEvents };
}

export async function getFollowing(deviceId: string): Promise<Following> {
  const db = getDb();
  const productRows = await db
    .select(productColumns)
    .from(productFollows)
    .innerJoin(products, eq(productFollows.productId, products.id))
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(eq(productFollows.deviceId, deviceId))
    .orderBy(asc(products.name));
  const brandRows = await db
    .select({ slug: brands.slug, name: brands.name })
    .from(brandFollows)
    .innerJoin(brands, eq(brandFollows.brandId, brands.id))
    .where(eq(brandFollows.deviceId, deviceId))
    .orderBy(asc(brands.name));
  return { products: await toCards(productRows), brands: brandRows };
}

export async function listRetailers(): Promise<Retailer[]> {
  return getDb().select({ slug: retailers.slug, name: retailers.name }).from(retailers).orderBy(asc(retailers.name));
}

// Products ranked by attention this week: followers gained plus restocks detected.
export async function getTrending(options: { category?: Category; limit?: number }): Promise<TrendingItem[]> {
  const db = getDb();
  const since = new Date(Date.now() - WEEK_MS);
  const restocks = db
    .select({ productId: listings.productId, n: count().as("restock_count") })
    .from(restockEvents)
    .innerJoin(listings, eq(restockEvents.listingId, listings.id))
    .where(gte(restockEvents.detectedAt, since))
    .groupBy(listings.productId)
    .as("recent_restocks");
  const follows = db
    .select({ productId: productFollows.productId, n: count().as("follow_count") })
    .from(productFollows)
    .where(gte(productFollows.createdAt, since))
    .groupBy(productFollows.productId)
    .as("recent_follows");
  const restockCount = sql<number>`coalesce(${restocks.n}, 0)`.mapWith(Number);
  const followCount = sql<number>`coalesce(${follows.n}, 0)`.mapWith(Number);

  const rows = await db
    .select({ ...productColumns, restocks: restockCount, newFollowers: followCount })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(restocks, eq(restocks.productId, products.id))
    .leftJoin(follows, eq(follows.productId, products.id))
    .where(and(gt(sql`${restockCount} + ${followCount}`, 0), options.category ? eq(brands.category, options.category) : undefined))
    .orderBy(desc(sql`${restockCount} + ${followCount}`), desc(restockCount), asc(products.name))
    .limit(options.limit ?? 30);

  const cards = await toCards(rows);
  return rows.map((row, i) => ({ product: cards[i], restocks: row.restocks, newFollowers: row.newFollowers }));
}

// In-stock listings priced below the product's listed price, biggest discount first.
export async function getDeals(options: { category?: Category; limit?: number }): Promise<Deal[]> {
  const rows = await getDb()
    .select({
      ...productColumns,
      retailer: { slug: retailers.slug, name: retailers.name },
      url: listings.url,
      priceCents: listings.priceCents,
    })
    .from(listings)
    .innerJoin(products, eq(listings.productId, products.id))
    .innerJoin(brands, eq(products.brandId, brands.id))
    .innerJoin(retailers, eq(listings.retailerId, retailers.id))
    .where(
      and(
        eq(listings.inStock, true),
        lt(listings.priceCents, products.msrpCents),
        options.category ? eq(brands.category, options.category) : undefined,
      ),
    )
    .orderBy(asc(sql`${listings.priceCents}::float / ${products.msrpCents}`))
    .limit(options.limit ?? 50);

  const cards = await toCards(rows);
  return rows.map(({ retailer, url, priceCents, msrpCents }, i) => {
    // Non-null: the where clause compares both columns, which excludes nulls
    const price = priceCents!;
    return { product: cards[i], retailer, url, priceCents: price, percentOff: percentOff(price, msrpCents!) };
  });
}
