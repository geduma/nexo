import type { Request, Response } from "express";
import { imageService } from "../../services/images/image.service.js";

export class ImageController {
  async getByProduct(req: Request, res: Response): Promise<void> {
    const productId = String(req.params.productId);
    const images = await imageService.getByProduct(productId);
    res.json({ success: true, data: images });
  }

  async upload(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      res.status(400).json({ success: false, message: "No file uploaded", errors: [] });
      return;
    }

    const productId = String(req.params.productId);
    const displayOrder = parseInt(req.body.displayOrder as string, 10) || 0;
    const isPrimary = req.body.isPrimary === "true";

    const image = await imageService.upload(productId, req.file, displayOrder, isPrimary);
    res.status(201).json({ success: true, data: image });
  }

  async update(req: Request, res: Response): Promise<void> {
    const imageId = String(req.params.imageId);
    const image = await imageService.update(imageId, req.body);
    res.json({ success: true, data: image });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const imageId = String(req.params.imageId);
    await imageService.delete(imageId);
    res.status(204).send();
  }
}

export const imageController = new ImageController();
