import { apiClient } from "../../../services/api/client";
import type { Category } from "../../../types";
import type { PaginatedResponse } from "../../../types";

export interface CategoryListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export const categoryService = {
  list: async (params?: CategoryListParams): Promise<PaginatedResponse<Category>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);
    const response = await apiClient.get(`/categories?${searchParams}`);
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Category }> => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data: { name: string; description?: string; isActive: boolean }) => {
    return apiClient.post("/categories", data);
  },

  update: async (id: string, data: Partial<Category>) => {
    return apiClient.put(`/categories/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/categories/${id}`);
  },
};
