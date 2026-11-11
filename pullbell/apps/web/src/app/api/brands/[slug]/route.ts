import { getBrand, NotFoundError } from "@pullbell/db";
import { respond } from "@/lib/api";

export async function GET(_request: Request, ctx: RouteContext<"/api/brands/[slug]">) {
  return respond(async () => {
    const { slug } = await ctx.params;
    const brand = await getBrand(slug);
    if (!brand) throw new NotFoundError(`Unknown brand: ${slug}`);
    return brand;
  });
}
