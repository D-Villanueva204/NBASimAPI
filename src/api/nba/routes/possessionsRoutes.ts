import { Router } from "express";
import * as possessionsControllers from "../controllers/possessionsControllers";

const router = Router();

router.get("/:id", possessionsControllers.getPossessions);

export default router;
