import type { Request, Response } from "express";
import { settingsService } from "../../services/settings/settings.service.js";
import type { UpdateSettingsDto } from "../../validators/settings.validator.js";

export class SettingsController {
  async get(_req: Request, res: Response): Promise<void> {
    try {
      const settings = await settingsService.get();
      res.json({ success: true, data: settings });
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
      const settings = await settingsService.update(req.body as UpdateSettingsDto);
      res.json({ success: true, data: settings });
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

export const settingsController = new SettingsController();
