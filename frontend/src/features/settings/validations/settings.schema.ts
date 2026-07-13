import { z } from "zod";
import i18n from "i18next";

export const settingsSchema = z.object({
  businessName: z.string().min(1, i18n.t("validation.required")),
  currency: z.string().min(1, i18n.t("validation.required")),
  currencySymbol: z.string().min(1, i18n.t("validation.required")),
  defaultLanguage: z.enum(["es", "en"]),
  whatsappNumber: z.string().min(1, i18n.t("validation.required")),
  theme: z.enum(["light", "dark", "system"]),
});

export type SettingsForm = z.infer<typeof settingsSchema>;
