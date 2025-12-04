import express, { Router } from "express";
import * as teamController from "../controllers/teamController";
import { validateRequest } from "../middleware/validate";
import { TeamSchemas } from "../validations/teamValidations";

const router: Router = express.Router();

/**
 * @openapi
 * /api/nba/team/:
 *   post:
 *     summary: Creates a new team. Meant for Coaches.
 *     tags: [Teams, Coaches]
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
 *                 example: "Toronto Raptors"
 *     responses:
 *       '201':
 *         description: Team created.
 */
router.post("/", validateRequest(TeamSchemas.create), teamController.createTeam);

/**
 * @openapi
 * /api/nba/team/:
 *   get:
 *     summary: Retrieves all teams. Meant for Users.
 *     tags: [Teams, Users]
 *     responses:
 *       '200':
 *         description: List of teams retrieved successfully.
 */
router.get("/", teamController.getTeams);

/**
 * @openapi
 * /api/nba/team/{id}:
 *   get:
 *     summary: Get team by ID
 *     tags: [Teams, Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Team retrieved successfully.
 */
router.get("/:id", validateRequest(TeamSchemas.getById), teamController.getTeamById);

/**
 * @openapi
 * /api/nba/team/name/{id}:
 *   put:
 *     summary: Updates a team's name. Meant for Coaches.
 *     tags: [Teams, Coaches]
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
 *               - newName
 *             properties:
 *               newName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Team name updated successfully.
 */
router.put("/name/:id", validateRequest(TeamSchemas.updateTeamName), teamController.updateTeamName);

/**
 * @openapi
 * /api/nba/team/player/{id}:
 *   put:
 *     summary: Adds or updates a player's status on a team. Also updates Player file.
 *     tags: [Teams, Coaches]
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
 *               - playerId
 *             properties:
 *               playerId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Player added or updated for the team.
 */
router.put("/player/:id", validateRequest(TeamSchemas.updatePlayer), teamController.updatePlayer);

/**
 * @openapi
 * /api/nba/team/coach/{id}:
 *   put:
 *     summary: Assign a coach to a team. Meant for Admin.
 *     tags: [Teams, Coaches]
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
 *               - coachId
 *             properties:
 *               coachId:
 *                 type: string
 *                 example: "coach456"
 *     responses:
 *       '200':
 *         description: Coach assigned successfully.
 */
router.put("/coach/:id", validateRequest(TeamSchemas.assignCoach), teamController.assignCoach);

/**
 * @openapi
 * /api/nba/team/player/{id}:
 *   delete:
 *     summary: Removes a player from team. Deactivates player and sends to Commissioner for approval. Also updates Player file.
 *     tags: [Teams, Coaches]
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
 *               - playerId
 *             properties:
 *               playerId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Team updated. Player also updated.
 */
router.delete("/player/:id", validateRequest(TeamSchemas.deletePlayer), teamController.deletePlayer);

export default router;