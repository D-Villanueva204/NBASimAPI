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
 *     description: Sends a match to the Commissioner (admin) for approval by providing the home and away teams.
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
 *       '201':
 *         description: Game sent to Commissioner for Approval.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Match created and sent to Commissioner"
 *                 data:
 *                   type: object
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
 *       '200':
 *         description: All pending matches returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 message:
 *                   type: string
 *                   example: "Pending matches retrieved"
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
 *       '200':
 *         description: Games found and returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 message:
 *                   type: string
 *                   example: "Completed games returned"
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
 *       '200':
 *         description: Match found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                   example: "Pending match retrieved"
 */
router.get("/pending/:id", validateRequest(matchSchemas.getMatch), matchController.getMatch);

/**
 * @openapi
 * /api/nba/match/play/{id}:
 *   post:
 *     summary: Simulate a match
 *     description: Plays a pending match, then sends it to the Commissioner for approval.
 *     tags: [Matches, Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the match to simulate
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Match successfully simulated and sent to Commissioner for approval.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                   example: "Match simulated"
 */
router.post("/play/:id", validateRequest(matchSchemas.playMatch), matchController.playMatch);

/**
 * @openapi
 * /api/nba/match/review/{id}:
 *   put:
 *     summary: Approve or Decline Match
 *     description: If approved, match is archived. If declined, returned.
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
 *       '200':
 *         description: Match reviewed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Match reviewed"
 */
router.put("/review/:id", validateRequest(matchSchemas.reviewMatch), matchController.reviewMatch);

export default router;
