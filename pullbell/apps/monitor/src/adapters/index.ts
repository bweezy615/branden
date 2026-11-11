import { jsonld } from "./jsonld";
import { shopify } from "./shopify";
import type { Adapter } from "./types";

export const adapters: Record<"shopify" | "jsonld", Adapter> = { shopify, jsonld };
export type { Adapter, StockState } from "./types";
