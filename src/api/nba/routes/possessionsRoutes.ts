import { Router } from "express";
import * as possessionsControllers from "../controllers/possessionsControllers";
import { validateRequest } from "../middleware/validate";
import { possessionSchemas } from "../validations/possessionsValidations";

const router = Router();

router.get("/:id", validateRequest(possessionSchemas.getById), possessionsControllers.getPossessions);

export default router;
