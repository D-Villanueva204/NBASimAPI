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
            team: Team;
            score: number;
        };
        away: {
            team: Team;
            score: number;
        };
    }
    finishedAt: Date
}
