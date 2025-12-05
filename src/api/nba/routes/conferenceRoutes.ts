import express, { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import * as conferenceController from "../controllers/conferenceController";

const router: Router = express.Router();

/**
 * @openapi
 * /api/nba/conference/:
 *   put:
 *     summary: Update conferences.
 *     tags: [Admin]
 *     description: Updates conferences by recalculating all Team Records.
 *     requestBody:
 *       description: no request body.
 *       content: {}
 *     responses:
 *       '200':
 *         description: Conferences updated successfully.
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
 *                   example: "Conferences updated."
 */

router.put("/", authenticate, isAuthorized({ hasRole: ["admin"] }), conferenceController.updateConferences);

export default router;