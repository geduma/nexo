import { Router } from "express";
import { saleController } from "../controllers/sales/sale.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createSaleSchema, updateSaleSchema } from "../validators/sale.validator.js";
import { saleFilterSchema } from "../validators/pagination.validator.js";

const router = Router();

router.get("/", authenticate, validate(saleFilterSchema, "query"), (req, res) => saleController.getAll(req, res));
router.get("/:id", authenticate, (req, res) => saleController.getById(req, res));
router.post("/", authenticate, validate(createSaleSchema), (req, res) => saleController.create(req, res));
router.put("/:id", authenticate, validate(updateSaleSchema), (req, res) => saleController.update(req, res));
router.delete("/:id", authenticate, (req, res) => saleController.delete(req, res));

export { router as saleRoutes };
