import { Team } from "../teamModel";

export interface Player {
    id: string,
    status: boolean,
    name: string,
    position: string,
    currentTeam?: Team,
    possession: number,
    three: number,
    layup: number,
    defense: number,
    createdAt: Date;
    updatedAt: Date;
};