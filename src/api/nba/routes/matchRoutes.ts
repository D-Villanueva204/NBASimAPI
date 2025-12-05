import { Router } from "express";
import * as matchController from "../controllers/matchController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { validateRequest } from "../middleware/validate";
import { matchSchemas } from "../validations/matchValidations";

const router = Router();

/**
 * @openapi
 * /api/nba/match/:
 *   post:
 *     summary: Create a new match request. (Coaches & Admin)
 *     tags: [Matches, Coaches]
 *     security:
 *       - bearerAuth: []
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
 *                 example: "Los Angeles Lakers"
 *               awayTeam:
 *                 type: string
 *                 example: "Boston Celtics"
 *     responses:
 *       '201':
 *         description: Match sent to Commissioner for approval.
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
 *                   example: "Match created and sent to Commissioner."
 *                 data:
 *                   type: object
 */
router.post(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["coach", "admin"] }),
  validateRequest(matchSchemas.setupMatch),
  matchController.setupMatch
);

/**
 * @openapi
 * /api/nba/match/pending:
 *   get:
 *     summary: Retrieve all pending matches. (Admin only)
 *     tags: [Matches, Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Pending matches retrieved.
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
 *                   example: "Pending matches retrieved."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get(
  "/pending",
  authenticate,
  isAuthorized({ hasRole: ["admin"] }),
  matchController.getMatches
);

/**
 * @openapi
 * /api/nba/match/:
 *   get:
 *     summary: Retrieve all completed matches. (Users & Admin)
 *     tags: [Matches, Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Games retrieved.
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
 *                   example: "Games returned."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["user", "admin"] }),
  matchController.getGames
);

/**
 * @openapi
 * /api/nba/match/pending/{id}:
 *   get:
 *     summary: Retrieve a pending match by ID. (Admin only)
 *     tags: [Matches, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Pending match found.
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
 *                   example: "Pending match retrieved."
 *                 data:
 *                   type: object
 */
router.get(
  "/pending/:id",
  authenticate,
  isAuthorized({ hasRole: ["admin"] }),
  validateRequest(matchSchemas.getMatch),
  matchController.getMatch
);

/**
 * @openapi
 * /api/nba/match/play/{id}:
 *   post:
 *     summary: Simulate and play a match. (Coaches & Admin)
 *     tags: [Matches, Coaches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Match simulated and sent to Commissioner for approval.
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
 *                   example: "Match simulated."
 *                 data:
 *                   type: object
 */
router.post(
  "/play/:id",
  authenticate,
  isAuthorized({ hasRole: ["coach", "admin"] }),
  validateRequest(matchSchemas.playMatch),
  matchController.playMatch
);

/**
 * @openapi
 * /api/nba/match/review/{id}:
 *   put:
 *     summary: Review (approve or decline) a match. (Admin only)
 *     tags: [Matches, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
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
 *         description: Match reviewed.
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
 *                   example: "Match reviewed."
 *                 data:
 *                   type: object
 */
router.put(
  "/review/:id",
  authenticate,
  isAuthorized({ hasRole: ["admin"] }),
  validateRequest(matchSchemas.reviewMatch),
  matchController.reviewMatch
);

export default router;
