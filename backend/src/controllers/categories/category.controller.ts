import type { Request, Response } from "express";
import { categoryService } from "../../services/categories/category.service.js";
import type { CreateCategoryDto, UpdateCategoryDto } from "../../validators/category.validator.js";
import type { PaginationDto } from "../../validators/pagination.validator.js";

export class CategoryController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const pagination = req.query as unknown as PaginationDto;
      const search = req.query.search as string | undefined;
      const result = await categoryService.getAll(pagination, search);
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
      const category = await categoryService.getById(id);
      res.json({ success: true, data: category });
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
      const category = await categoryService.create(req.body as CreateCategoryDto);
      res.status(201).json({ success: true, data: category });
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
      const category = await categoryService.update(id, req.body as UpdateCategoryDto);
      res.json({ success: true, data: category });
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
      await categoryService.delete(id);
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

export const categoryController = new CategoryController();
