import { z } from "zod";
import i18n from "i18next";

export const categorySchema = z.object({
  name: z.string().min(1, i18n.t("validation.required")).max(100, i18n.t("validation.maxLength", { max: 100 })),
  description: z.string().optional(),
  isActive: z.boolean(),
});

export type CategoryForm = z.infer<typeof categorySchema>;
