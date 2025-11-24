import { Team } from "../teamModel";
import { Possession } from "./possessionModel";

export interface Match {
    matchId: string,
    played: boolean,
    approved: boolean,
    homeTeam: Team,
    awayTeam: Team,
    possessions: Possession[] | null,
    createdAt: Date
}

export interface archivedMatch extends Match {
    outcome: {
        winner: Team,
        home: {
            score: number;
        };
        away: {
            score: number;
        };
    }
    finishedAt: Date
}
