import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

function connect() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return drizzle(postgres(url), { schema });
}

export type Db = ReturnType<typeof connect>;

// Reuse one pool per process (Next.js dev reloads modules on every edit).
const globalForDb = globalThis as unknown as { restockDb?: Db };

export function getDb(): Db {
  globalForDb.restockDb ??= connect();
  return globalForDb.restockDb;
}
