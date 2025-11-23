import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpConstants";
import { successResponse } from "../models/responseModel";
import { Team } from "../models/teamModel";
import * as teamService from "../services/teamService"


export const createTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const { name} = req.body;

        const createdTeam: Team = await teamService.createTeam({
            name: name
        })


        res.status(HTTP_STATUS.CREATED).json(
            successResponse(createdTeam, "Team created.")
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

        const { newName } = req.body;

        const updatedTeam: Team = await teamService.updateTeamName(id, newName);

        res.status(HTTP_STATUS.OK).json(
            successResponse({ updatedTeam }, "Team name updated")
        );
    }
    catch (error: unknown) {
        next(error);
    }
};

export const updatePlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let id = String(req.params.id);

    const { playerId } = req.body;

    const updatedTeam: Team = await teamService.updatePlayer(id, playerId);

    res.status(HTTP_STATUS.OK).json(
        successResponse({ updatedTeam }, "Team updated")
    );
}

export const deletePlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let id = String(req.params.id);

    const { playerId } = req.body;

    const updatedTeam: Team = await teamService.deletePlayer(id, playerId);

    res.status(HTTP_STATUS.OK).json(
        successResponse({ updatedTeam }, "Team updated")
    );
}