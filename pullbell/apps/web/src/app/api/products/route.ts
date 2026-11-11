import { listProducts } from "@pullbell/db";
import { respond } from "@/lib/api";

// GET /api/products?q=<text>&brand=<slug>&sort=newest|name
export async function GET(request: Request) {
  return respond(async () => {
    const params = new URL(request.url).searchParams;
    return listProducts({
      query: params.get("q") ?? undefined,
      brandSlug: params.get("brand") ?? undefined,
      sort: params.get("sort") === "name" ? "name" : "newest",
    });
  });
}
