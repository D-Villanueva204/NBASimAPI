import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpConstants";
import { successResponse } from "../models/responseModel";
// import { Player } from "../models/people/playerModel";


export const createPlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.status(HTTP_STATUS.CREATED).json(
            successResponse({}, "Player created")
        );
    }
    catch (error: unknown) {
        next(error);
    }
};


export const getAllPlayers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.status(HTTP_STATUS.OK).json(
            successResponse({}, "Player created")
        );
    }
    catch (error: unknown) {
        next(error);
    }
};

export const getPlayerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.status(HTTP_STATUS.OK).json(
            successResponse({}, "Player created")
        );
    }
    catch (error: unknown) {
        next(error);
    }
};

export const reviewPlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.status(HTTP_STATUS.OK).json(
            successResponse({}, "Player created")
        );
    }
    catch (error: unknown) {
        next(error);
    }
};

export const updatePlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.status(HTTP_STATUS.OK).json(
            successResponse({}, "Player created")
        );
    }
    catch (error: unknown) {
        next(error);
    }
};