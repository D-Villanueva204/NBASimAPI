import express from "express";
import * as leagueStandingsController from "../controllers/leagueStandingsController";

const router = express.Router();

router.get("/", leagueStandingsController.getStandings);
router.get("/:season", leagueStandingsController.getStandingsById);
router.post("/", leagueStandingsController.createStandings);
router.put("/:season", leagueStandingsController.updateStandings);

export default router;
