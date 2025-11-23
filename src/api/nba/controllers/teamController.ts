import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpConstants";
import { successResponse } from "../models/responseModel";
import { Team } from "../models/teamModel";


export const createTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const { name, pointGuard, shootingGuard, smallForward, powerForward, centre, coach } = req.body;

        const createdCoach: Team = await teamService.createTeam({
            name: name,
            pointGuard: pointGuard,
            shootingGuard: shootingGuard,
            smallForward: smallForward,
            powerForward: powerForward,
            centre: centre,
            coach: coach
        })


        res.status(HTTP_STATUS.CREATED).json(
            successResponse(createdCoach, "Team created.")
        );
    }
    catch (error: unknown) {
        next(error);
    }
};

export const getTeams = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const teamData: Team[] = await teamService.getTeams();

        if (teamData.length > 0) {
            res.status(HTTP_STATUS.OK).json(
                successResponse(teamData, "Teams found and returned.")
            );
        }

    }
    catch (error) {
        next(error);

    }

};

export const updateTeamName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        let id = String(req.params.id);

        const { name } = req.body;

        const updatedTeam: Team = await teamService.updateCoach(id, { name });

        res.status(HTTP_STATUS.OK).json(
            successResponse({ updatedTeam }, "Team name updated")
        );
    }
    catch (error: unknown) {
        next(error);
    }
};
