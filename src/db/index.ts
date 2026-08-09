import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// Singleton pattern for Drizzle + postgres in Next.js (avoids connection leaks)
// ─────────────────────────────────────────────────────────────────────────────

const globalForDb = globalThis as unknown as {
  db: PostgresJsDatabase<typeof schema> | undefined;
};

function createDb() {
  const connectionString = process.env["DATABASE_URL"];
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const client = postgres(connectionString, { prepare: false });
  return drizzle(client, { schema });
}

export const db = globalForDb.db ?? createDb();

if (process.env["NODE_ENV"] !== "production") {
  globalForDb.db = db;
}

export * from "./schema";
