import type { Request, Response } from "express";
import { saleService } from "../../services/sales/sale.service.js";
import type { CreateSaleDto, UpdateSaleDto } from "../../validators/sale.validator.js";
import type { SaleFilterDto } from "../../validators/pagination.validator.js";

export class SaleController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query as unknown as SaleFilterDto;
      const result = await saleService.getAll(filters);
      res.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (error) {
      const err = error as { statusCode?: number; message: string };
      res.status(err.statusCode ?? 500).json({
        success: false,
        message: err.message,
        errors: [],
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const sale = await saleService.getById(id);
      res.json({ success: true, data: sale });
    } catch (error) {
      const err = error as { statusCode?: number; message: string };
      res.status(err.statusCode ?? 500).json({
        success: false,
        message: err.message,
        errors: [],
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const sale = await saleService.create(req.body as CreateSaleDto);
      res.status(201).json({ success: true, data: sale });
    } catch (error) {
      const err = error as { statusCode?: number; message: string };
      res.status(err.statusCode ?? 500).json({
        success: false,
        message: err.message,
        errors: [],
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const sale = await saleService.update(id, req.body as UpdateSaleDto);
      res.json({ success: true, data: sale });
    } catch (error) {
      const err = error as { statusCode?: number; message: string };
      res.status(err.statusCode ?? 500).json({
        success: false,
        message: err.message,
        errors: [],
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      await saleService.delete(id);
      res.status(204).send();
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

export const saleController = new SaleController();
