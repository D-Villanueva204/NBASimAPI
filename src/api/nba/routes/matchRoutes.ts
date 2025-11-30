import { Router } from "express";
import * as matchController from "../controllers/matchController";
import { validateRequest } from "../middleware/validate";
import { matchSchemas } from "../validations/matchValidations";

const router = Router();

/**
 * @openapi
 * /api/nba/match/:
 *   post:
 *     summary: Create a new pending match request
 *     description: Sends a match to the commissioner (admin) for approval by providing the home and away teams.
 *     tags: [Matches, Coaches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - homeTeam
 *               - awayTeam
 *             properties:
 *               homeTeam:
 *                 type: string
 *                 example: "Lakers"
 *               awayTeam:
 *                 type: string
 *                 example: "Celtics"
 *     responses:
 *       201:
 *         description: Game sent to Commissioner for Approval.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ResponseSchema"
 */
router.post("/", validateRequest(matchSchemas.setupMatch), matchController.setupMatch);

/**
 * @openapi
 * /api/nba/match/pending:
 *   get:
 *     summary: Get all pending matches
 *     description: Retrieves all unapproved matches waiting for commissioner review.
 *     tags: [Matches, Admin]
 *     responses:
 *       200:
 *         description: All pending matches returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ResponseSchema"
 */
router.get("/pending", matchController.getMatches);

/**
 * @openapi
 * /api/nba/match/:
 *   get:
 *     summary: Get all completed and approved games 
 *     description: Returns all archived games that have been played and approved.
 *     tags: [Matches, Users]
 *     responses:
 *       200:
 *         description: Games found and returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ResponseSchema"
 */
router.get("/", matchController.getGames);

/**
 * @openapi
 * /api/nba/match/pending/{id}:
 *   get:
 *     summary: Get a single pending match by ID
 *     tags: [Matches, Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: matchId to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Match found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ResponseSchema"
 */
router.get("/pending/:id", validateRequest(matchSchemas.getMatch), matchController.getMatch);

/**
 * @openapi
 * /api/nba/match/play/{id}:
 *   post:
 *     summary: Simulate a match
 *     description: Plays a pending match, once finished, sent to Commissioner for approval.
 *     tags: [Matches, Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the match to simulate
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Match successfully simulated and sent to Commissioner for approval.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ResponseSchema"
 */
router.post("/play/:id", validateRequest(matchSchemas.playMatch), matchController.playMatch);

/**
 * @openapi
 * /api/nba/match/review/{id}:
 *   put:
 *     summary: Approve or Decline Match. If approved, then sent to archive. If not, returned.
 *     tags: [Matches, Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Match ID to review
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - approved
 *             properties:
 *               approved:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Match reviewed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ResponseSchema"
 */
router.put("/review/:id", validateRequest(matchSchemas.reviewMatch), matchController.reviewMatch);

export default router;
