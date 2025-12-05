// Imports
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpConstants";
import { successResponse } from "../models/responseModel";
import { Team } from "../models/teamModel";
import * as teamService from "../services/teamService"

/**
 * 
 * Controller for createTeam
 * 
 * @param req must include name and conference
 * @param res created Team
 * @param next 
 */
export const createTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const { name, conference } = req.body;

        const createdTeam: Team = await teamService.createTeam({
            name: name,
            conference: conference
        })


        res.status(HTTP_STATUS.CREATED).json(
            successResponse(createdTeam, "Team created.")
        );
    }
    catch (error: unknown) {
        next(error);
    }
};

/**
 * 
 * Controller for getTeams
 * 
 * @param res retrieved teams
 * @param next 
 */
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

/**
 * 
 * Controller for getTeamById
 * 
 * @param req must require id
 * @param res returned team
 * @param next 
 */
export const getTeamById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        let id = String(req.params.id);

        const returnedTeam: Team = await teamService.getTeamById(id);

        res.status(HTTP_STATUS.OK).json(
            successResponse(returnedTeam, "Team found")
        );

    } catch (error) {
        next(error);

    };
};

/**
 * 
 * Controller for updateTeamName
 * 
 * @param req must require id for team. requires newName in body.
 * @param res updated team
 * @param next 
 */
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

/**
 * 
 * Controller for updatePlayer
 * 
 * @param req must require id for team. requires playerId in body
 * @param res updated team.
 * @param next 
 */
export const updatePlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let id = String(req.params.id);

        const { playerId } = req.body;

        const updatedTeam: Team = await teamService.updatePlayer(id, playerId);

        res.status(HTTP_STATUS.OK).json(
            successResponse({ updatedTeam }, "Team updated")
        );
    }
    catch (error: unknown) {
        next(error);
    }
}

/**
 * 
 * Controller for assignCoach
 * 
 * @param req must require id for team. requires coachId in body
 * @param res updated team
 * @param next 
 */
export const assignCoach = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let id = String(req.params.id);

        const { coachId } = req.body;

        const updatedTeam: Team = await teamService.updatePlayer(id, coachId);

        res.status(HTTP_STATUS.OK).json(
            successResponse({ updatedTeam }, "Team updated")
        );

    } catch (error: unknown) {
        next(error);
    }
}

/**
 * 
 * Controller for updatePlayer
 * 
 * @param req must require id for team. requires playerId in body
 * @param res updated team.
 * @param next 
 */
export const deletePlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let id = String(req.params.id);

        const { playerId } = req.body;

        const updatedTeam: Team = await teamService.deletePlayer(id, playerId);

        res.status(HTTP_STATUS.OK).json(
            successResponse({ updatedTeam }, "Team updated")
        );

    } catch (error: unknown) {
        next(error);
    }
}