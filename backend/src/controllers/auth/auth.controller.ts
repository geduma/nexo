import type { Request, Response } from "express";
import { authService } from "../../services/auth/auth.service.js";

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await authService.login(email, password);
      res.json({ success: true, data: { token } });
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

export const authController = new AuthController();
