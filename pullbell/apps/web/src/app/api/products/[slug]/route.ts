import { getProduct, NotFoundError } from "@pullbell/db";
import { respond } from "@/lib/api";

export async function GET(_request: Request, ctx: RouteContext<"/api/products/[slug]">) {
  return respond(async () => {
    const { slug } = await ctx.params;
    const product = await getProduct(slug);
    if (!product) throw new NotFoundError(`Unknown product: ${slug}`);
    return product;
  });
}
