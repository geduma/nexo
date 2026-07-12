import { supabase } from "../../config/database.js";
import type { CreateProductDto, UpdateProductDto } from "../../validators/product.validator.js";
import type { ProductFilterDto } from "../../validators/pagination.validator.js";

export class ProductRepository {
  async findAll(filters: ProductFilterDto) {
    const { page, limit, sortBy, sortOrder, category, featured, availability, search, visible } = filters;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const ascending = sortOrder === "ASC";
    const orderCol = sortBy === "name" ? "name" : "created_at";

    let query = supabase
      .from("products")
      .select("*, categories(name, slug), product_images(image_url, is_primary)", { count: "exact" });

    if (visible !== undefined) query = query.eq("is_visible", visible);
    if (category) query = query.eq("category_id", category);
    if (featured !== undefined) query = query.eq("is_featured", featured);
    if (availability) query = query.eq("availability_status", availability);
    if (search) query = query.ilike("name", `%${search}%`);

    const { data, count, error } = await query
      .order(orderCol, { ascending })
      .range(from, to);

    if (error) throw error;

    const mapped = (data ?? []).map((p) => ({
      id: p.id,
      categoryId: p.category_id,
      name: p.name,
      description: p.description,
      priceCost: p.price_cost,
      priceSale: p.price_sale,
      availabilityStatus: p.availability_status,
      supplierInfo: p.supplier_info,
      isFeatured: p.is_featured,
      isVisible: p.is_visible,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      categoryName: (p.categories as { name: string }[] | null)?.[0]?.name ?? null,
      categorySlug: (p.categories as { slug: string }[] | null)?.[0]?.slug ?? null,
      primaryImageUrl: (p.product_images as { image_url: string; is_primary: boolean }[] | null)?.find((img) => img.is_primary)?.image_url ?? null,
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
      .from("products")
      .select("*, categories(name, slug)")
      .eq("id", id)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    if (!data) return null;

    return {
      id: data.id,
      categoryId: data.category_id,
      name: data.name,
      description: data.description,
      priceCost: data.price_cost,
      priceSale: data.price_sale,
      availabilityStatus: data.availability_status,
      supplierInfo: data.supplier_info,
      isFeatured: data.is_featured,
      isVisible: data.is_visible,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      categoryName: (data.categories as { name: string }[] | null)?.[0]?.name ?? null,
      categorySlug: (data.categories as { slug: string }[] | null)?.[0]?.slug ?? null,
    };
  }

  async create(data: CreateProductDto) {
    const { data: result, error } = await supabase
      .from("products")
      .insert({
        category_id: data.categoryId,
        name: data.name,
        description: data.description,
        price_cost: data.priceCost.toString(),
        price_sale: data.priceSale.toString(),
        availability_status: data.availabilityStatus,
        supplier_info: data.supplierInfo,
        is_featured: data.isFeatured ?? false,
        is_visible: data.isVisible ?? true,
      })
      .select()
      .single();
    if (error) throw error;
    return result;
  }

  async update(id: string, data: UpdateProductDto) {
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.categoryId !== undefined) updateData.category_id = data.categoryId;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.priceCost !== undefined) updateData.price_cost = data.priceCost.toString();
    if (data.priceSale !== undefined) updateData.price_sale = data.priceSale.toString();
    if (data.availabilityStatus !== undefined) updateData.availability_status = data.availabilityStatus;
    if (data.supplierInfo !== undefined) updateData.supplier_info = data.supplierInfo;
    if (data.isFeatured !== undefined) updateData.is_featured = data.isFeatured;
    if (data.isVisible !== undefined) updateData.is_visible = data.isVisible;

    const { data: result, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return result;
  }

  async delete(id: string) {
    const { data, error } = await supabase.from("products").delete().eq("id", id).select().single();
    if (error) throw error;
    return data;
  }

  async count() {
    const { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count ?? 0;
  }

  async countVisible() {
    const { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_visible", true);
    if (error) throw error;
    return count ?? 0;
  }

  async countFeatured() {
    const { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_featured", true);
    if (error) throw error;
    return count ?? 0;
  }

  async search(query: string) {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, price_sale, categories(name), product_images(image_url, is_primary)")
      .eq("is_visible", true)
      .ilike("name", `%${query}%`)
      .limit(20);
    if (error) throw error;

    return (data ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      priceSale: p.price_sale,
      categoryName: (p.categories as { name: string }[] | null)?.[0]?.name ?? null,
      primaryImageUrl: (p.product_images as { image_url: string; is_primary: boolean }[] | null)?.find((img) => img.is_primary)?.image_url ?? null,
    }));
  }
}

export const productRepository = new ProductRepository();
