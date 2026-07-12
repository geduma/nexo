import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  sortBy: z.string().optional().default("created_at"),
  sortOrder: z.enum(["ASC", "DESC"]).optional().default("DESC"),
});

export const productFilterSchema = paginationSchema.extend({
  category: z.string().uuid().optional(),
  featured: z.coerce.boolean().optional(),
  availability: z.enum(["IN_STOCK", "CHECK_SUPPLIER"]).optional(),
  search: z.string().optional(),
  visible: z.coerce.boolean().optional(),
});

export const saleFilterSchema = paginationSchema.extend({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  paymentMethod: z.string().optional(),
  productId: z.string().uuid().optional(),
  search: z.string().optional(),
});

export type PaginationDto = z.infer<typeof paginationSchema>;
export type ProductFilterDto = z.infer<typeof productFilterSchema>;
export type SaleFilterDto = z.infer<typeof saleFilterSchema>;
