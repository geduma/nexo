import { eq, desc, asc, count, and, SQL, sql, ilike } from "drizzle-orm";
import { db } from "../../config/database.js";
import { manualSales, products } from "../../database/schema/index.js";
import type { CreateSaleDto, UpdateSaleDto } from "../../validators/sale.validator.js";
import type { SaleFilterDto } from "../../validators/pagination.validator.js";

export class SaleRepository {
  async findAll(filters: SaleFilterDto) {
    const { page, limit, sortBy, sortOrder, dateFrom, dateTo, paymentMethod, productId, search } = filters;
    const offset = (page - 1) * limit;

    const orderFn = sortOrder === "ASC" ? asc : desc;
    const sortColumn = sortBy === "sale_date" ? manualSales.saleDate : manualSales.createdAt;

    const conditions: SQL[] = [];
    if (dateFrom) conditions.push(sql`${manualSales.saleDate} >= ${new Date(dateFrom)}`);
    if (dateTo) conditions.push(sql`${manualSales.saleDate} <= ${new Date(dateTo)}`);
    if (paymentMethod) conditions.push(eq(manualSales.paymentMethod, paymentMethod));
    if (productId) conditions.push(eq(manualSales.productId, productId));
    if (search) conditions.push(ilike(manualSales.customerName, `%${search}%`));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, totalResult] = await Promise.all([
      db
        .select({
          id: manualSales.id,
          productId: manualSales.productId,
          customerName: manualSales.customerName,
          customerContact: manualSales.customerContact,
          quantity: manualSales.quantity,
          salePrice: manualSales.salePrice,
          paymentMethod: manualSales.paymentMethod,
          notes: manualSales.notes,
          saleDate: manualSales.saleDate,
          createdAt: manualSales.createdAt,
          updatedAt: manualSales.updatedAt,
          productName: products.name,
        })
        .from(manualSales)
        .leftJoin(products, eq(manualSales.productId, products.id))
        .where(whereClause)
        .orderBy(orderFn(sortColumn))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(manualSales).where(whereClause),
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
        id: manualSales.id,
        productId: manualSales.productId,
        customerName: manualSales.customerName,
        customerContact: manualSales.customerContact,
        quantity: manualSales.quantity,
        salePrice: manualSales.salePrice,
        paymentMethod: manualSales.paymentMethod,
        notes: manualSales.notes,
        saleDate: manualSales.saleDate,
        createdAt: manualSales.createdAt,
        updatedAt: manualSales.updatedAt,
        productName: products.name,
      })
      .from(manualSales)
      .leftJoin(products, eq(manualSales.productId, products.id))
      .where(eq(manualSales.id, id))
      .limit(1);

    return result[0] ?? null;
  }

  async create(data: CreateSaleDto) {
    const result = await db.insert(manualSales).values({
      ...data,
      salePrice: data.salePrice.toString(),
    }).returning();
    return result[0];
  }

  async update(id: string, data: UpdateSaleDto) {
    const updateData: Record<string, unknown> = { ...data, updatedAt: new Date() };
    if (data.salePrice !== undefined) updateData.salePrice = data.salePrice.toString();
    const result = await db
      .update(manualSales)
      .set(updateData)
      .where(eq(manualSales.id, id))
      .returning();
    return result[0] ?? null;
  }

  async delete(id: string) {
    const result = await db.delete(manualSales).where(eq(manualSales.id, id)).returning();
    return result[0] ?? null;
  }

  async count() {
    const result = await db.select({ value: count() }).from(manualSales);
    return result[0]?.value ?? 0;
  }

  async sumRevenue() {
    const result = await db
      .select({ value: sql<number>`COALESCE(SUM(CAST(${manualSales.salePrice} AS NUMERIC)), 0)` })
      .from(manualSales);
    return result[0]?.value ?? 0;
  }

  async averageSale() {
    const result = await db
      .select({ value: sql<number>`COALESCE(AVG(CAST(${manualSales.salePrice} AS NUMERIC)), 0)` })
      .from(manualSales);
    return result[0]?.value ?? 0;
  }

  async topProducts(limit = 10) {
    return db
      .select({
        productId: manualSales.productId,
        productName: products.name,
        totalQuantity: sql<number>`SUM(${manualSales.quantity})`,
        totalRevenue: sql<number>`SUM(CAST(${manualSales.salePrice} AS NUMERIC))`,
      })
      .from(manualSales)
      .innerJoin(products, eq(manualSales.productId, products.id))
      .groupBy(manualSales.productId, products.name)
      .orderBy(desc(sql`SUM(${manualSales.quantity})`))
      .limit(limit);
  }

  async dailySales(dateFrom?: string, dateTo?: string) {
    const conditions: SQL[] = [];
    if (dateFrom) conditions.push(sql`${manualSales.saleDate} >= ${new Date(dateFrom)}`);
    if (dateTo) conditions.push(sql`${manualSales.saleDate} <= ${new Date(dateTo)}`);

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    return db
      .select({
        date: sql<string>`DATE(${manualSales.saleDate})`,
        revenue: sql<number>`SUM(CAST(${manualSales.salePrice} AS NUMERIC))`,
        count: count(),
      })
      .from(manualSales)
      .where(whereClause)
      .groupBy(sql`DATE(${manualSales.saleDate})`)
      .orderBy(desc(sql`DATE(${manualSales.saleDate})`));
  }
}

export const saleRepository = new SaleRepository();
