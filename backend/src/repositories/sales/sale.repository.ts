import { supabase } from "../../config/database.js";
import type { CreateSaleDto, UpdateSaleDto } from "../../validators/sale.validator.js";
import type { SaleFilterDto } from "../../validators/pagination.validator.js";

export class SaleRepository {
  async findAll(filters: SaleFilterDto) {
    const { page, limit, sortBy, sortOrder, dateFrom, dateTo, paymentMethod, productId, search } = filters;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const ascending = sortOrder === "ASC";
    const orderCol = sortBy === "sale_date" ? "sale_date" : "created_at";

    let query = supabase
      .from("manual_sales")
      .select("*, products(name)", { count: "exact" });

    if (dateFrom) query = query.gte("sale_date", dateFrom);
    if (dateTo) query = query.lte("sale_date", dateTo + "T23:59:59");
    if (paymentMethod) query = query.eq("payment_method", paymentMethod);
    if (productId) query = query.eq("product_id", productId);
    if (search) query = query.ilike("customer_name", `%${search}%`);

    const { data, count, error } = await query
      .order(orderCol, { ascending })
      .range(from, to);

    if (error) throw error;

    const mapped = (data ?? []).map((s) => ({
      id: s.id,
      productId: s.product_id,
      customerName: s.customer_name,
      customerContact: s.customer_contact,
      quantity: s.quantity,
      salePrice: s.sale_price,
      paymentMethod: s.payment_method,
      notes: s.notes,
      saleDate: s.sale_date,
      createdAt: s.created_at,
      updatedAt: s.updated_at,
      productName: (s.products as { name: string }[] | null)?.[0]?.name ?? null,
    }));

    return {
      data: mapped,
      pagination: {
        page,
        limit,
        total: count ?? 0,
        pages: Math.ceil((count ?? 0) / limit),
      },
    };
  }

  async findById(id: string) {
    const { data, error } = await supabase
      .from("manual_sales")
      .select("*, products(name)")
      .eq("id", id)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    if (!data) return null;

    return {
      id: data.id,
      productId: data.product_id,
      customerName: data.customer_name,
      customerContact: data.customer_contact,
      quantity: data.quantity,
      salePrice: data.sale_price,
      paymentMethod: data.payment_method,
      notes: data.notes,
      saleDate: data.sale_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      productName: (data.products as { name: string }[] | null)?.[0]?.name ?? null,
    };
  }

  async create(data: CreateSaleDto) {
    const { data: result, error } = await supabase
      .from("manual_sales")
      .insert({
        product_id: data.productId,
        customer_name: data.customerName,
        customer_contact: data.customerContact,
        quantity: data.quantity ?? 1,
        sale_price: data.salePrice.toString(),
        payment_method: data.paymentMethod,
        notes: data.notes,
        sale_date: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return result;
  }

  async update(id: string, data: UpdateSaleDto) {
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.productId !== undefined) updateData.product_id = data.productId;
    if (data.customerName !== undefined) updateData.customer_name = data.customerName;
    if (data.customerContact !== undefined) updateData.customer_contact = data.customerContact;
    if (data.quantity !== undefined) updateData.quantity = data.quantity;
    if (data.salePrice !== undefined) updateData.sale_price = data.salePrice.toString();
    if (data.paymentMethod !== undefined) updateData.payment_method = data.paymentMethod;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const { data: result, error } = await supabase
      .from("manual_sales")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return result;
  }

  async delete(id: string) {
    const { data, error } = await supabase.from("manual_sales").delete().eq("id", id).select().single();
    if (error) throw error;
    return data;
  }

  async count() {
    const { count, error } = await supabase
      .from("manual_sales")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count ?? 0;
  }

  async sumRevenue() {
    const { data, error } = await supabase.from("manual_sales").select("sale_price");
    if (error) throw error;
    return (data ?? []).reduce((sum, row) => sum + Number(row.sale_price), 0);
  }

  async averageSale() {
    const { data, error } = await supabase.from("manual_sales").select("sale_price");
    if (error) throw error;
    if (!data || data.length === 0) return 0;
    return data.reduce((sum, row) => sum + Number(row.sale_price), 0) / data.length;
  }

  async topProducts(limit = 10) {
    const { data, error } = await supabase
      .from("manual_sales")
      .select("product_id, quantity, sale_price, products(name)")
      .order("sale_date", { ascending: false });
    if (error) throw error;

    const grouped = new Map<string, { productId: string; productName: string; totalQuantity: number; totalRevenue: number }>();
    for (const row of data ?? []) {
      const pid = row.product_id;
      const existing = grouped.get(pid);
      if (existing) {
        existing.totalQuantity += row.quantity;
        existing.totalRevenue += Number(row.sale_price);
      } else {
        grouped.set(pid, {
          productId: pid,
          productName: (row.products as { name: string }[] | null)?.[0]?.name ?? "Unknown",
          totalQuantity: row.quantity,
          totalRevenue: Number(row.sale_price),
        });
      }
    }

    return Array.from(grouped.values())
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit);
  }

  async dailySales(dateFrom?: string, dateTo?: string) {
    let query = supabase.from("manual_sales").select("sale_date, sale_price");
    if (dateFrom) query = query.gte("sale_date", dateFrom);
    if (dateTo) query = query.lte("sale_date", dateTo + "T23:59:59");

    const { data, error } = await query.order("sale_date", { ascending: false });
    if (error) throw error;

    const grouped = new Map<string, { date: string; revenue: number; count: number }>();
    for (const row of data ?? []) {
      const date = row.sale_date?.substring(0, 10) ?? "unknown";
      const existing = grouped.get(date);
      if (existing) {
        existing.revenue += Number(row.sale_price);
        existing.count += 1;
      } else {
        grouped.set(date, { date, revenue: Number(row.sale_price), count: 1 });
      }
    }

    return Array.from(grouped.values()).sort((a, b) => b.date.localeCompare(a.date));
  }
}

export const saleRepository = new SaleRepository();
