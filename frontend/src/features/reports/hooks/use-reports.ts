import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../services/api/client";
import type { ReportSummary, TopProduct, DailySale } from "../../../types";

interface DateRange {
  from?: string;
  to?: string;
}

export function useReportSummary(dateRange?: DateRange) {
  return useQuery<ReportSummary>({
    queryKey: ["reports", "summary", dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateRange?.from) params.set("from", dateRange.from);
      if (dateRange?.to) params.set("to", dateRange.to);
      const response = await apiClient.get(`/reports/summary?${params}`);
      return response.data.data;
    },
  });
}

export function useTopProducts(dateRange?: DateRange) {
  return useQuery<TopProduct[]>({
    queryKey: ["reports", "top-products", dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateRange?.from) params.set("from", dateRange.from);
      if (dateRange?.to) params.set("to", dateRange.to);
      const response = await apiClient.get(`/reports/top-products?${params}`);
      return response.data.data;
    },
  });
}

export function useDailySales(dateRange?: DateRange) {
  return useQuery<DailySale[]>({
    queryKey: ["reports", "daily-sales", dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateRange?.from) params.set("from", dateRange.from);
      if (dateRange?.to) params.set("to", dateRange.to);
      const response = await apiClient.get(`/reports/daily-sales?${params}`);
      return response.data.data;
    },
  });
}

export function useDashboardData() {
  return useQuery<{
    totalProducts: number;
    visibleProducts: number;
    totalCategories: number;
    totalSales: number;
    totalRevenue: number;
    averageSale: number;
    salesByDay: Array<{ date: string; revenue: number; count: number }>;
    topProducts: Array<{ productName: string; totalQuantity: number; totalRevenue: number }>;
    recentSales: Array<Record<string, unknown>>;
  }>({
    queryKey: ["reports", "dashboard"],
    queryFn: async () => {
      const response = await apiClient.get("/reports/dashboard");
      return response.data.data;
    },
  });
}
