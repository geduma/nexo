import type { Request, Response } from "express";
import { productService } from "../../services/products/product.service.js";
import type { CreateProductDto, UpdateProductDto } from "../../validators/product.validator.js";
import { productFilterSchema } from "../../validators/pagination.validator.js";

export class ProductController {
  async getAll(req: Request, res: Response): Promise<void> {
    const filters = productFilterSchema.parse(req.query);
    const result = await productService.getAll(filters);
    res.json({ success: true, data: result.data, pagination: result.pagination });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const product = await productService.getById(id);
    res.json({ success: true, data: product });
  }

  async create(req: Request, res: Response): Promise<void> {
    const product = await productService.create(req.body as CreateProductDto);
    res.status(201).json({ success: true, data: product });
  }

  async update(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const product = await productService.update(id, req.body as UpdateProductDto);
    res.json({ success: true, data: product });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    await productService.delete(id);
    res.status(204).send();
  }

  async search(req: Request, res: Response): Promise<void> {
    const query = req.query.q as string;
    const results = await productService.search(query);
    res.json({ success: true, data: results });
  }

  async getRelatedProducts(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const products = await productService.getRelatedProducts(id);
    res.json({ success: true, data: products });
  }
}

export const productController = new ProductController();
