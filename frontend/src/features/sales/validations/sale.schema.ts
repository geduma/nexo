import { z } from "zod";
import i18n from "i18next";

export const saleSchema = z.object({
  productId: z.string().uuid(i18n.t("validation.selectProduct")),
  customerName: z.string().min(1, i18n.t("validation.required")).max(150, i18n.t("validation.maxLength", { max: 150 })),
  customerContact: z.string().optional(),
  quantity: z.number({ message: i18n.t("validation.required") }).int(i18n.t("validation.mustBeInteger")).min(1, i18n.t("validation.minQuantity")),
  salePrice: z.number({ message: i18n.t("validation.required") }).positive(i18n.t("validation.priceMustBePositive")),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

export type SaleForm = z.infer<typeof saleSchema>;
