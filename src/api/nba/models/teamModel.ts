import { Coach } from "./people/coachModel";
import { Player } from "./people/playerModel";

export interface Team {
    name: string,
    pointGuard?: Player,
    shootingGuard?: Player,
    smallForward?: Player,
    powerForward?: Player,
    centre?: Player,
    record?: Record,
    coach?: Coach,
    createdAt: Date;
    updatedAt: Date;
}

export interface Record {
    wins: number,
    losses: number
}