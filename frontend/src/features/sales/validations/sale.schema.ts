import { z } from "zod";

export const saleSchema = z.object({
  productId: z.string().uuid("Selecciona un producto"),
  customerName: z.string().min(1, "Nombre del cliente es requerido").max(150, "Máximo 150 caracteres"),
  customerContact: z.string().optional(),
  quantity: z.number().int().min(1, "Mínimo 1 unidad"),
  salePrice: z.number().positive("Precio debe ser mayor a 0"),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

export type SaleForm = z.infer<typeof saleSchema>;
