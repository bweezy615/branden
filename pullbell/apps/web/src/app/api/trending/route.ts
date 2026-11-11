import { getTrending } from "@pullbell/db";
import { categoryParam, respond } from "@/lib/api";

// GET /api/trending?category=<tcg|squishy|collectibles>
export async function GET(request: Request) {
  return respond(() => getTrending({ category: categoryParam(new URL(request.url).searchParams) }));
}
