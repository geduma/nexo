import { Router } from "express";
import { reportController } from "../controllers/reports/report.controller.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/async-handler.js";

const router = Router();

router.get("/summary", authenticate, asyncHandler((req, res) => reportController.getSummary(req, res)));
router.get("/top-products", authenticate, asyncHandler((req, res) => reportController.getTopProducts(req, res)));
router.get("/daily-sales", authenticate, asyncHandler((req, res) => reportController.getDailySales(req, res)));
router.get("/dashboard", authenticate, asyncHandler((req, res) => reportController.getDashboard(req, res)));

export { router as reportRoutes };
