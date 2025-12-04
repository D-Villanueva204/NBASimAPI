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
 *     description: Retrieves all possessions for a given match (that is played).
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
 *               $ref: "#/components/schemas/ResponseSchema"
 * 
 */
router.get("/:id", validateRequest(possessionSchemas.getById), possessionsController.getPossessions);

export default router;
