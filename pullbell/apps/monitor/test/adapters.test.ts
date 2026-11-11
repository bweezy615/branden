import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { jsonld } from "../src/adapters/jsonld";
import { shopify } from "../src/adapters/shopify";
import { isRestock } from "../src/check";

describe("shopify adapter", () => {
  it("maps a product URL to its .js endpoint", () => {
    assert.equal(
      shopify.sourceUrl("https://www.kidrobot.com/products/hello-kitty-sweet-treats?variant=1"),
      "https://www.kidrobot.com/products/hello-kitty-sweet-treats.js",
    );
    assert.equal(
      shopify.sourceUrl("https://shop.example.com/collections/toys/products/needoh-cube/"),
      "https://shop.example.com/products/needoh-cube.js",
    );
  });

  it("rejects URLs that are not product pages", () => {
    assert.throws(() => shopify.sourceUrl("https://www.kidrobot.com/collections/sanrio"));
  });

  it("reads availability and price in cents (real response shape)", () => {
    const body = JSON.stringify({
      id: 9551745613921,
      title: 'Hello Kitty® Sweet Treats 3" Blind Box Mini Figure Series (PRE-ORDER)',
      vendor: "Sanrio",
      price: 1199,
      price_min: 1199,
      price_max: 14388,
      available: true,
      variants: [{ id: 50291990954081, available: true, price: 1199 }],
    });
    assert.deepEqual(shopify.parse(body), { inStock: true, priceCents: 1199 });
    assert.deepEqual(shopify.parse(JSON.stringify({ available: false, price: 599 })), {
      inStock: false,
      priceCents: 599,
    });
  });

  it("fails loudly on unexpected bodies", () => {
    assert.throws(() => shopify.parse("<html>Access denied</html>"));
    assert.throws(() => shopify.parse(JSON.stringify({ title: "no availability" })));
  });
});

const page = (ld: unknown) =>
  `<html><head><script type="application/ld+json">{"@type":"BreadcrumbList"}</script>
   <script type="application/ld+json">${JSON.stringify(ld)}</script></head><body></body></html>`;

describe("jsonld adapter", () => {
  it("reads an in-stock single offer", () => {
    const html = page({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Elite Trainer Box",
      offers: { "@type": "Offer", price: "49.99", availability: "https://schema.org/InStock" },
    });
    assert.deepEqual(jsonld.parse(html), { inStock: true, priceCents: 4999 });
  });

  it("reads a sold-out product inside @graph", () => {
    const html = page({
      "@graph": [
        { "@type": "WebPage" },
        { "@type": ["Product", "Thing"], offers: [{ price: 24.99, availability: "http://schema.org/OutOfStock" }] },
      ],
    });
    assert.deepEqual(jsonld.parse(html), { inStock: false, priceCents: 2499 });
  });

  it("is in stock when any offer is buyable and prices the cheapest buyable one", () => {
    const html = page({
      "@type": "Product",
      offers: [
        { price: "10.00", availability: "OutOfStock" },
        { price: "12.50", availability: "InStock" },
        { price: "15.00", availability: "PreOrder" },
      ],
    });
    assert.deepEqual(jsonld.parse(html), { inStock: true, priceCents: 1250 });
  });

  it("skips invalid JSON-LD blocks and fails when no product is found", () => {
    assert.throws(() => jsonld.parse('<script type="application/ld+json">{oops</script>'));
    assert.throws(() => jsonld.parse("<html></html>"));
  });
});

describe("isRestock", () => {
  it("fires only on a sold-out -> in-stock change", () => {
    assert.equal(isRestock(false, true), true);
    assert.equal(isRestock(null, true), false); // first check is a baseline
    assert.equal(isRestock(true, true), false);
    assert.equal(isRestock(true, false), false);
    assert.equal(isRestock(false, false), false);
  });
});
