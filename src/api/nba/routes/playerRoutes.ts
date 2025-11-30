import express, { Router } from "express";
import * as playerController from "../controllers/playerController";
import { validateRequest } from "../middleware/validate";
import { adminSchemas, playerSchemas } from "../validations/playerValidations";

const router: Router = express.Router();

/**
 * @openapi
 * /api/nba/player/:
 *   post:
 *     summary: Create a new player. Automatically sends to Commissioner (Admin) to approval.
 *     tags: [Players, Coaches]
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
 *                    description:
 *                      The likelihood of taking the shot during a team possession.
 *               three:
 *                 type: number
 *               layup:
 *                 type: number
 *               defense:
 *                 type: number
 *     responses:
 *       201:
 *         description: Player sent to Commissioner for Approval.
 */
router.post("/", validateRequest(playerSchemas.create), playerController.createPlayer);

/**
 * @openapi
 * /api/nba/player/admin/:
 *   get:
 *     summary: Retrieve all players, pending and approved. Meant for Commissioner.
 *     tags: [Players, Admin]
 *     responses:
 *       200:
 *         description: Players found and returned.
 */
router.get("/admin/", playerController.getAllPlayers);

/**
 * @openapi
 * /api/nba/player/:
 *   get:
 *     summary: Retrieve all approved active players. Meant for general users.
 *     tags: [Players, Users]
 *     responses:
 *       200:
 *         description: Players found and returned.
 */
router.get("/", playerController.getPlayers);

/**
 * @openapi
 * /api/nba/player/pending/:
 *   get:
 *     summary: Retrieve all pending. Meant for Commissioner.
 *     tags: [Players, Admin]
 *     responses:
 *       200:
 *         description: Players found and returned.
 */
router.get("/pending/", playerController.getPendingPlayers);

/**
 * @openapi
 * /api/nba/player/{id}:
 *   get:
 *     summary: Gets a player by Id. Meant for all users.
 *     tags: [Players, Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Player found.
 */
router.get("/:id", validateRequest(playerSchemas.getPlayerById), playerController.getPlayerById);

/**
 * @openapi
 * /api/nba/player/review/{id}:
 *   put:
 *     summary: Approves or Rejects Player by Id. Meant for Commissioner.
 *     tags: [Players, Admin]
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
 *               - approved
 *             properties:
 *               approved:
 *                 type: boolean
 *                  description: true approves player and updates status, false returns player.
 *     responses:
 *       200:
 *         description: Player review status updated.
 */
router.put("/review/:id", validateRequest(playerSchemas.reviewPlayer), playerController.reviewPlayer);

/**
 * @openapi
 * /api/nba/player/update/{id}:
 *   put:
 *     summary: Update an existing player. Meant for Coaches. Player is deactivated and sent to Commissioner for approval.
 *     tags: [Players]
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
 *             properties:
 *               name: string
 *               position: string
 *               currentTeam: string
 *               possession: number
 *               three: number
 *               layup: number
 *               defense: number
 *     responses:
 *       200:
 *         description: Player updated successfully.
 */
router.put("/update/:id", validateRequest(playerSchemas.update),  playerController.updatePlayer);


export default router;