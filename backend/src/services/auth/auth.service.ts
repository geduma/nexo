import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import type { AuthPayload } from "../../middleware/auth.js";

export class AuthService {
  async login(email: string, password: string): Promise<string> {
    // For MVP, single admin - hardcoded check
    // In production, this would query a users table
    if (email !== "admin@nexo.com" || password !== "admin123") {
      throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
    }

    const payload: AuthPayload = {
      userId: "admin-001",
      email,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "24h" });
    return token;
  }

  async verifyToken(token: string): Promise<AuthPayload> {
    return jwt.verify(token, env.JWT_SECRET) as AuthPayload;
  }
}

export const authService = new AuthService();
