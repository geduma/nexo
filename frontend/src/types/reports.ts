export interface ReportSummary {
  totalRevenue: number;
  totalSales: number;
  averageSale: number;
  topProducts: TopProduct[];
  salesByDay: DailySale[];
}

export interface TopProduct {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface DailySale {
  date: string;
  revenue: number;
  count: number;
}
