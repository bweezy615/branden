// Types and pure helpers shared by the web app, the mobile app and the API.
// Must not import anything that touches the database.

export type Brand = { slug: string; name: string };

export const CATEGORIES = [
  { slug: "tcg", name: "Trading cards" },
  { slug: "squishy", name: "Squishy toys" },
  { slug: "collectibles", name: "Collectibles" },
] as const;

export type Category = (typeof CATEGORIES)[number]["slug"];

export function isCategory(value: unknown): value is Category {
  return CATEGORIES.some((c) => c.slug === value);
}
export type Retailer = { slug: string; name: string };

export type ProductCard = {
  slug: string;
  name: string;
  imageUrl: string | null;
  msrpCents: number | null;
  brand: Brand;
  // Retailers where the product is in stock right now
  inStockAt: Retailer[];
};

export type FeedItem = {
  id: number;
  detectedAt: string;
  priceCents: number | null;
  url: string;
  retailer: Retailer;
  product: { slug: string; name: string; imageUrl: string | null };
  brand: Brand;
};

export type Listing = {
  retailer: Retailer;
  url: string;
  inStock: boolean | null;
  priceCents: number | null;
  lastCheckedAt: string | null;
  lastRestockAt: string | null;
};

export type ProductDetail = {
  product: ProductCard;
  listings: Listing[];
  // Restock events of the last 7 days, newest first
  recentEvents: FeedItem[];
  related: ProductCard[];
};

export type BrandWithCount = Brand & { category: Category; productCount: number };

// Products gaining attention this week: new followers plus detected restocks
export type TrendingItem = { product: ProductCard; newFollowers: number; restocks: number };

// An in-stock listing priced below the product's listed price
export type Deal = {
  product: ProductCard;
  retailer: Retailer;
  url: string;
  priceCents: number;
  percentOff: number;
};

export type BrandDetail = {
  brand: Brand;
  products: ProductCard[];
  recentEvents: FeedItem[];
};

export type Following = {
  products: ProductCard[];
  brands: Brand[];
};

export type PushSubscriptionInput =
  | { kind: "webpush"; endpoint: string; keys: { p256dh: string; auth: string } }
  | { kind: "expo"; token: string };

export const DEVICE_HEADER = "x-device-id";

export function percentOff(priceCents: number, listedCents: number): number {
  return Math.round((1 - priceCents / listedCents) * 100);
}

export function formatPrice(cents: number | null): string {
  if (cents === null) return "MSRP unknown";
  return `$${(cents / 100).toFixed(2)}`;
}

export function timeAgo(iso: string, now: Date = new Date()): string {
  const seconds = Math.max(0, Math.round((now.getTime() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export type HistoryGrid = {
  // 7 day labels, oldest first; the last one is "Today"
  days: string[];
  rows: { retailer: Retailer; counts: number[]; lastRestockAt: string | null }[];
};

// Buckets restock events into the viewer's local calendar days.
export function restockHistory(listings: Listing[], events: FeedItem[], now: Date = new Date()): HistoryGrid {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayStarts = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfToday);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const days = dayStarts.map((d, i) =>
    i === 6 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" }),
  );
  const rows = listings.map((listing) => {
    const counts = Array<number>(7).fill(0);
    for (const event of events) {
      if (event.retailer.slug !== listing.retailer.slug) continue;
      const at = new Date(event.detectedAt);
      const index = dayStarts.findLastIndex((start) => at >= start);
      if (index >= 0) counts[index] += 1;
    }
    return { retailer: listing.retailer, counts, lastRestockAt: listing.lastRestockAt };
  });
  return { days, rows };
}

export function resaleLinks(productName: string): { name: string; url: string }[] {
  const q = encodeURIComponent(productName);
  return [
    { name: "eBay", url: `https://www.ebay.com/sch/i.html?_nkw=${q}` },
    { name: "StockX", url: `https://stockx.com/search?s=${q}` },
  ];
}
