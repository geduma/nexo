import type { Request, Response } from "express";
import { productService } from "../../services/products/product.service.js";
import type { CreateProductDto, UpdateProductDto } from "../../validators/product.validator.js";
import { productFilterSchema } from "../../validators/pagination.validator.js";

export class ProductController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const filters = productFilterSchema.parse(req.query);
      const result = await productService.getAll(filters);
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
      const product = await productService.getById(id);
      res.json({ success: true, data: product });
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
      const product = await productService.create(req.body as CreateProductDto);
      res.status(201).json({ success: true, data: product });
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
      const product = await productService.update(id, req.body as UpdateProductDto);
      res.json({ success: true, data: product });
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
      await productService.delete(id);
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

  async search(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q as string;
      const results = await productService.search(query);
      res.json({ success: true, data: results });
    } catch (error) {
      const err = error as { statusCode?: number; message: string };
      res.status(err.statusCode ?? 500).json({
        success: false,
        message: err.message,
        errors: [],
      });
    }
  }

  async getRelatedProducts(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const products = await productService.getRelatedProducts(id);
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
}

export const productController = new ProductController();
