import { settingsRepository } from "../../repositories/settings/settings.repository.js";
import type { UpdateSettingsDto } from "../../validators/settings.validator.js";

export class SettingsService {
  async get() {
    let settings = await settingsRepository.get();
    if (!settings) {
      settings = await settingsRepository.create({ whatsappNumber: "" }) ?? null;
    }
    return settings ?? null;
  }

  async update(data: UpdateSettingsDto) {
    const current = await settingsRepository.get();
    if (!current) {
      return settingsRepository.create({ whatsappNumber: data.whatsappNumber ?? "" });
    }
    return settingsRepository.update(data);
  }
}

export const settingsService = new SettingsService();
