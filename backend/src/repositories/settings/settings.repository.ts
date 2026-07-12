import { eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { settings } from "../../database/schema/index.js";
import type { UpdateSettingsDto } from "../../validators/settings.validator.js";

export class SettingsRepository {
  async get() {
    const result = await db.select().from(settings).limit(1);
    return result[0] ?? null;
  }

  async update(data: UpdateSettingsDto) {
    const current = await this.get();
    if (!current) return null;

    const result = await db
      .update(settings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(settings.id, current.id))
      .returning();
    return result[0] ?? null;
  }

  async create(data: { whatsappNumber: string }) {
    const result = await db.insert(settings).values(data).returning();
    return result[0];
  }
}

export const settingsRepository = new SettingsRepository();
