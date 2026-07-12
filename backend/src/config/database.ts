import { env } from "./env.js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../database/schema/index.js";
import { logger } from "./logger.js";

let client: ReturnType<typeof postgres>;
let dbReady = false;

const sqlConfig = {
  max: env.NODE_ENV === "production" ? 10 : 5,
  connect_timeout: 10,
  onnotice: () => {},
};

if (env.NODE_ENV === "production") {
  client = postgres(env.DATABASE_URL, sqlConfig);
} else {
  const globalForPostgres = globalThis as unknown as { __postgresClient?: ReturnType<typeof postgres> };
  if (!globalForPostgres.__postgresClient) {
    globalForPostgres.__postgresClient = postgres(env.DATABASE_URL, sqlConfig);
  }
  client = globalForPostgres.__postgresClient;
}

export const db = drizzle(client, { schema });
export { client as sql };

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await client`SELECT 1 as health`;
    dbReady = true;
    logger.info("Database connection OK");
    return true;
  } catch (error) {
    dbReady = false;
    const err = error as Error;
    logger.error("Database connection FAILED:", {
      message: err.message,
      code: (error as { code?: string }).code,
    });
    logger.error(`DATABASE_URL host: ${new URL(env.DATABASE_URL || "http://localhost").hostname}`);
    return false;
  }
}

export function isDatabaseReady(): boolean {
  return dbReady;
}
