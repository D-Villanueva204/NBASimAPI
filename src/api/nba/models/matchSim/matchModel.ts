import { BoxScore } from "./boxScoreModel";
/**
 * Used for Match creation and structure
 * 
 */
export interface Match {
    matchId: string,
    played: boolean,
    approved: boolean,
    homeTeam: string,
    awayTeam: string,
    possessions: string,
    createdAt: Date
}

/**
 * Used for approved matches. Used for easily showing results and statistics.
 * 
 * 
 */
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
    boxScore: BoxScore,
    finishedAt: Date
}
