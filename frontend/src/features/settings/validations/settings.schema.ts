import { z } from "zod";

export const settingsSchema = z.object({
  businessName: z.string().min(1, "Nombre del negocio es requerido"),
  currency: z.string().min(1, "Moneda es requerida"),
  currencySymbol: z.string().min(1, "Símbolo es requerido"),
  defaultLanguage: z.enum(["es", "en"]),
  whatsappNumber: z.string().min(1, "Número de WhatsApp es requerido"),
  theme: z.enum(["light", "dark", "system"]),
});

export type SettingsForm = z.infer<typeof settingsSchema>;
