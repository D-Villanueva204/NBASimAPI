import { Possession } from "./possessionModel";

export interface Match {
    matchId: string,
    played: boolean,
    approved: boolean,
    homeTeam: string,
    awayTeam: string,
    possessions: Possession[] | null,
    createdAt: Date
}

export interface archivedMatch extends Match {
    outcome: {
        winner: string,
        home: {
            score: number;
        };
        away: {
            score: number;
        };
    }
    finishedAt: Date
}
