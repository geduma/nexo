import type { Request, Response } from "express";
import { imageService } from "../../services/images/image.service.js";

export class ImageController {
  async getByProduct(req: Request, res: Response): Promise<void> {
    try {
      const productId = String(req.params.productId);
      const images = await imageService.getByProduct(productId);
      res.json({ success: true, data: images });
    } catch (error) {
      const err = error as { statusCode?: number; message: string };
      res.status(err.statusCode ?? 500).json({
        success: false,
        message: err.message,
        errors: [],
      });
    }
  }

  async upload(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: "No file uploaded", errors: [] });
        return;
      }

      const productId = String(req.params.productId);
      const displayOrder = parseInt(req.body.displayOrder as string, 10) || 0;
      const isPrimary = req.body.isPrimary === "true";

      const image = await imageService.upload(productId, req.file, displayOrder, isPrimary);
      res.status(201).json({ success: true, data: image });
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
      const imageId = String(req.params.imageId);
      const image = await imageService.update(imageId, req.body);
      res.json({ success: true, data: image });
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
      const imageId = String(req.params.imageId);
      await imageService.delete(imageId);
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

export const imageController = new ImageController();
