import { listBrands } from "@pullbell/db";
import { respond } from "@/lib/api";

export async function GET() {
  return respond(() => listBrands());
}
