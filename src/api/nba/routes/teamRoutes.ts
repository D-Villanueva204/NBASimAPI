import express, { Router } from "express";
import * as teamController from "../controllers/teamController";
import { validateRequest } from "../middleware/validate";
import { TeamSchemas } from "../validations/teamValidations";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

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
 *                   example: "Team created."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "team123"
 *                     name:
 *                       type: string
 *                       example: "Toronto Raptors"
 */
router.post("/", authenticate, isAuthorized({ hasRole: ["admin", "coach"] }), validateRequest(TeamSchemas.create), teamController.createTeam);

/**
 * @openapi
 * /api/nba/team/:
 *   get:
 *     summary: Retrieves all teams. Meant for Users.
 *     tags: [Teams, Users]
 *     responses:
 *       '200':
 *         description: List of teams retrieved successfully.
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
 *                   example: "Teams found and returned."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "team123"
 *                       name:
 *                         type: string
 *                         example: "Toronto Raptors"
 *                       coachId:
 *                         type: string
 *                         nullable: true
 *                         example: "coach456"
 */
router.get("/", authenticate, isAuthorized({ hasRole: ["admin", "user"] }), teamController.getTeams);

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
 *                   example: "Team found."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     coachId:
 *                       type: string
 *                       nullable: true
 */
router.get("/:id", authenticate, isAuthorized({ hasRole: ["admin", "coach", "user"] }), validateRequest(TeamSchemas.getById), teamController.getTeamById);

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
 *                 example: "LA Lakers"
 *     responses:
 *       '200':
 *         description: Team name updated successfully.
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
 *                   example: "Team name updated."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                       example: "LA Lakers"
 */
router.put("/name/:id", authenticate, isAuthorized({hasRole: ["admin", "coach"]}), validateRequest(TeamSchemas.updateTeamName), teamController.updateTeamName);

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
 *                 example: "player789"
 *     responses:
 *       '200':
 *         description: Player added or updated for the team.
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
 *                   example: "Team updated."
 *                 data:
 *                   type: object
 *                   properties:
 *                     teamId:
 *                       type: string
 *                     playerId:
 *                       type: string
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
 *                   example: "Team updated."
 *                 data:
 *                   type: object
 *                   properties:
 *                     teamId:
 *                       type: string
 *                     coachId:
 *                       type: string
 */
router.put("/coach/:id", validateRequest(TeamSchemas.assignCoach), teamController.assignCoach);

/**
 * @openapi
 * /api/nba/team/player/{id}:
 *   delete:
 *     summary: Removes a player from team. Deactivates player and sends to Commissioner for approval.
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
 *                 example: "player789"
 *     responses:
 *       '200':
 *         description: Team updated. Player also updated.
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
 *                   example: "Team updated"
 *                 data:
 *                   type: object
 *                   properties:
 *                     teamId:
 *                       type: string
 *                     playerId:
 *                       type: string
 */
router.delete("/player/:id", validateRequest(TeamSchemas.deletePlayer), teamController.deletePlayer);


export default router;