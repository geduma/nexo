import { z } from "zod";

export const productSchema = z.object({
  categoryId: z.string().uuid("Selecciona una categoría"),
  name: z.string().min(1, "Nombre es requerido").max(200, "Máximo 200 caracteres"),
  description: z.string().optional(),
  priceCost: z.number().min(0, "Precio costo debe ser >= 0"),
  priceSale: z.number().positive("Precio venta debe ser mayor a 0"),
  availabilityStatus: z.enum(["IN_STOCK", "CHECK_SUPPLIER"]),
  supplierInfo: z.string().optional(),
  isFeatured: z.boolean(),
  isVisible: z.boolean(),
});

export type ProductForm = z.infer<typeof productSchema>;
