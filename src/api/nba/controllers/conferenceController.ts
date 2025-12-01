import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpConstants";
import { successResponse } from "../models/responseModel";
import * as conferenceService from "../services/conferenceService";

export const updateConferences = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await conferenceService.updateConferences();

        res.status(HTTP_STATUS.OK).json(
            successResponse({}, "Conferences updated.")
        );

    }
    catch (error) {
        next(error);
    }
};
