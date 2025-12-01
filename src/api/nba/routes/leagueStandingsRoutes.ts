import express from "express";
import * as leagueStandingsController from "../controllers/leagueStandingsController";
import { validateRequest } from "../middleware/validate";
import { standingsSchemas } from "../validations/leagueStandingsValidations";

const router = express.Router();

router.post("/", validateRequest(standingsSchemas.create), leagueStandingsController.createNewStandings);
router.get("/", leagueStandingsController.getStandings);
router.get("/:season", validateRequest(standingsSchemas.getStandingsBySeason), leagueStandingsController.getStandingsBySeason);
router.put("/:season", leagueStandingsController.updateStandings);

export default router;
