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
 *     tags: [Coaches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: string
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
 *               $ref: '#/components/validations/Coach'
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

router.get("/:id", validateRequest(coachSchemas.getCoachById), coachController.getCoachById);

/**
 * @openapi
 * /api/nba/coach/{coachId}:
 *   put:
 *     summary: Updates a Coach from Firebase.
 *     tags: [Coaches, Admin]
 *      parameters:
 *       - name: coachId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The id for the Coach to update
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
 *       200:
 *         description: Coach updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSchema'
 * 
 */

router.put("/:id", validateRequest(coachSchemas.update), coachController.updateCoach);

export default router;