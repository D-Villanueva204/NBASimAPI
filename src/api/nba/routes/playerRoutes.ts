import express, { Router } from "express";
import * as playerController from "../controllers/playerController";
import { validateRequest } from "../middleware/validate";
import { playerSchemas } from "../validations/playerValidations";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

/**
 * @openapi
 * /api/nba/player/:
 *   post:
 *     summary: Create a new player (Coach or Admin only)
 *     description: >
 *       Creates a new player and automatically sends the player record to the Commissioner (Admin) for approval.  
 *       Requires authentication and one of the roles: **coach**, **admin**.
 *     tags: [Coaches, Admin]
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
 *               - currentTeam
 *               - position
 *               - possession
 *               - three
 *               - layup
 *               - defense
 *             properties:
 *               name:
 *                 type: string
 *               currentTeam:
 *                 type: string
 *               position:
 *                 type: string
 *               possession:
 *                 type: number
 *               three:
 *                 type: number
 *               layup:
 *                 type: number
 *               defense:
 *                 type: number
 *     responses:
 *       '201':
 *         description: Player created and sent for Commissioner approval.
 */
router.post(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["coach", "admin"] }),
  validateRequest(playerSchemas.create),
  playerController.createPlayer
);

/**
 * @openapi
 * /api/nba/player/admin/:
 *   get:
 *     summary: Retrieve all players (approved + pending) — Admin only
 *     description: >
 *       Returns all players in the system regardless of review status.  
 *       Restricted to **admin** users.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: All players retrieved successfully.
 */
router.get(
  "/admin/",
  authenticate,
  isAuthorized({ hasRole: ["admin"] }),
  playerController.getAllPlayers
);

/**
 * @openapi
 * /api/nba/player/:
 *   get:
 *     summary: Retrieve all approved active players (Users + Admin)
 *     description: >
 *       Returns all **approved and active** players.  
 *       Accessible to roles: **user**, **admin**.
 *     tags: [Users, Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Approved active players returned.
 */
router.get(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["user", "admin"] }),
  playerController.getPlayers
);

/**
 * @openapi
 * /api/nba/player/pending/:
 *   get:
 *     summary: Retrieve all pending players — Admin only
 *     description: >
 *       Retrieves players still awaiting Commissioner review.  
 *       Restricted to **admin** users only.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Pending players returned.
 */
router.get(
  "/pending/",
  authenticate,
  isAuthorized({ hasRole: ["admin"] }),
  playerController.getPendingPlayers
);

/**
 * @openapi
 * /api/nba/player/review/{id}:
 *   put:
 *     summary: Approve or reject a pending player — Admin only
 *     description: >
 *       Allows the Commissioner (Admin) to approve or reject a pending player.  
 *       When approved, the player becomes active.  
 *       When rejected, the player is returned to the coach.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID to review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - approved
 *             properties:
 *               approved:
 *                 type: boolean
 *                 description: Approve (true) or reject (false) the player
 *     responses:
 *       200:
 *         description: Player review status updated.
 */
router.put(
  "/review/:id",
  authenticate,
  isAuthorized({ hasRole: ["admin"] }),
  validateRequest(playerSchemas.reviewPlayer),
  playerController.reviewPlayer
);

/**
 * @openapi
 * /api/nba/player/update/{id}:
 *   put:
 *     summary: Update an existing player (Coach or Admin)
 *     description: >
 *       Updates a player and automatically deactivates them, sending the updated record for Commissioner review.  
 *       Accessible to roles **coach** and **admin**.
 *     tags: [Coaches, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the player to update
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
 *               position:
 *                 type: string
 *               currentTeam:
 *                 type: string
 *               possession:
 *                 type: number
 *               three:
 *                 type: number
 *               layup:
 *                 type: number
 *               defense:
 *                 type: number
 *     responses:
 *       200:
 *         description: Player updated and sent for re-approval.
 */
router.put(
  "/update/:id",
  authenticate,
  isAuthorized({ hasRole: ["admin", "coach"] }),
  validateRequest(playerSchemas.update),
  playerController.updatePlayer
);

/**
 * @openapi
 * /api/nba/player/{id}:
 *   get:
 *     summary: Get a player by ID (User + Admin)
 *     description: >
 *       Retrieves a single approved player by ID.  
 *       Accessible to **user** and **admin** roles.
 *     tags: [Users, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the player
 *     responses:
 *       200:
 *         description: Player found and returned.
 */
router.get(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["admin", "user"] }),
  validateRequest(playerSchemas.getPlayerById),
  playerController.getPlayerById
);

export default router;