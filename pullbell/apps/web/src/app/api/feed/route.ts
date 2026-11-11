import { getFeed } from "@pullbell/db";
import { categoryParam, requireDevice, respond } from "@/lib/api";

// GET /api/feed?brand=<slug>&category=<tcg|squishy|collectibles>&following=1&before=<eventId>
export async function GET(request: Request) {
  return respond(async () => {
    const params = new URL(request.url).searchParams;
    const before = params.get("before");
    return getFeed({
      brandSlug: params.get("brand") ?? undefined,
      category: categoryParam(params),
      followingDeviceId: params.get("following") === "1" ? await requireDevice(request) : undefined,
      beforeId: before ? Number(before) : undefined,
    });
  });
}
