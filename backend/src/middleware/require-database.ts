import type { Request, Response, NextFunction } from "express";
import { isDatabaseReady } from "../config/database.js";

export function requireDatabase(req: Request, res: Response, next: NextFunction): void {
  if (!isDatabaseReady()) {
    res.status(503).json({
      success: false,
      message: "Database not connected. Check server logs for details.",
      errors: [],
    });
    return;
  }
  next();
}
