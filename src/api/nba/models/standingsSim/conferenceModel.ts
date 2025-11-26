import { Team } from "../teamModel";

export interface Conference {
    id: String,
    name: String,
    topSeed: string,
    teams: Team[]
}