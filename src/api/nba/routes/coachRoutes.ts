import express, { Router } from "express";
import * as coachController from "../controllers/coachController";
import { validateRequest } from "../middleware/validate";
import { coachSchemas } from "../validations/coachValidations";

const router: Router = express.Router();

/**
 * @openapi
 * /api/nba/coach/:
 *   post:
 *     summary: Creates a coach and adds to Firebase Collection. Team can be assigned.
 *     tags: [Coaches, Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Phil Jackson"
 *               currentTeam:
 *                 type: string
 *                 nullable: true
 *                 example: "Lakers"
 *     responses:
 *       '201':
 *         description: Coach created.
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
 *                   example: "Coach created."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "abc123"
 *                     name:
 *                       type: string
 *                       example: "Phil Jackson"
 *                     currentTeam:
 *                       type: string
 *                       example: "Lakers"
 *                     createdAt:
 *                       type: string
 *                       example: "2025-01-20T12:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2025-01-20T12:00:00Z"
 */
router.post("/", validateRequest(coachSchemas.create), coachController.createCoach);

/**
 * @openapi
 * /api/nba/coach/:
 *   get:
 *     summary: Retrieves all coaches.
 *     tags: [Coaches, Admin]
 *     responses:
 *       '200':
 *         description: Coaches found and returned.
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
 *                   example: "Coaches retrieved."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "abc123"
 *                       name:
 *                         type: string
 *                         example: "Steve Kerr"
 *                       currentTeam:
 *                         type: string
 *                         example: "Warriors"
 *                       createdAt:
 *                         type: string
 *                         example: "2025-01-20T12:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         example: "2025-01-20T12:00:00Z"
 */
router.get("/", coachController.getCoaches);

/**
 * @openapi
 * /api/nba/coach/{id}:
 *   get:
 *     summary: Retrieves a single coach by ID.
 *     tags: [Coaches]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the coach to retrieve.
 *     responses:
 *       '200':
 *         description: Coach found and returned.
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
 *                   example: "Coach found."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "abc123"
 *                     name:
 *                       type: string
 *                       example: "Gregg Popovich"
 *                     currentTeam:
 *                       type: string
 *                       example: "Spurs"
 *                     createdAt:
 *                       type: string
 *                       example: "2025-01-20T12:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2025-01-20T12:00:00Z"
 */
router.get("/:id", validateRequest(coachSchemas.getCoachById), coachController.getCoachById);

/**
 * @openapi
 * /api/nba/coach/{id}:
 *   put:
 *     summary: Updates a coach in Firebase.
 *     tags: [Coaches, Admin]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the Coach to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Doc Rivers"
 *               currentTeam:
 *                 type: string
 *                 example: "76ers"
 *     responses:
 *       '200':
 *         description: Coach updated successfully.
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
 *                   example: "Coach updated."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "abc123"
 *                     name:
 *                       type: string
 *                       example: "Doc Rivers"
 *                     currentTeam:
 *                       type: string
 *                       example: "76ers"
 *                     createdAt:
 *                       type: string
 *                       example: "2025-01-20T12:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2025-01-20T12:01:00Z"
 */
router.put("/:id", validateRequest(coachSchemas.update), coachController.updateCoach);

export default router;
