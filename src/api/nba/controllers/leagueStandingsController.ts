// Imports
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpConstants";
import { successResponse } from "../models/responseModel";
import { LeagueStandings } from "../models/standingsSim/leagueStandingsModel";
import * as leagueStandingsService from "../services/leagueStandingsService";

/**
 * 
 * Controller for createNewStandings
 * 
 * @param res standings created
 * @param next 
 */
export const createNewStandings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const newStandings: LeagueStandings = await leagueStandingsService.createNewStandings();

        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newStandings, "Standings created for new season.")
        );
    }
    catch (error: unknown) {
        next(error);
    }
};

/**
 * 
 * Controller for getStandings
 * 
 * @param res All standings retrieved
 * @param next 
 */
export const getStandings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const standings: LeagueStandings[] = await leagueStandingsService.getStandings();

        res.status(HTTP_STATUS.OK).json(
            successResponse(standings, "All standings retrieved.")
        );
    }
    catch (error: unknown) {
        next(error);
    }
};

/**
 * 
 * Controller for getStandingsBySeason
 * 
 * @param req must contain 'season'
 * @param res 
 * @param next 
 */
export const getStandingsBySeason = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const season: string = req.params.season;

        const standings: LeagueStandings = await leagueStandingsService.getStandingsBySeason(season);

        res.status(HTTP_STATUS.OK).json(
            successResponse(standings, "Standings found.")
        );
    }
    catch (error: unknown) {
        next(error);
    }
};

/**
 * 
 * Controller for updateStandings
 * 
 * @param req must contain 'season'
 * @param res 
 * @param next 
 */
export const updateStandings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const season: string = req.params.season;

        const updatedStandings: LeagueStandings = await leagueStandingsService.updateStandings(season);

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedStandings, "Standings updated.")
        );
    }
    catch (error: unknown) {
        next(error);
    }
};
