import { eq, ilike, desc, asc, count, and, SQL } from "drizzle-orm";
import { db } from "../../config/database.js";
import { products, categories, productImages } from "../../database/schema/index.js";
import type { CreateProductDto, UpdateProductDto } from "../../validators/product.validator.js";
import type { ProductFilterDto } from "../../validators/pagination.validator.js";

export class ProductRepository {
  async findAll(filters: ProductFilterDto) {
    const { page, limit, sortBy, sortOrder, category, featured, availability, search, visible } = filters;
    const offset = (page - 1) * limit;

    const orderFn = sortOrder === "ASC" ? asc : desc;
    const sortColumn = sortBy === "name" ? products.name : products.createdAt;

    const conditions: SQL[] = [];
    if (visible !== undefined) conditions.push(eq(products.isVisible, visible));
    if (category) conditions.push(eq(products.categoryId, category));
    if (featured !== undefined) conditions.push(eq(products.isFeatured, featured));
    if (availability) conditions.push(eq(products.availabilityStatus, availability));
    if (search) {
      conditions.push(ilike(products.name, `%${search}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, totalResult] = await Promise.all([
      db
        .select({
          id: products.id,
          categoryId: products.categoryId,
          name: products.name,
          description: products.description,
          priceCost: products.priceCost,
          priceSale: products.priceSale,
          availabilityStatus: products.availabilityStatus,
          supplierInfo: products.supplierInfo,
          isFeatured: products.isFeatured,
          isVisible: products.isVisible,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
          categoryName: categories.name,
          categorySlug: categories.slug,
          primaryImageUrl: productImages.imageUrl,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(productImages, and(eq(productImages.productId, products.id), eq(productImages.isPrimary, true)))
        .where(whereClause)
        .orderBy(orderFn(sortColumn))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(products).where(whereClause),
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
    const result = await db
      .select({
        id: products.id,
        categoryId: products.categoryId,
        name: products.name,
        description: products.description,
        priceCost: products.priceCost,
        priceSale: products.priceSale,
        availabilityStatus: products.availabilityStatus,
        supplierInfo: products.supplierInfo,
        isFeatured: products.isFeatured,
        isVisible: products.isVisible,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id))
      .limit(1);

    return result[0] ?? null;
  }

  async create(data: CreateProductDto) {
    const result = await db.insert(products).values({
      ...data,
      priceCost: data.priceCost.toString(),
      priceSale: data.priceSale.toString(),
    }).returning();
    return result[0];
  }

  async update(id: string, data: UpdateProductDto) {
    const updateData: Record<string, unknown> = { ...data, updatedAt: new Date() };
    if (data.priceCost !== undefined) updateData.priceCost = data.priceCost.toString();
    if (data.priceSale !== undefined) updateData.priceSale = data.priceSale.toString();
    const result = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return result[0] ?? null;
  }

  async delete(id: string) {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result[0] ?? null;
  }

  async count() {
    const result = await db.select({ value: count() }).from(products);
    return result[0]?.value ?? 0;
  }

  async countVisible() {
    const result = await db
      .select({ value: count() })
      .from(products)
      .where(eq(products.isVisible, true));
    return result[0]?.value ?? 0;
  }

  async countFeatured() {
    const result = await db
      .select({ value: count() })
      .from(products)
      .where(eq(products.isFeatured, true));
    return result[0]?.value ?? 0;
  }

  async search(query: string) {
    return db
      .select({
        id: products.id,
        name: products.name,
        priceSale: products.priceSale,
        categoryName: categories.name,
        primaryImageUrl: productImages.imageUrl,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(productImages, and(eq(productImages.productId, products.id), eq(productImages.isPrimary, true)))
      .where(
        and(
          eq(products.isVisible, true),
          ilike(products.name, `%${query}%`)
        )
      )
      .limit(20);
  }
}

export const productRepository = new ProductRepository();
