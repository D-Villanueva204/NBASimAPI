import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpConstants";
import { successResponse, errorResponse } from "../models/responseModel";
import { Player } from "../models/people/playerModel";


export const createPlayer = async (req: Request, res: Response): Promise<void> => {

        // POST nba/player/
};


export const getAllPlayers = async (req: Request, res: Response): Promise<void> => {
    
    // GET nba/player/
};

export const getPlayerById = async (req: Request, res: Response): Promise<void> => {
    
    // GET nba/player/:id
};

export const reviewPlayer = async (req: Request, res: Response): Promise<void> => {

        // PUT nba/player/review/:id
};

export const updatePlayer = async (req: Request, res: Response): Promise<void> => {

        // PUT nba/player/status/:id
};