import type { Request, Response } from "express";
import { authService } from "../../services/auth/auth.service.js";

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.json({ success: true, data: { token } });
  }
}

export const authController = new AuthController();
