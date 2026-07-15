import type { Request, Response } from "express";
import { reportService } from "../../services/reports/report.service.js";

export class ReportController {
  async getSummary(req: Request, res: Response): Promise<void> {
    const dateFrom = req.query.dateFrom as string | undefined;
    const dateTo = req.query.dateTo as string | undefined;
    const summary = await reportService.getSummary(dateFrom, dateTo);
    res.json({ success: true, data: summary });
  }

  async getTopProducts(req: Request, res: Response): Promise<void> {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const products = await reportService.getTopProducts(limit);
    res.json({ success: true, data: products });
  }

  async getDailySales(req: Request, res: Response): Promise<void> {
    const dateFrom = req.query.dateFrom as string | undefined;
    const dateTo = req.query.dateTo as string | undefined;
    const sales = await reportService.getDailySales(dateFrom, dateTo);
    res.json({ success: true, data: sales });
  }

  async getDashboard(_req: Request, res: Response): Promise<void> {
    const data = await reportService.getDashboardData();
    res.json({ success: true, data });
  }
}

export const reportController = new ReportController();
