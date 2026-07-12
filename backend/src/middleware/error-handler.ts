import type { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger.js";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  logger.error("Unhandled error:", { stack: err.stack, message: err.message });

  const statusCode = (err as { statusCode?: number }).statusCode ?? 500;

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal server error" : err.message,
    errors: [],
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: "Resource not found",
    errors: [],
  });
}
