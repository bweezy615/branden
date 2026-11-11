import type { Adapter } from "./types";

// Shopify storefronts expose every product at /products/<handle>.js with live availability
// and prices in cents.
export const shopify: Adapter = {
  sourceUrl(listingUrl) {
    const url = new URL(listingUrl);
    const match = url.pathname.match(/\/products\/([^/]+)\/?$/);
    if (!match) throw new Error(`Not a Shopify product URL: ${listingUrl}`);
    return `${url.origin}/products/${match[1]}.js`;
  },

  parse(body) {
    const product = JSON.parse(body) as { available?: unknown; price?: unknown };
    if (typeof product.available !== "boolean") throw new Error("Shopify response has no boolean `available`");
    return {
      inStock: product.available,
      priceCents: typeof product.price === "number" ? product.price : null,
    };
  },
};
