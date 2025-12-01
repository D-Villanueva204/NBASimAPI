import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpConstants";
import { successResponse } from "../models/responseModel";
import { Coach } from "../models/people/coachModel";
import * as coachService from "../services/coachService"

export const createCoach = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const { name, currentTeam } = req.body;

        const createdCoach: Coach = await coachService.createCoach({
            name: name,
            currentTeam: currentTeam
        })


        res.status(HTTP_STATUS.CREATED).json(
            successResponse(createdCoach, "Coach created.")
        );
    }
    catch (error: unknown) {
        next(error);
    }
};

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
