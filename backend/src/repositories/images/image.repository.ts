import { supabase } from "../../config/database.js";

export class ImageRepository {
  async findByProduct(productId: string) {
    const { data, error } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  async findById(id: string) {
    const { data, error } = await supabase
      .from("product_images")
      .select("*")
      .eq("id", id)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data ?? null;
  }

  async getPrimary(productId: string) {
    const { data, error } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .eq("is_primary", true)
      .limit(1)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data ?? null;
  }

  async countByProduct(productId: string) {
    const { count, error } = await supabase
      .from("product_images")
      .select("*", { count: "exact", head: true })
      .eq("product_id", productId);
    if (error) throw error;
    return count ?? 0;
  }

  async create(data: { productId: string; imageUrl: string; displayOrder?: number; isPrimary?: boolean }) {
    const { data: result, error } = await supabase
      .from("product_images")
      .insert({
        product_id: data.productId,
        image_url: data.imageUrl,
        display_order: data.displayOrder ?? 0,
        is_primary: data.isPrimary ?? false,
      })
      .select()
      .single();
    if (error) throw error;
    return result;
  }

  async update(id: string, data: { displayOrder?: number; isPrimary?: boolean }) {
    const updateData: Record<string, unknown> = {};
    if (data.displayOrder !== undefined) updateData.display_order = data.displayOrder;
    if (data.isPrimary !== undefined) updateData.is_primary = data.isPrimary;

    const { data: result, error } = await supabase
      .from("product_images")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return result;
  }

  async delete(id: string) {
    const { data, error } = await supabase.from("product_images").delete().eq("id", id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteByProduct(productId: string) {
    const { error } = await supabase.from("product_images").delete().eq("product_id", productId);
    if (error) throw error;
  }

  async setPrimaryForProduct(productId: string, excludeImageId?: string) {
    const images = await this.findByProduct(productId);
    const target = images.find((img) => img.id !== excludeImageId);
    if (target) {
      await this.update(target.id, { isPrimary: true });
    }
  }

  async unsetPrimaryForProduct(productId: string) {
    const { error } = await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);
    if (error) throw error;
  }
}

export const imageRepository = new ImageRepository();
