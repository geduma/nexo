import type { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger.js";

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      timestamp: new Date().toISOString(),
    };

    if (res.statusCode >= 400) {
      logger.warn("Request failed", logData);
    } else {
      logger.info("Request completed", logData);
    }
  });

  next();
}
