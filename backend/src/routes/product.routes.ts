import { Router } from "express";
import { productController } from "../controllers/products/product.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createProductSchema, updateProductSchema } from "../validators/product.validator.js";
import { productFilterSchema } from "../validators/pagination.validator.js";

const router = Router();

router.get("/", validate(productFilterSchema, "query"), (req, res) => productController.getAll(req, res));
router.get("/search", (req, res) => productController.search(req, res));
router.get("/:id", (req, res) => productController.getById(req, res));
router.get("/:id/related", (req, res) => productController.getRelatedProducts(req, res));
router.post("/", authenticate, validate(createProductSchema), (req, res) => productController.create(req, res));
router.put("/:id", authenticate, validate(updateProductSchema), (req, res) => productController.update(req, res));
router.delete("/:id", authenticate, (req, res) => productController.delete(req, res));

export { router as productRoutes };
