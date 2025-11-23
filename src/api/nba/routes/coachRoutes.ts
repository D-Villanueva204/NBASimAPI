import express, { Router } from "express";
import * as coachController from "../controllers/coachController";


const router: Router = express.Router();

// Routes

router.post("/", coachController.createCoach);
router.get("/", coachController.getCoaches);
router.put("/", coachController.updateCoach);

export default router;