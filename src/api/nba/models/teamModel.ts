import { Coach } from "./people/coachModel";
import { Player } from "./people/playerModel";

export interface Team {
    id: string;
    name: string;
    pointGuard: Player | null;
    shootingGuard: Player | null;
    smallForward: Player | null;
    powerForward: Player | null;
    centre: Player | null;
    record?: Record;
    coach: Coach | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Record {
    wins: number,
    losses: number
}