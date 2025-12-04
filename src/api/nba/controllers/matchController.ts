// Imports
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpConstants";
import { successResponse } from "../models/responseModel";
import { Match, archivedMatch } from "../models/matchSim/matchModel";
import * as matchService from "../services/matchService";

/**
 * 
 * Controller for setupMatch
 * 
 * @param req must contain homeTeam and awayTeam id's.
 * @param res outcome of scheduled match
 * @param next 
 */
export const setupMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const { awayTeam, homeTeam } = req.body;

        const pendingMatch: Match = await matchService.setupMatch({
            awayTeam, homeTeam
        });

        res.status(HTTP_STATUS.CREATED).json(
            successResponse(pendingMatch, "Game sent to Commissioner for Approval.")
        );
    }

    catch (error: unknown) {
        next(error);
    }
};

/**
 * 
 * Controller for getMatches
 * 
 * @param res returned pending matches
 * @param next 
 */
export const getMatches = async (res: Response, next: NextFunction): Promise<void> => {
    try {
        const matchData: Match[] = await matchService.getMatches();

        if (matchData.length > 0) {
            res.status(HTTP_STATUS.OK).json(
                successResponse(matchData, "All pending matches found and returned.")
            );
        }

    }
    catch (error) {
        next(error);

    }
};

/**
 * 
 * Controller for getGames
 * 
 * @param res returned approved matches
 * @param next 
 */
export const getGames = async (res: Response, next: NextFunction): Promise<void> => {
    try {
        const matchData: archivedMatch[] = await matchService.getGames();

        if (matchData.length > 0) {
            res.status(HTTP_STATUS.OK).json(
                successResponse(matchData, "Games found and returned.")
            );
        }

    }
    catch (error) {
        next(error);

    }
};

/**
 * 
 * Controller for getMatch
 * 
 * @param req must contain id
 * @param res returned match
 * @param next 
 */
export const getMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let id = String(req.params.id);

        const returnedMatch: Match = await matchService.getMatch(id);

        res.status(HTTP_STATUS.OK).json(successResponse(
            returnedMatch,
            "Match found"));
    }
    catch (error: unknown) {
        next(error);
    }

};

/**
 * 
 * Controller for playMatch
 * 
 * @param req must contain id
 * @param res status of match
 * @param next 
 */
export const playMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let id = String(req.params.id);

        const returnedMatch: Match = await matchService.playMatch(id);

        res.status(HTTP_STATUS.OK).json(successResponse(
            returnedMatch,
            "Game played"));
    }
    catch (error: unknown) {
        next(error);
    }
}

/**
 * 
 * Controller for reviewMatch
 * 
 * @param req must contain approved in body. Must contain id in params.
 * @param res returns approved match.
 * @param next 
 */
export const reviewMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let id = String(req.params.id);
        const { approved } = req.body;

        const reviewedMatch: Match = await matchService.reviewMatch(id, approved);

        res.status(HTTP_STATUS.OK).json
            (successResponse(reviewedMatch, "Game reviewed."));
    }
    catch (error: unknown) {
        next(error);
    }
};