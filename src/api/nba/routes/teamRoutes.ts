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
 *     summary: Create a new team (Coach or Admin)
 *     description: Creates a new team.
 *     tags: [Teams, Coaches, Admin]
 *     security:
 *       - bearerAuth: []
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
 *         description: Team created successfully.
 */
router.post(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["admin", "coach"] }),
    validateRequest(TeamSchemas.create),
    teamController.createTeam
);

/**
 * @openapi
 * /api/nba/team/:
 *   get:
 *     summary: Retrieve all teams (Users & Admin)
 *     description: Returns all teams in the league.  
 *     tags: [Teams, Users, Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of teams returned.
 */
router.get(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["admin", "user"] }),
    teamController.getTeams
);

/**
 * @openapi
 * /api/nba/team/{id}:
 *   get:
 *     summary: Retrieve a team by ID (All roles)
 *     description: Fetches a single team by its ID.  
 *     tags: [Teams, Users, Coaches, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Team found and returned.
 */
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "coach", "user"] }),
    validateRequest(TeamSchemas.getById),
    teamController.getTeamById
);

/**
 * @openapi
 * /api/nba/team/name/{id}:
 *   put:
 *     summary: Update a team's name (Coach or Admin)
 *     description: Updates the name of a team.  
 *     tags: [Teams, Coaches, Admin]
 *     security:
 *       - bearerAuth: []
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
 *         description: Team name updated.
 */
router.put(
    "/name/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "coach"] }),
    validateRequest(TeamSchemas.updateTeamName),
    teamController.updateTeamName
);

/**
 * @openapi
 * /api/nba/team/player/{id}:
 *   put:
 *     summary: Add or update a player's team assignment (Coach or Admin)
 *     description: Adds a player to a team. The player is deactivated and sent to the Commissioner for review.
 *     tags: [Teams, Coaches, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
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
 *         description: Player assigned or updated for the team.
 */
router.put(
    "/player/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "coach"] }),
    validateRequest(TeamSchemas.updatePlayer),
    teamController.updatePlayer
);

/**
 * @openapi
 * /api/nba/team/coach/{id}:
 *   put:
 *     summary: Assign a coach to a team (Admin only)
 *     description: Assigns or changes the coach of a team.  
 *     tags: [Teams, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
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
router.put(
    "/coach/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    validateRequest(TeamSchemas.assignCoach),
    teamController.assignCoach
);

/**
 * @openapi
 * /api/nba/team/player/{id}:
 *   delete:
 *     summary: Remove a player from a team (Coach or Admin)
 *     description: Removes a player from a team. The player is deactivated and sent to the Commissioner for review.  
 *     tags: [Teams, Coaches, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
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
 *         description: Player removed and record updated.
 */
router.delete(
    "/player/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "coach"] }),
    validateRequest(TeamSchemas.deletePlayer),
    teamController.deletePlayer
);

export default router;