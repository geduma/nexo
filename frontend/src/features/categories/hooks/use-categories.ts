import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { apiClient } from "../../../services/api/client";
import type { Category } from "../../../types";
import type { PaginatedResponse } from "../../../types";

interface CategoryListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export function useCategories(params?: CategoryListParams) {
  return useQuery<PaginatedResponse<Category>>({
    queryKey: ["categories", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", String(params.page));
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.search) searchParams.set("search", params.search);
      if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
      if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);
      const response = await apiClient.get(`/categories?${searchParams}`);
      return response.data;
    },
  });
}

export function useCategory(id: string) {
  return useQuery<{ data: Category }>({
    queryKey: ["categories", id],
    queryFn: async () => {
      const response = await apiClient.get(`/categories/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; description?: string; displayOrder: number; isActive: boolean }) => {
      return apiClient.post("/categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      notifications.show({ message: "Categoría creada", color: "green" });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Category> }) => {
      return apiClient.put(`/categories/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      notifications.show({ message: "Categoría actualizada", color: "green" });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      notifications.show({ message: "Categoría eliminada", color: "green" });
    },
  });
}
