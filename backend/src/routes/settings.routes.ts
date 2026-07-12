import { Router } from "express";
import { settingsController } from "../controllers/settings/settings.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { updateSettingsSchema } from "../validators/settings.validator.js";

const router = Router();

router.get("/", authenticate, (req, res) => settingsController.get(req, res));
router.put("/", authenticate, validate(updateSettingsSchema), (req, res) => settingsController.update(req, res));

export { router as settingsRoutes };
