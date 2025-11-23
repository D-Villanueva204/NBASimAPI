import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpConstants";
import { successResponse } from "../models/responseModel";
import { Player } from "../models/people/playerModel";
import * as playerService from "../services/playerService"


export const createPlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const { name,
            currentTeam,
            position,
            possession,
            three,
            layup,
            defense } = req.body;

        const pendingPlayer: Player = await playerService.createPlayer({
            name: name,
            currentTeam: currentTeam,
            position: position,
            possession: possession,
            three: three,
            layup: layup,
            defense: defense
        })


        res.status(HTTP_STATUS.CREATED).json(
            successResponse(pendingPlayer, "Player sent to Commissioner for Approval.")
        );
    }
    catch (error: unknown) {
        next(error);
    }
};


export const getAllPlayers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const playerData: Player[] = await playerService.getAllPlayers();

        if (playerData.length > 0) {
            res.status(HTTP_STATUS.OK).json(
                successResponse(playerData, "Players found and returned.")
            );
        }

    }
    catch (error) {
        next(error);

    }
};

export const getPlayers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const playerData: Player[] = await playerService.getPlayers();

        if (playerData.length > 0) {
            res.status(HTTP_STATUS.OK).json(
                successResponse(playerData, "Players found and returned.")
            );
        }

    }
    catch (error) {
        next(error);

    }
};

export const getPendingPlayers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const playerData: Player[] = await playerService.getPendingPlayers();

        if (playerData.length > 0) {
            res.status(HTTP_STATUS.OK).json(
                successResponse(playerData, "Pending Players found and returned.")
            );
        }

    }
    catch (error) {
        next(error);

    }
};


export const getPlayerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let id = String(req.params.id);

        const retrievedPlayer: Player = await playerService.getPlayerById(id);

        res.status(HTTP_STATUS.OK).json(successResponse(
            retrievedPlayer,
            "Player found"));
    }
    catch (error: unknown) {
        next(error);
    }
};

export const reviewPlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let id = String(req.params.id);
        const { approved } = req.body;

        const approvedPlayer: Player = await playerService.reviewPlayer(id, approved);

        res.status(HTTP_STATUS.OK).json
            (successResponse(approvedPlayer, "Player status set."));
    }
    catch (error: unknown) {
        next(error);
    }
};

export const updatePlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        let id = String(req.params.id);

        const { name, position, currentTeam, possession, three, layup, defense } = req.body;

        const updatedPlayer: Player = await playerService.updatePlayer(id, {
            name, position, currentTeam, possession, three, layup, defense
        })

        res.status(HTTP_STATUS.OK).json(
            successResponse({updatedPlayer}, "Player updated")
        );
    }
    catch (error: unknown) {
        next(error);
    }
};