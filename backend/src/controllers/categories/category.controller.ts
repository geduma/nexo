import type { Request, Response } from "express";
import { categoryService } from "../../services/categories/category.service.js";
import type { CreateCategoryDto, UpdateCategoryDto } from "../../validators/category.validator.js";
import type { PaginationDto } from "../../validators/pagination.validator.js";

export class CategoryController {
  async getAll(req: Request, res: Response): Promise<void> {
    const rawQuery = req.query as Record<string, unknown>;
    const pagination: PaginationDto = {
      page: Number(rawQuery.page) || 1,
      limit: Number(rawQuery.limit) || 20,
      sortBy: (rawQuery.sortBy as string) || "created_at",
      sortOrder: (rawQuery.sortOrder as "ASC" | "DESC") === "ASC" ? "ASC" : "DESC",
    };
    const search = rawQuery.search as string | undefined;
    const result = await categoryService.getAll(pagination, search);
    res.json({ success: true, data: result.data, pagination: result.pagination });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const category = await categoryService.getById(id);
    res.json({ success: true, data: category });
  }

  async create(req: Request, res: Response): Promise<void> {
    const category = await categoryService.create(req.body as CreateCategoryDto);
    res.status(201).json({ success: true, data: category });
  }

  async update(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const category = await categoryService.update(id, req.body as UpdateCategoryDto);
    res.json({ success: true, data: category });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    await categoryService.delete(id);
    res.status(204).send();
  }
}

export const categoryController = new CategoryController();
