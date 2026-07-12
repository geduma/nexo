import { apiClient } from "../../../services/api/client";
import type { ProductImage } from "../../../types";

export const imageService = {
  listByProduct: async (productId: string): Promise<{ data: ProductImage[] }> => {
    const response = await apiClient.get(`/products/${productId}/images`);
    return response.data;
  },

  upload: async (productId: string, formData: FormData) => {
    const response = await apiClient.post(`/products/${productId}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (productId: string, imageId: string, data: { isPrimary?: boolean; displayOrder?: number }) => {
    const response = await apiClient.put(`/products/${productId}/images/${imageId}`, data);
    return response.data;
  },

  delete: async (productId: string, imageId: string) => {
    return apiClient.delete(`/products/${productId}/images/${imageId}`);
  },
};
