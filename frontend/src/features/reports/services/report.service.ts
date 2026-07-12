import { apiClient } from "../../../services/api/client";
import type { ReportSummary, TopProduct, DailySale } from "../../../types";

interface DateRange {
  from?: string;
  to?: string;
}

export const reportService = {
  getSummary: async (dateRange?: DateRange): Promise<ReportSummary> => {
    const params = new URLSearchParams();
    if (dateRange?.from) params.set("from", dateRange.from);
    if (dateRange?.to) params.set("to", dateRange.to);
    const response = await apiClient.get(`/reports/summary?${params}`);
    return response.data.data;
  },

  getTopProducts: async (dateRange?: DateRange): Promise<TopProduct[]> => {
    const params = new URLSearchParams();
    if (dateRange?.from) params.set("from", dateRange.from);
    if (dateRange?.to) params.set("to", dateRange.to);
    const response = await apiClient.get(`/reports/top-products?${params}`);
    return response.data.data;
  },

  getDailySales: async (dateRange?: DateRange): Promise<DailySale[]> => {
    const params = new URLSearchParams();
    if (dateRange?.from) params.set("from", dateRange.from);
    if (dateRange?.to) params.set("to", dateRange.to);
    const response = await apiClient.get(`/reports/daily-sales?${params}`);
    return response.data.data;
  },
};
