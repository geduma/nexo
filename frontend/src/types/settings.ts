import type { Theme } from "./api";

export interface Settings {
  id: string;
  businessName: string;
  logoUrl: string | null;
  currency: string;
  currencySymbol: string;
  defaultLanguage: string;
  whatsappNumber: string;
  theme: Theme;
  createdAt: string;
  updatedAt: string;
}
