import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { apiClient } from "../../../services/api/client";
import type { Product, PaginatedResponse } from "../../../types";

interface ProductListParams {
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

export function useProducts(params?: ProductListParams) {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: ["products", params],
    queryFn: async () => {
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
  });
}

export function useProduct(id: string) {
  return useQuery<{ data: Product }>({
    queryKey: ["products", id],
    queryFn: async () => {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Product) => {
      return apiClient.post("/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      notifications.show({ message: "Producto creado", color: "green" });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Product> }) => {
      return apiClient.put(`/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      notifications.show({ message: "Producto actualizado", color: "green" });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      notifications.show({ message: "Producto eliminado", color: "green" });
    },
  });
}
