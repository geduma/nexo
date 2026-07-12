import { apiClient } from "../../../services/api/client";
import type { ManualSale, PaginatedResponse } from "../../../types";

export interface SaleListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export const saleService = {
  list: async (params?: SaleListParams): Promise<PaginatedResponse<ManualSale>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);
    const response = await apiClient.get(`/sales?${searchParams}`);
    return response.data;
  },

  getById: async (id: string): Promise<{ data: ManualSale }> => {
    const response = await apiClient.get(`/sales/${id}`);
    return response.data;
  },

  create: async (data: {
    productId: string;
    customerName: string;
    customerContact?: string;
    quantity: number;
    salePrice: number;
    paymentMethod?: string;
    notes?: string;
  }) => {
    return apiClient.post("/sales", data);
  },

  update: async (id: string, data: Partial<ManualSale>) => {
    return apiClient.put(`/sales/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/sales/${id}`);
  },
};
