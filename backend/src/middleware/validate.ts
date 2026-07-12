import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export function validate(schema: ZodSchema, source: "body" | "query" | "params" = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      res.status(422).json({
        success: false,
        message: "Validation error",
        errors,
      });
      return;
    }

    if (source === "query") {
      for (const [key, value] of Object.entries(result.data as Record<string, unknown>)) {
        (req.query as Record<string, unknown>)[key] = value;
      }
    } else if (source === "params") {
      for (const [key, value] of Object.entries(result.data as Record<string, unknown>)) {
        (req.params as Record<string, unknown>)[key] = value;
      }
    } else {
      req.body = result.data;
    }
    next();
  };
}
