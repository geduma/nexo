import { supabase } from "../../config/database.js";
import type { UpdateSettingsDto } from "../../validators/settings.validator.js";

export class SettingsRepository {
  async get() {
    const { data, error } = await supabase.from("settings").select("*").limit(1).single();
    if (error && error.code !== "PGRST116") throw error;
    return data ?? null;
  }

  async update(data: UpdateSettingsDto) {
    const current = await this.get();
    if (!current) return null;

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.businessName !== undefined) updateData.business_name = data.businessName;
    if (data.logoUrl !== undefined) updateData.logo_url = data.logoUrl;
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.currencySymbol !== undefined) updateData.currency_symbol = data.currencySymbol;
    if (data.defaultLanguage !== undefined) updateData.default_language = data.defaultLanguage;
    if (data.whatsappNumber !== undefined) updateData.whatsapp_number = data.whatsappNumber;
    if (data.theme !== undefined) updateData.theme = data.theme;

    const { data: result, error } = await supabase
      .from("settings")
      .update(updateData)
      .eq("id", current.id)
      .select()
      .single();
    if (error) throw error;
    return result;
  }

  async create(data: { whatsappNumber: string }) {
    const { data: result, error } = await supabase
      .from("settings")
      .insert({ whatsapp_number: data.whatsappNumber })
      .select()
      .single();
    if (error) throw error;
    return result;
  }
}

export const settingsRepository = new SettingsRepository();
