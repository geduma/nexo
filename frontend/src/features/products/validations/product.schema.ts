import { z } from "zod";
import i18n from "i18next";

export const productSchema = z.object({
  categoryId: z.string().uuid(i18n.t("validation.selectCategory")),
  name: z.string().min(1, i18n.t("validation.required")).max(200, i18n.t("validation.maxLength", { max: 200 })),
  description: z.string().optional(),
  priceCost: z.number({ message: i18n.t("validation.required") }).min(0, i18n.t("validation.minValue", { min: 0 })),
  priceSale: z.number({ message: i18n.t("validation.required") }).positive(i18n.t("validation.priceMustBePositive")),
  availabilityStatus: z.enum(["IN_STOCK", "CHECK_SUPPLIER"]),
  supplierInfo: z.string().optional(),
  isFeatured: z.boolean(),
  isVisible: z.boolean(),
});

export type ProductForm = z.infer<typeof productSchema>;
