import { Router } from "express";
import { isDatabaseReady } from "../config/database.js";

const router = Router();

router.get("/", (_req, res) => {
  const dbOk = isDatabaseReady();
  res.status(dbOk ? 200 : 503).json({
    success: dbOk,
    status: dbOk ? "healthy" : "degraded",
    database: dbOk ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

export { router as healthRoutes };
