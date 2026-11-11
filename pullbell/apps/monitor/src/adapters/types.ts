export type StockState = { inStock: boolean; priceCents: number | null };

// An adapter knows which URL to fetch for a listing and how to read stock from the response body.
export type Adapter = {
  sourceUrl(listingUrl: string): string;
  parse(body: string): StockState;
};
