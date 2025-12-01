import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpConstants";
import { successResponse } from "../models/responseModel";
import { Possessions } from "../models/matchSim/possessionModel";
import * as possessionsService from "../services/possessionsService"

export const getPossessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let id = String(req.params.id);

        const returnedEvents: Possessions = await possessionsService.getPossessions(id);

        res.status(HTTP_STATUS.OK).json(successResponse(
            returnedEvents,
            "Match events returned"));
    }
    catch (error: unknown) {
        next(error);
    }
};