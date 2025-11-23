import { Router } from "express";
import * as matchController from "../controllers/matchController";

const router = Router();

router.post("/setup", matchController.setupMatch);

router.get("/pending", matchController.getMatches);

router.get("/games", matchController.getGames);

router.get("/:id", matchController.getMatch);

router.post("/play/:id", matchController.playMatch);

router.put("/review/:id", matchController.reviewMatch);

export default router;
