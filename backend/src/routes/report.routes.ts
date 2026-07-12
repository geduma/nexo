import { Router } from "express";
import { reportController } from "../controllers/reports/report.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/summary", authenticate, (req, res) => reportController.getSummary(req, res));
router.get("/top-products", authenticate, (req, res) => reportController.getTopProducts(req, res));
router.get("/daily-sales", authenticate, (req, res) => reportController.getDailySales(req, res));
router.get("/dashboard", authenticate, (req, res) => reportController.getDashboard(req, res));

export { router as reportRoutes };
