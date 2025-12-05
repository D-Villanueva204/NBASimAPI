import { Router } from "express";
import * as possessionsController from "../controllers/possessionsController";
import { validateRequest } from "../middleware/validate";
import { possessionSchemas } from "../validations/possessionsValidations";

const router = Router();

/**
 * @openapi
 * /api/nba/possessions/{id}:
 *   get:
 *     summary: Get all possessions/events for a match
 *     description: Retrieves all possessions for a given match that has been played.
 *     tags: [Matches, Users, Admin]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the match to retrieve possessions for
 *         schema:
 *           type: string
 *           example: "match123"
 *     responses:
 *       '200':
 *         description: Match possessions/events retrieved successfully.
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
 *                   example: "Match events returned"
 *                 data:
 *                   type: object
 *                   description: Compiled Possessions object
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
 *                             description: Shot result details
 *                             properties:
 *                               made:
 *                                 type: boolean
 *                                 example: true
 *                               type:
 *                                 type: string
 *                                 example: "three"
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
 *                             example:
 *                               playerId: "player789"
 *                               name: "Deandre Ayton"
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
 *                             example: null
 */
router.get("/:id", validateRequest(possessionSchemas.getById), possessionsController.getPossessions);

export default router;
