import type { Request, Response } from "express";
import { reportService } from "../../services/reports/report.service.js";

export class ReportController {
  async getSummary(req: Request, res: Response): Promise<void> {
    try {
      const dateFrom = req.query.dateFrom as string | undefined;
      const dateTo = req.query.dateTo as string | undefined;
      const summary = await reportService.getSummary(dateFrom, dateTo);
      res.json({ success: true, data: summary });
    } catch (error) {
      const err = error as { statusCode?: number; message: string };
      res.status(err.statusCode ?? 500).json({
        success: false,
        message: err.message,
        errors: [],
      });
    }
  }

  async getTopProducts(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const products = await reportService.getTopProducts(limit);
      res.json({ success: true, data: products });
    } catch (error) {
      const err = error as { statusCode?: number; message: string };
      res.status(err.statusCode ?? 500).json({
        success: false,
        message: err.message,
        errors: [],
      });
    }
  }

  async getDailySales(req: Request, res: Response): Promise<void> {
    try {
      const dateFrom = req.query.dateFrom as string | undefined;
      const dateTo = req.query.dateTo as string | undefined;
      const sales = await reportService.getDailySales(dateFrom, dateTo);
      res.json({ success: true, data: sales });
    } catch (error) {
      const err = error as { statusCode?: number; message: string };
      res.status(err.statusCode ?? 500).json({
        success: false,
        message: err.message,
        errors: [],
      });
    }
  }

  async getDashboard(_req: Request, res: Response): Promise<void> {
    try {
      const data = await reportService.getDashboardData();
      res.json({ success: true, data });
    } catch (error) {
      const err = error as { statusCode?: number; message: string };
      res.status(err.statusCode ?? 500).json({
        success: false,
        message: err.message,
        errors: [],
      });
    }
  }
}

export const reportController = new ReportController();
