import { Team } from "../teamModel";
import { Possession } from "./possessionModel";

export interface Match {
    homeTeam: Team,
    awayTeam: Team,
    possessions: Possession[]
}