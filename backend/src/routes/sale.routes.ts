import { Router } from "express";
import { saleController } from "../controllers/sales/sale.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { createSaleSchema, updateSaleSchema } from "../validators/sale.validator.js";
import { saleFilterSchema } from "../validators/pagination.validator.js";

const router = Router();

router.get("/", authenticate, validate(saleFilterSchema, "query"), asyncHandler((req, res) => saleController.getAll(req, res)));
router.get("/:id", authenticate, asyncHandler((req, res) => saleController.getById(req, res)));
router.post("/", authenticate, validate(createSaleSchema), asyncHandler((req, res) => saleController.create(req, res)));
router.put("/:id", authenticate, validate(updateSaleSchema), asyncHandler((req, res) => saleController.update(req, res)));
router.delete("/:id", authenticate, asyncHandler((req, res) => saleController.delete(req, res)));

export { router as saleRoutes };
