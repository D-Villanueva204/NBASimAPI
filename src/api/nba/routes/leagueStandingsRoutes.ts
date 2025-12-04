import express from "express";
import * as leagueStandingsController from "../controllers/leagueStandingsController";
import { validateRequest } from "../middleware/validate";
import { standingsSchemas } from "../validations/leagueStandingsValidations";

const router = express.Router();

/**
 * @openapi
 * /api/nba/standings/:
 *   post:
 *     summary: Create new standings for a new season.
 *     description: Automatically generates standings for a new season.
 *     tags: [Admin]
 *     responses:
 *       '201':
 *         description: Standings created for the new season.
 */
router.post("/", validateRequest(standingsSchemas.create), leagueStandingsController.createNewStandings);

/**
 * @openapi
 * /api/nba/standings/:
 *   get:
 *     summary: Get all league standings.
 *     description: Retrieves all standings across all seasons.
 *     tags: [LeagueStandings, Users, Admin]
 *     responses:
 *       '200':
 *         description: All standings retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ResponseSchema"
 */
router.get("/", leagueStandingsController.getStandings);

/**
 * @openapi
 * /api/nba/standings/{season}:
 *   get:
 *     summary: Get league standings by season.
 *     description: Retrieves standings for a specific season.
 *     tags: [Admin, Users]
 *     parameters:
 *       - name: season
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: "Season for standings to be retrieved"
 *           example: "2024-2025"
 *     responses:
 *       '200':
 *         description: Standings found for the given season.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ResponseSchema"
 */
router.get("/:season", validateRequest(standingsSchemas.getStandingsBySeason), leagueStandingsController.getStandingsBySeason);

/**
 * @openapi
 * /api/nba/standings/{season}:
 *   put:
 *     summary: Update league standings for a specific season.
 *     description: Updates standings manually for a given season.
 *     tags: [Admin]
 *     parameters:
 *       - name: season
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: "Season for standings to be retrieved"
 *           example: "2024-2025"
 *     responses:
 *       '200':
 *         description: Standings updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ResponseSchema"
 */
router.put("/:season", leagueStandingsController.updateStandings);

export default router;
