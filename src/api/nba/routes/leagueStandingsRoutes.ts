import express from "express";
import * as leagueStandingsController from "../controllers/leagueStandingsController";

const router = express.Router();

router.post("/", leagueStandingsController.createNewStandings);
router.get("/", leagueStandingsController.getStandings);
router.get("/:season", leagueStandingsController.getStandingsById);
router.put("/:season", leagueStandingsController.updateStandings);

export default router;
