import { apiClient } from "../../../services/api/client";
import type { Product, PaginatedResponse } from "../../../types";

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  availability?: string;
  visible?: boolean;
  featured?: boolean;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export const productService = {
  list: async (params?: ProductListParams): Promise<PaginatedResponse<Product>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.category) searchParams.set("category", params.category);
    if (params?.availability) searchParams.set("availability", params.availability);
    if (params?.visible !== undefined) searchParams.set("visible", String(params.visible));
    if (params?.featured !== undefined) searchParams.set("featured", String(params.featured));
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);
    const response = await apiClient.get(`/products?${searchParams}`);
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Product }> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  create: async (data: Product) => {
    return apiClient.post("/products", data);
  },

  update: async (id: string, data: Partial<Product>) => {
    return apiClient.put(`/products/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/products/${id}`);
  },

  getRelated: async (id: string): Promise<{ data: Product[] }> => {
    const response = await apiClient.get(`/products/${id}/related`);
    return response.data;
  },
};
