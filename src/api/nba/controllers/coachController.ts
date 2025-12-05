// Imports
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpConstants";
import { successResponse } from "../models/responseModel";
import { Coach } from "../models/people/coachModel";
import * as coachService from "../services/coachService"

/**
 * 
 * Controller for createCoach.
 * 
 * @param req contains name, currentTeam.
 * @param res response of operation
 * @param next 
 */
export const createCoach = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const { name, currentTeam } = req.body;

        const createdCoach: Coach = await coachService.createCoach({
            name: name,
            currentTeam: currentTeam
        });


        res.status(HTTP_STATUS.CREATED).json(
            successResponse(createdCoach, "Coach created.")
        );
    }
    catch (error: unknown) {
        next(error);
    }
};

/**
 * 
 * Controller for getCoaches.
 * 
 * @param req 
 * @param res Data received.
 * @param next 
 */
export const getCoaches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const coachData: Coach[] = await coachService.getCoaches();

        if (coachData.length > 0) {
            res.status(HTTP_STATUS.OK).json(
                successResponse(coachData, "Coaches found and returned.")
            );
        }
    }
    catch (error) {
        next(error);

    }
};

/**
 * 
 * Controller for getCoachById
 * 
 * @param req path parameters must contain id.
 * @param res returned coach.
 * @param next 
 */
export const getCoachById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = String(req.params.id);

        const returnedCoach: Coach = await coachService.getCoachById(id);

        res.status(HTTP_STATUS.OK).json(
            successResponse(returnedCoach, "Coach found")
        );

    } catch (error) {
        next(error);
    }

}

/**
 * 
 * Controller for updateCoach
 * 
 * @param req path parameters must contain id. May contain name or currentTeam.
 * @param res updatedCoach
 * @param next 
 */
export const updateCoach = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        let id = String(req.params.id);

        const { name, currentTeam } = req.body;

        const updatedCoach: Coach = await coachService.updateCoach(id, { name, currentTeam });

        res.status(HTTP_STATUS.OK).json(
            successResponse({ updatedCoach }, "Coach updated")
        );
    }
    catch (error: unknown) {
        next(error);
    }
};
