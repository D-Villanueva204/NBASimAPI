import { Coach } from "./people/coachModel";
import { Player } from "./people/playerModel";

export interface Team {
    name: string,
    players: Player[],
    record: Record,
    coach?: Coach,
    createdAt: Date;
    updatedAt: Date;
}

export interface Record {
    wins: number,
    losses: number
}