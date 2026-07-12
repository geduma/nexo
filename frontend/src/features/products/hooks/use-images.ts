import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { apiClient } from "../../../services/api/client";
import type { ProductImage } from "../../../types";

export function useProductImages(productId: string) {
  return useQuery<{ data: ProductImage[] }>({
    queryKey: ["product-images", productId],
    queryFn: async () => {
      const response = await apiClient.get(`/products/${productId}/images`);
      return response.data;
    },
    enabled: !!productId,
  });
}

export function useUploadImage(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      return apiClient.post(`/products/${productId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-images", productId] });
      notifications.show({ message: "Imagen subida", color: "green" });
    },
  });
}

export function useDeleteImage(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: string) => {
      return apiClient.delete(`/products/${productId}/images/${imageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-images", productId] });
      notifications.show({ message: "Imagen eliminada", color: "green" });
    },
  });
}

export function useSetPrimaryImage(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: string) => {
      return apiClient.put(`/products/${productId}/images/${imageId}`, { isPrimary: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-images", productId] });
    },
  });
}
