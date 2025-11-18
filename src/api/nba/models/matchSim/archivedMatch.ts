import { Team } from "../teamModel";
import { Match } from "./matchModel";

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
