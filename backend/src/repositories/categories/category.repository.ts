import { supabase } from "../../config/database.js";
import type { CreateCategoryDto, UpdateCategoryDto } from "../../validators/category.validator.js";
import type { PaginationDto } from "../../validators/pagination.validator.js";

function mapCategory(row: Record<string, unknown>) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class CategoryRepository {
  async findAll(pagination: PaginationDto, search?: string) {
    const { page, limit, sortBy, sortOrder } = pagination;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const ascending = sortOrder === "ASC";
    const orderCol = sortBy === "name" ? "name" : "created_at";

    let query = supabase.from("categories").select("*", { count: "exact" });
    if (search) query = query.ilike("name", `%${search}%`);

    const { data, count, error } = await query
      .order(orderCol, { ascending })
      .range(from, to);

    if (error) throw error;

    return {
      data: (data ?? []).map(mapCategory),
      pagination: {
        page,
        limit,
        total: count ?? 0,
        pages: Math.ceil((count ?? 0) / limit),
      },
    };
  }

  async findById(id: string) {
    const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();
    if (error && error.code !== "PGRST116") throw error;
    return data ? mapCategory(data) : null;
  }

  async findByName(name: string) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .ilike("name", name)
      .limit(1)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data ?? null;
  }

  async countProducts(categoryId: string) {
    const { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category_id", categoryId);
    if (error) throw error;
    return count ?? 0;
  }

  async create(data: CreateCategoryDto) {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const { data: result, error } = await supabase
      .from("categories")
      .insert({ name: data.name, description: data.description, slug, is_active: data.isActive })
      .select()
      .single();
    if (error) throw error;
    return mapCategory(result);
  }

  async update(id: string, data: UpdateCategoryDto) {
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.name !== undefined) {
      updateData.name = data.name;
      updateData.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.isActive !== undefined) updateData.is_active = data.isActive;

    const { data: result, error } = await supabase
      .from("categories")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapCategory(result);
  }

  async delete(id: string) {
    const { data, error } = await supabase.from("categories").delete().eq("id", id).select().single();
    if (error) throw error;
    return mapCategory(data);
  }

  async productCountByCategoryId(categoryId: string) {
    return this.countProducts(categoryId);
  }

  async countAll() {
    const { count, error } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count ?? 0;
  }
}

export const categoryRepository = new CategoryRepository();
