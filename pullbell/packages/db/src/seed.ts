// Upserts the curated catalog (brands, retailers, products, listings) from catalog.json.
// Safe to re-run: existing rows are updated, stock state and history are kept.
import { readFileSync } from "node:fs";
import { sql } from "drizzle-orm";
import { getDb } from "./client";
import { brands, listings, products, retailers } from "./schema";

type Catalog = {
  brands: { slug: string; name: string }[];
  retailers: { slug: string; name: string; adapter: "shopify" | "jsonld" }[];
  products: {
    slug: string;
    name: string;
    brand: string;
    imageUrl: string | null;
    msrpCents: number | null;
    listings: { retailer: string; url: string }[];
  }[];
};

const catalog: Catalog = JSON.parse(readFileSync(new URL("./catalog.json", import.meta.url), "utf8"));

function lookup(rows: { id: number; slug: string }[], slug: string, kind: string): number {
  const row = rows.find((r) => r.slug === slug);
  if (!row) throw new Error(`catalog.json references unknown ${kind}: ${slug}`);
  return row.id;
}

const db = getDb();

const brandRows = await db
  .insert(brands)
  .values(catalog.brands)
  .onConflictDoUpdate({ target: brands.slug, set: { name: sql`excluded.name` } })
  .returning({ id: brands.id, slug: brands.slug });

const retailerRows = await db
  .insert(retailers)
  .values(catalog.retailers)
  .onConflictDoUpdate({ target: retailers.slug, set: { name: sql`excluded.name`, adapter: sql`excluded.adapter` } })
  .returning({ id: retailers.id, slug: retailers.slug });

let listingCount = 0;
for (const p of catalog.products) {
  const values = {
    slug: p.slug,
    name: p.name,
    brandId: lookup(brandRows, p.brand, "brand"),
    imageUrl: p.imageUrl,
    msrpCents: p.msrpCents,
  };
  const [product] = await db
    .insert(products)
    .values(values)
    .onConflictDoUpdate({ target: products.slug, set: values })
    .returning({ id: products.id });
  for (const l of p.listings) {
    const listing = { productId: product.id, retailerId: lookup(retailerRows, l.retailer, "retailer"), url: l.url };
    await db.insert(listings).values(listing).onConflictDoUpdate({ target: listings.url, set: listing });
    listingCount += 1;
  }
}

console.log(
  `Seeded ${brandRows.length} brands, ${retailerRows.length} retailers, ${catalog.products.length} products, ${listingCount} listings`,
);
process.exit(0);
