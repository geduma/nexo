import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { apiClient } from "../../../services/api/client";
import type { ManualSale, PaginatedResponse } from "../../../types";

interface SaleListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export function useSales(params?: SaleListParams) {
  return useQuery<PaginatedResponse<ManualSale>>({
    queryKey: ["sales", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", String(params.page));
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.search) searchParams.set("search", params.search);
      if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
      if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);
      const response = await apiClient.get(`/sales?${searchParams}`);
      return response.data;
    },
  });
}

export function useSale(id: string) {
  return useQuery<{ data: ManualSale }>({
    queryKey: ["sales", id],
    queryFn: async () => {
      const response = await apiClient.get(`/sales/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      notifications.show({ message: "Venta registrada", color: "green" });
    },
  });
}

export function useUpdateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ManualSale> }) => {
      return apiClient.put(`/sales/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      notifications.show({ message: "Venta actualizada", color: "green" });
    },
  });
}

export function useDeleteSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/sales/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      notifications.show({ message: "Venta eliminada", color: "green" });
    },
  });
}
