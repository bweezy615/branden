import { followProduct, unfollowProduct } from "@pullbell/db";
import { requireDevice, respond } from "@/lib/api";

type Ctx = RouteContext<"/api/following/products/[slug]">;

export async function PUT(request: Request, ctx: Ctx) {
  return respond(async () => followProduct(await requireDevice(request), (await ctx.params).slug));
}

export async function DELETE(request: Request, ctx: Ctx) {
  return respond(async () => unfollowProduct(await requireDevice(request), (await ctx.params).slug));
}
