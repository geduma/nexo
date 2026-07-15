import type { Request, Response } from "express";
import { settingsService } from "../../services/settings/settings.service.js";
import type { UpdateSettingsDto } from "../../validators/settings.validator.js";

export class SettingsController {
  async get(_req: Request, res: Response): Promise<void> {
    const settings = await settingsService.get();
    res.json({ success: true, data: settings });
  }

  async update(req: Request, res: Response): Promise<void> {
    const settings = await settingsService.update(req.body as UpdateSettingsDto);
    res.json({ success: true, data: settings });
  }
}

export const settingsController = new SettingsController();
