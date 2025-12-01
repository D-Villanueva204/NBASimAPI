import { Router } from "express";
import * as possessionsController from "../controllers/possessionsController";
import { validateRequest } from "../middleware/validate";
import { possessionSchemas } from "../validations/possessionsValidations";

const router = Router();

router.get("/:id", validateRequest(possessionSchemas.getById), possessionsController.getPossessions);

export default router;
