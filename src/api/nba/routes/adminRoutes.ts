import express, { Router } from "express";
import { setUserClaims } from "../controllers/adminController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

/**
 * @openapi
 * /api/nba/admin/setUserClaims:
 *   post:
 *     summary: Sets custom user claims in Firebase Authentication.
 *     description: Allows administrators to assign or update custom roles for a user.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uid
 *               - claims
 *             properties:
 *               uid:
 *                 type: string
 *                 description: Firebase Authentication UID of the user.
 *                 example: "abc123UID"
 *               claims:
 *                 type: object
 *                 description: Custom claims to assign to the user.
 *                 example:
 *                   role: "coach"
 *     responses:
 *       '200':
 *         description: User claims updated successfully.
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
 *                   example: "Custom claims updated."
 */
router.post(
    "/setUserClaims",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    setUserClaims
);

export default router;
