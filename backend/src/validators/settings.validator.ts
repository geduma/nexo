import { z } from "zod";

export const updateSettingsSchema = z.object({
  businessName: z.string().min(1).optional(),
  logoUrl: z.string().url().optional().nullable(),
  currency: z.string().min(1).optional(),
  currencySymbol: z.string().min(1).optional(),
  defaultLanguage: z.enum(["es", "en"]).optional(),
  whatsappNumber: z.string().min(1).optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
});

export type UpdateSettingsDto = z.infer<typeof updateSettingsSchema>;
