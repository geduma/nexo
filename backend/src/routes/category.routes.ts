import { Router } from "express";
import { categoryController } from "../controllers/categories/category.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { createCategorySchema, updateCategorySchema } from "../validators/category.validator.js";
import { paginationSchema } from "../validators/pagination.validator.js";

const router = Router();

router.get("/", validate(paginationSchema, "query"), asyncHandler((req, res) => categoryController.getAll(req, res)));
router.get("/:id", asyncHandler((req, res) => categoryController.getById(req, res)));
router.post("/", authenticate, validate(createCategorySchema), asyncHandler((req, res) => categoryController.create(req, res)));
router.put("/:id", authenticate, validate(updateCategorySchema), asyncHandler((req, res) => categoryController.update(req, res)));
router.delete("/:id", authenticate, asyncHandler((req, res) => categoryController.delete(req, res)));

export { router as categoryRoutes };
