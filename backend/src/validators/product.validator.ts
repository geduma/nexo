import { z } from "zod";

export const createProductSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  priceCost: z.number().min(0),
  priceSale: z.number().positive(),
  availabilityStatus: z.enum(["IN_STOCK", "CHECK_SUPPLIER"]).default("IN_STOCK"),
  supplierInfo: z.string().optional(),
  isVisible: z.boolean().default(true),
});

export const updateProductSchema = z.object({
  categoryId: z.string().uuid().optional(),
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  priceCost: z.number().min(0).optional(),
  priceSale: z.number().positive().optional(),
  availabilityStatus: z.enum(["IN_STOCK", "CHECK_SUPPLIER"]).optional(),
  supplierInfo: z.string().optional(),
  isVisible: z.boolean().optional(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
