// Imports
import { Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpConstants";
import { successResponse } from "../models/responseModel";
import * as conferenceService from "../services/conferenceService";

/**
 * 
 * Controller for updateConferences.
 * 
 * @param res Confirmation message
 * @param next 
 */
export const updateConferences = async (res: Response, next: NextFunction): Promise<void> => {
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
