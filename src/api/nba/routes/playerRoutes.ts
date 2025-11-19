import express, { Router } from "express";
import * as playerController from "../controllers/playerController";

const router: Router = express.Router();

router.post("/", playerController.createPlayer);

router.get("/", playerController.getAllPlayers);

router.get("/:id", playerController.getPlayerById);

router.put("/review/:id", playerController.reviewPlayer);

router.put("/status/:id", playerController.updatePlayer);

export default router;