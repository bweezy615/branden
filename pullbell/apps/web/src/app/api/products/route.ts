import { listProducts } from "@pullbell/db";
import { categoryParam, respond } from "@/lib/api";

// GET /api/products?q=<text>&brand=<slug>&category=<category>&sort=newest|name
export async function GET(request: Request) {
  return respond(async () => {
    const params = new URL(request.url).searchParams;
    return listProducts({
      query: params.get("q") ?? undefined,
      brandSlug: params.get("brand") ?? undefined,
      category: categoryParam(params),
      sort: params.get("sort") === "name" ? "name" : "newest",
    });
  });
}
