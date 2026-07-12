import { eq, ilike, desc, asc, count, sql } from "drizzle-orm";
import { db } from "../../config/database.js";
import { categories, products } from "../../database/schema/index.js";
import type { CreateCategoryDto, UpdateCategoryDto } from "../../validators/category.validator.js";
import type { PaginationDto } from "../../validators/pagination.validator.js";

export class CategoryRepository {
  async findAll(pagination: PaginationDto, search?: string) {
    const { page, limit, sortBy, sortOrder } = pagination;
    const offset = (page - 1) * limit;

    const orderFn = sortOrder === "ASC" ? asc : desc;
    const sortColumn = sortBy === "display_order" ? categories.displayOrder : categories.createdAt;

    let whereClause = undefined;
    if (search) {
      whereClause = ilike(categories.name, `%${search}%`);
    }

    const [data, totalResult] = await Promise.all([
      db
        .select()
        .from(categories)
        .where(whereClause)
        .orderBy(orderFn(sortColumn))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(categories).where(whereClause),
    ]);

    const total = totalResult[0]?.value ?? 0;

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return result[0] ?? null;
  }

  async findByName(name: string) {
    const result = await db
      .select()
      .from(categories)
      .where(ilike(categories.name, name))
      .limit(1);
    return result[0] ?? null;
  }

  async countProducts(categoryId: string) {
    const result = await db
      .select({ value: count() })
      .from(products)
      .where(eq(products.categoryId, categoryId));
    return result[0]?.value ?? 0;
  }

  async create(data: CreateCategoryDto) {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const result = await db
      .insert(categories)
      .values({ ...data, slug })
      .returning();
    return result[0];
  }

  async update(id: string, data: UpdateCategoryDto) {
    const updateData: Record<string, unknown> = { ...data, updatedAt: new Date() };

    if (data.name) {
      updateData.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    const result = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();
    return result[0] ?? null;
  }

  async delete(id: string) {
    const result = await db.delete(categories).where(eq(categories.id, id)).returning();
    return result[0] ?? null;
  }

  async productCountByCategoryId(categoryId: string) {
    const result = await db
      .select({ value: count() })
      .from(products)
      .where(eq(products.categoryId, categoryId));
    return result[0]?.value ?? 0;
  }

  async countAll() {
    const result = await db.select({ value: count() }).from(categories);
    return result[0]?.value ?? 0;
  }
}

export const categoryRepository = new CategoryRepository();
