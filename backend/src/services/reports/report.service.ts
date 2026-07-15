import { saleRepository } from "../../repositories/sales/sale.repository.js";
import { productRepository } from "../../repositories/products/product.repository.js";
import { categoryRepository } from "../../repositories/categories/category.repository.js";

export class ReportService {
  async getSummary(dateFrom?: string, dateTo?: string) {
    const [totalRevenue, totalSales, averageSale, topProducts, salesByDay] = await Promise.all([
      saleRepository.sumRevenue(),
      saleRepository.count(),
      saleRepository.averageSale(),
      saleRepository.topProducts(5),
      saleRepository.dailySales(dateFrom, dateTo),
    ]);

    return {
      totalRevenue,
      totalSales,
      averageSale,
      topProducts,
      salesByDay,
    };
  }

  async getTopProducts(limit = 10) {
    return saleRepository.topProducts(limit);
  }

  async getDailySales(dateFrom?: string, dateTo?: string) {
    return saleRepository.dailySales(dateFrom, dateTo);
  }

  async getDashboardData() {
    const [totalProducts, visibleProducts, totalCategories, totalRevenue, totalSales, recentSales, topProducts] =
      await Promise.all([
        productRepository.count(),
        productRepository.countVisible(),
        categoryRepository.countAll(),
        saleRepository.sumRevenue(),
        saleRepository.count(),
        saleRepository.findAll({ page: 1, limit: 5, sortBy: "sale_date", sortOrder: "DESC" }),
        saleRepository.topProducts(5),
      ]);

    return {
      totalProducts,
      visibleProducts,
      totalCategories,
      totalRevenue,
      totalSales,
      recentSales: recentSales.data,
      topProducts,
    };
  }
}

export const reportService = new ReportService();
