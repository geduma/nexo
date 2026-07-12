import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

config({ path: path.resolve(__dirname, "../../.env") });

export const env = {
  PORT: parseInt(process.env.PORT ?? "3001", 10),
  NODE_ENV: process.env.NODE_ENV ?? "development",
  JWT_SECRET: process.env.JWT_SECRET ?? "dev-secret",
  SUPABASE_URL: process.env.SUPABASE_URL ?? "",
  SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY ?? "",
  SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET ?? "product-images",
  ADMIN_WHATSAPP: process.env.ADMIN_WHATSAPP ?? "",
  DEFAULT_LANGUAGE: process.env.DEFAULT_LANGUAGE ?? "en",
  DEFAULT_CURRENCY: process.env.DEFAULT_CURRENCY ?? "COP",
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:5173",
} as const;
