import type { Adapter } from "./types";

// Reads schema.org Product markup (<script type="application/ld+json">) that most retailers embed
// for search engines.

// Availability values that mean a shopper can buy right now.
const BUYABLE = new Set(["InStock", "LimitedAvailability", "OnlineOnly", "PreOrder", "PreSale"]);

type Offer = { availability?: unknown; price?: unknown; lowPrice?: unknown };
type Node = Record<string, unknown>;

function isProduct(node: Node): boolean {
  const type = node["@type"];
  return type === "Product" || (Array.isArray(type) && type.includes("Product"));
}

function findProduct(value: unknown): Node | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findProduct(item);
      if (found) return found;
    }
    return null;
  }
  if (value && typeof value === "object") {
    const node = value as Node;
    if (isProduct(node)) return node;
    if ("@graph" in node) return findProduct(node["@graph"]);
  }
  return null;
}

function availabilityName(value: unknown): string {
  // "https://schema.org/InStock", "http://schema.org/InStock" or "InStock"
  return typeof value === "string" ? value.slice(value.lastIndexOf("/") + 1) : "";
}

function toCents(value: unknown): number | null {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number.parseFloat(value) : Number.NaN;
  return Number.isFinite(n) ? Math.round(n * 100) : null;
}

export const jsonld: Adapter = {
  sourceUrl(listingUrl) {
    return listingUrl;
  },

  parse(body) {
    const scripts = body.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    for (const [, json] of scripts) {
      let data: unknown;
      try {
        data = JSON.parse(json);
      } catch {
        continue; // some sites ship invalid JSON-LD blocks next to valid ones
      }
      const product = findProduct(data);
      if (!product?.offers) continue;
      const offers = (Array.isArray(product.offers) ? product.offers : [product.offers]) as Offer[];
      const buyable = offers.filter((o) => BUYABLE.has(availabilityName(o.availability)));
      const priced = buyable.length > 0 ? buyable : offers;
      const prices = priced.map((o) => toCents(o.price ?? o.lowPrice)).filter((p): p is number => p !== null);
      return {
        inStock: buyable.length > 0,
        priceCents: prices.length > 0 ? Math.min(...prices) : null,
      };
    }
    throw new Error("No schema.org Product with offers found in page");
  },
};
