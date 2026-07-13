import { z } from "zod";
import i18n from "i18next";

export const categorySchema = z.object({
  name: z.string().min(1, i18n.t("validation.required")).max(100, i18n.t("validation.maxLength", { max: 100 })),
  description: z.string().optional(),
  displayOrder: z.number().int(i18n.t("validation.mustBeInteger")).min(0, i18n.t("validation.minValue", { min: 0 })).optional().default(0),
  isActive: z.boolean(),
});

export type CategoryForm = z.infer<typeof categorySchema>;
