import express, { Router } from "express";
import * as conferenceController from "../controllers/conferenceController";

const router: Router = express.Router();

router.put("/", conferenceController.updateConferences);

export default router;