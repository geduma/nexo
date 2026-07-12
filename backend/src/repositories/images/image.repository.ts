import { eq, desc, asc, count, and } from "drizzle-orm";
import { db } from "../../config/database.js";
import { productImages } from "../../database/schema/index.js";

export class ImageRepository {
  async findByProduct(productId: string) {
    return db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(asc(productImages.displayOrder));
  }

  async findById(id: string) {
    const result = await db
      .select()
      .from(productImages)
      .where(eq(productImages.id, id))
      .limit(1);
    return result[0] ?? null;
  }

  async getPrimary(productId: string) {
    const result = await db
      .select()
      .from(productImages)
      .where(and(eq(productImages.productId, productId), eq(productImages.isPrimary, true)))
      .limit(1);
    return result[0] ?? null;
  }

  async countByProduct(productId: string) {
    const result = await db
      .select({ value: count() })
      .from(productImages)
      .where(eq(productImages.productId, productId));
    return result[0]?.value ?? 0;
  }

  async create(data: { productId: string; imageUrl: string; displayOrder?: number; isPrimary?: boolean }) {
    const result = await db.insert(productImages).values(data).returning();
    return result[0];
  }

  async update(id: string, data: { displayOrder?: number; isPrimary?: boolean }) {
    const result = await db
      .update(productImages)
      .set(data)
      .where(eq(productImages.id, id))
      .returning();
    return result[0] ?? null;
  }

  async delete(id: string) {
    const result = await db.delete(productImages).where(eq(productImages.id, id)).returning();
    return result[0] ?? null;
  }

  async deleteByProduct(productId: string) {
    return db.delete(productImages).where(eq(productImages.productId, productId));
  }

  async setPrimaryForProduct(productId: string, excludeImageId?: string) {
    const images = await this.findByProduct(productId);
    const target = images.find((img: (typeof images)[number]) => img.id !== excludeImageId);
    if (target) {
      await this.update(target.id, { isPrimary: true });
    }
  }

  async unsetPrimaryForProduct(productId: string) {
    await db
      .update(productImages)
      .set({ isPrimary: false })
      .where(eq(productImages.productId, productId));
  }
}

export const imageRepository = new ImageRepository();
