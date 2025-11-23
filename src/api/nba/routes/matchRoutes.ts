import { Router } from "express";
import * as matchController from "../controllers/matchController";

const router = Router();

router.post("/", matchController.setupMatch);

router.get("/pending", matchController.getMatches);

router.get("/", matchController.getGames);

router.get("/pending/:id", matchController.getMatch);

router.post("/play/:id", matchController.playMatch);

router.put("/review/:id", matchController.reviewMatch);

export default router;
