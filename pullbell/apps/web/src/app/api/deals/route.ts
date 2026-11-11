import { getDeals } from "@pullbell/db";
import { categoryParam, respond } from "@/lib/api";

// GET /api/deals?category=<tcg|squishy|collectibles>
export async function GET(request: Request) {
  return respond(() => getDeals({ category: categoryParam(new URL(request.url).searchParams) }));
}
