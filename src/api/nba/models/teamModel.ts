import { Coach } from "./people/coachModel";
import { Player } from "./people/playerModel";

export interface Team {
    name: string,
    players: Player[],
    record: number[],
    coach?: Coach,
    createdAt: Date;
    updatedAt: Date;
}