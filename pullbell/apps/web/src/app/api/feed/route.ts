import { getFeed } from "@pullbell/db";
import { requireDevice, respond } from "@/lib/api";

// GET /api/feed?brand=<slug>&following=1&before=<eventId>
export async function GET(request: Request) {
  return respond(async () => {
    const params = new URL(request.url).searchParams;
    const before = params.get("before");
    return getFeed({
      brandSlug: params.get("brand") ?? undefined,
      followingDeviceId: params.get("following") === "1" ? await requireDevice(request) : undefined,
      beforeId: before ? Number(before) : undefined,
    });
  });
}
