import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Nombre es requerido").max(100, "Máximo 100 caracteres"),
  description: z.string().optional(),
  displayOrder: z.number().int().min(0),
  isActive: z.boolean(),
});

export type CategoryForm = z.infer<typeof categorySchema>;
