import { Router } from "express";
import * as possessionsController from "../controllers/possessionsController";
import { validateRequest } from "../middleware/validate";
import { possessionSchemas } from "../validations/possessionsValidations";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router = Router();

/**
 * @openapi
 * /api/nba/possessions/{id}:
 *   get:
 *     summary: Retrieve all possession events for a played match.
 *     description: Returns the full list of play-by-play possession events for a given match.
 *     Accessible to **user** and **admin** roles.
 *     tags: [Matches, Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Match ID to fetch possession history for
 *         schema:
 *           type: string
 *           example: "match123"
 *     responses:
 *       '200':
 *         description: Match possessions retrieved successfully.
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
 *                   example: "Match events returned."
 *                 data:
 *                   type: object
 *                   description: Possessions object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "match123"
 *                     events:
 *                       type: array
 *                       items:
 *                         type: object
 *                         description: A single possession event
 *                         properties:
 *                           shot:
 *                             type: object
 *                             description: Details about the shot attempt
 *                             properties:
 *                               type:
 *                                 type: string
 *                                 example: Shot.THREE
 *                               made:
 *                                 type: boolean
 *                                 example: true
 *                               contested:
 *                                 type: boolean
 *                                 example: false
 *                           currentTeam:
 *                             type: string
 *                             example: "LAL"
 *                           shooter:
 *                             type: object
 *                             properties:
 *                               playerId:
 *                                 type: string
 *                                 example: "player123"
 *                               name:
 *                                 type: string
 *                                 example: "LeBron James"
 *                           defender:
 *                             type: object
 *                             properties:
 *                               playerId:
 *                                 type: string
 *                                 example: "player456"
 *                               name:
 *                                 type: string
 *                                 example: "Marcus Smart"
 *                           rebound:
 *                             type: object
 *                             nullable: true
 *                             properties:
 *                               playerId:
 *                                 type: string
 *                                 example: "player789"
 *                               name:
 *                                 type: string
 *                                 example: "Deandre Ayton"
 *                           assist:
 *                             type: object
 *                             nullable: true
 *                             properties:
 *                               playerId:
 *                                 type: string
 *                                 example: "player321"
 *                               name:
 *                                 type: string
 *                                 example: "Luka Doncic"
 */
router.get("/:id", authenticate, isAuthorized({ hasRole: ["admin", "user", "coach"] }), validateRequest(possessionSchemas.getById), possessionsController.getPossessions);

export default router;
