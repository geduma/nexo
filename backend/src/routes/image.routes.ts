import { Router } from "express";
import { imageController } from "../controllers/images/image.controller.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/async-handler.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router({ mergeParams: true });

router.get("/:productId/images", asyncHandler((req, res) => imageController.getByProduct(req, res)));
router.post("/:productId/images", authenticate, upload.single("file"), asyncHandler((req, res) => imageController.upload(req, res)));
router.put("/:productId/images/:imageId", authenticate, asyncHandler((req, res) => imageController.update(req, res)));
router.delete("/:productId/images/:imageId", authenticate, asyncHandler((req, res) => imageController.delete(req, res)));

export { router as imageRoutes };
