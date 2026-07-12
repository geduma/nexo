import { env } from "./env.js";
import { logger } from "./logger.js";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient;
let dbReady = false;

if (env.SUPABASE_URL && env.SUPABASE_PUBLISHABLE_KEY) {
  supabase = createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false },
  });
} else {
  logger.error("SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are required in .env");
  process.exit(1);
}

export { supabase };

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from("settings").select("id").limit(1);
    if (error) throw error;
    dbReady = true;
    logger.info("Database connection OK (Supabase REST API)");
    return true;
  } catch (error) {
    dbReady = false;
    const err = error as Error;
    logger.error("Database connection FAILED:", { message: err.message });
    return false;
  }
}

export function isDatabaseReady(): boolean {
  return dbReady;
}
