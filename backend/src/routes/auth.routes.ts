import { Router } from "express";
import { authController } from "../controllers/auth/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const router = Router();

router.post("/login", validate(loginSchema), (req, res) => authController.login(req, res));

export { router as authRoutes };
