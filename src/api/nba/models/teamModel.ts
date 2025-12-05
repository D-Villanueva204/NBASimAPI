import { Coach } from "./people/coachModel";
import { Player } from "./people/playerModel";
import { ConferenceType } from "./standingsSim/conferenceModel";

/**
 * Used for holding Team attributes, and players.
 * 
 */
export interface Team {
    id: string;
    name: string; 
    conference: ConferenceType;
    pointGuard: Player | null;
    shootingGuard: Player | null;
    smallForward: Player | null;
    powerForward: Player | null;
    centre: Player | null;
    record: Record;
    coach: Coach | null;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Used for formatting wins and losses of a team.
 * 
 */
export interface Record {
    wins: number,
    losses: number
}