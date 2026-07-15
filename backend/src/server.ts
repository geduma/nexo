import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { checkDatabaseConnection } from "./config/database.js";
import { storageService } from "./services/storage/storage.service.js";

const start = async (): Promise<void> => {
  logger.info("Checking database connection...");
  const dbOk = await checkDatabaseConnection();

  if (dbOk) {
    await storageService.ensureBucket();
  }

  if (!dbOk) {
    logger.warn("WARNING: Database is not connected. API will return 503 for DB routes.");
    logger.warn("Fix SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in backend/.env and restart.");
  }

  try {
    app.listen(env.PORT, () => {
      logger.info(`NEXO API running on port ${env.PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      logger.info(`API Docs: http://localhost:${env.PORT}/api/docs`);
      logger.info(`Database: ${dbOk ? "CONNECTED" : "DISCONNECTED"}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
