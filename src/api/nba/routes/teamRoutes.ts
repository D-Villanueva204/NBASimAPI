import express, { Router } from "express";
import * as teamController from "../controllers/teamController";

const router: Router = express.Router();

router.post("/", teamController.createTeam);

router.get("/", teamController.getTeams);

router.put("/name/:id", teamController.updateTeamName);

router.put("/player/:id", teamController.updatePlayer);

router.delete("/player/:id", teamController.deletePlayer);


export default router;