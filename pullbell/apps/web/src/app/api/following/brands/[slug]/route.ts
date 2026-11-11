import { followBrand, unfollowBrand } from "@pullbell/db";
import { requireDevice, respond } from "@/lib/api";

type Ctx = RouteContext<"/api/following/brands/[slug]">;

export async function PUT(request: Request, ctx: Ctx) {
  return respond(async () => followBrand(await requireDevice(request), (await ctx.params).slug));
}

export async function DELETE(request: Request, ctx: Ctx) {
  return respond(async () => unfollowBrand(await requireDevice(request), (await ctx.params).slug));
}
