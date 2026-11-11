import { getFollowing } from "@pullbell/db";
import { requireDevice, respond } from "@/lib/api";

export async function GET(request: Request) {
  return respond(async () => getFollowing(await requireDevice(request)));
}
