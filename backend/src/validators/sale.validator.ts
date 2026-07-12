import { z } from "zod";

export const createSaleSchema = z.object({
  productId: z.string().uuid(),
  customerName: z.string().min(1).max(150),
  customerContact: z.string().optional(),
  quantity: z.number().int().min(1).default(1),
  salePrice: z.number().positive(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

export const updateSaleSchema = z.object({
  productId: z.string().uuid().optional(),
  customerName: z.string().min(1).max(150).optional(),
  customerContact: z.string().optional(),
  quantity: z.number().int().min(1).optional(),
  salePrice: z.number().positive().optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateSaleDto = z.infer<typeof createSaleSchema>;
export type UpdateSaleDto = z.infer<typeof updateSaleSchema>;
