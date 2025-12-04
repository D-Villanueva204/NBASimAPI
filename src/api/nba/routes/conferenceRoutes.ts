import express, { Router } from "express";
import * as conferenceController from "../controllers/conferenceController";

const router: Router = express.Router();

/**
 * @openapi
 * /api/nba/conference/:
 *   put:
 *     summary: Update conferences.
 *     tags: [Admin]
 *     description: Updates conferences by all Team Record
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
 * 
 */
router.put("/", conferenceController.updateConferences);

export default router;