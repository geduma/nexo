import { settingsRepository } from "../../repositories/settings/settings.repository.js";
import type { UpdateSettingsDto } from "../../validators/settings.validator.js";

export class SettingsService {
  private defaultSettings = {
    id: "",
    businessName: "",
    logoUrl: null as string | null,
    currency: "COP",
    currencySymbol: "$",
    defaultLanguage: "en",
    whatsappNumber: "",
    theme: "system" as string,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  async get() {
    const settings = await settingsRepository.get();
    return settings ?? this.defaultSettings;
  }

  async update(data: UpdateSettingsDto) {
    const current = await settingsRepository.get();
    if (!current) {
      const created = await settingsRepository.create({ whatsappNumber: data.whatsappNumber ?? "" });
      if (!created) return { ...this.defaultSettings, ...data };
      return created;
    }
    return settingsRepository.update(data);
  }
}

export const settingsService = new SettingsService();
