import express, { Router } from "express";
import * as coachController from "../controllers/coachController";
import { validateRequest } from "../middleware/validate";
import { coachSchemas } from "../validations/coachValidations";


const router: Router = express.Router();

// Routes
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
 *         description: Coach created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coach'
 */
router.post("/", validateRequest(coachSchemas.create), coachController.createCoach);
/**
 * @openapi
 * /api/nba/coach/:
 *   get:
 *     summary: Retrieves all coaches by method
 *     tags: [Coaches, Admin]
 *     responses:
 *       '200':
 *         description: Coaches found and returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSchema'
 */

router.get("/", coachController.getCoaches);

/**
 * @openapi
 * /api/nba/coach/{id}:
 *   get:
 *     summary: Retrieves a single coach by ID
 *     tags: [Coaches]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the coach
 *     responses:
 *       '200':
 *         description: Coach found and returned
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
 *                   example: "Coach found"
 *                 data:
 *                   $ref: '#/components/schemas/Coach'
 */
router.get("/:id", validateRequest(coachSchemas.getCoachById), coachController.getCoachById);

/**
 * @openapi
 * /api/nba/coach/{id}:
 *   put:
 *     summary: Updates a Coach from Firebase.
 *     tags: [Coaches, Admin]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the Coach to update
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
 *                 example: "Phil Jackson"
 *               currentTeam:
 *                 type: string
 *                 example: "LA Lakers"
 *             description: Fields to update on the Coach.
 *     responses:
 *       '200':
 *         description: Coach updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSchema'
 */

router.put("/:id", validateRequest(coachSchemas.update), coachController.updateCoach);

export default router;