import express, { Router } from "express";
import { setUserClaims } from "../controllers/adminController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
const router: Router = express.Router();

router.post(
    "/setUserClaims",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    setUserClaims
);

export default router;
